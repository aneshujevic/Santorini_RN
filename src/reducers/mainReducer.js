import {createReducer} from '@reduxjs/toolkit';

import {
  buildBlock,
  moveBuilder,
  selectBuilder,
  setUpBuilder,
  unselectBuilder,
} from '../actions/playerMoveActions';
import {GameStatesEnum} from '../gameStatesEnum';
import {
  checkWin,
  setAvailableMoves,
  setUpAiBuilders,
  setWaitAiMove,
  unsetWaitAiMove,
} from '../actions/gameEngineActions';

const initState = {
  gameEngineState: GameStatesEnum.SETTING_UP_BUILDERS,
  cells: Array(25).fill(0),
  firstHe: -1,
  secondHe: -1,
  firstJu: -1,
  secondJu: -1,
  selected: -1,
  availableMovesOrBuilds: [],
  glowingCells: Array(25).fill(false),
  gameEnded: false,
};

const mainReducer = createReducer(initState, {
  [setUpBuilder]: (state, action) => {
    const cellIndex = action.payload;

    if (state.cells[cellIndex] === 0) {
      if (state.firstJu === -1) {
        state.firstJu = cellIndex;
        state.gameEngineState = GameStatesEnum.SETTING_UP_BUILDERS;
      } else {
        state.secondJu = cellIndex;
        state.gameEngineState = GameStatesEnum.WAITING_AI_SETUP_MOVES;
      }

      state.cells[cellIndex] = 9;
    } else {
      alertMessage('This cell is already taken, please try again.');
    }
  },
  [selectBuilder]: (state, action) => {
    const selectedId = action.payload;

    if (selectedId !== state.firstJu && selectedId !== state.secondJu) {
      alertMessage('Please choose your builder.');
      return;
    }

    state.selected = selectedId;
    state.gameEngineState = GameStatesEnum.CHOOSING_MOVE;
  },
  [unselectBuilder]: (state, action) => {
    state.selected = -1;
    state.gameEngineState = GameStatesEnum.CHOOSING_BUILDER;
    state.availableMovesOrBuilds = Array(25).fill(0);
    state.glowingCells = Array(25).fill(false);
  },
  [moveBuilder]: (state, action) => {
    const fromCell = action.payload.fromCell
      ? action.payload.fromCell
      : state.selected;
    const toCell = action.payload.toCell;
    const overrideDefault = action.payload.fromAi;

    if (
      !overrideDefault &&
      state.availableMovesOrBuilds.find(x => x === toCell) === undefined
    ) {
      alertMessage('Cannot move builder here, please try again.');
      return;
    }

    const multiplier = Math.floor((state.cells[fromCell] + 1) / 5);

    const oldValueOfCell = state.cells[fromCell];

    state.cells[fromCell] =
      oldValueOfCell >= 9
        ? (state.cells[fromCell] + 1) % 5
        : state.cells[fromCell] % 5;

    state.cells[toCell] =
      oldValueOfCell >= 9
        ? 5 * multiplier + state.cells[toCell] - 1
        : 5 * multiplier + state.cells[toCell];

    state.firstHe = state.firstHe === fromCell ? toCell : state.firstHe;
    state.secondHe = state.secondHe === fromCell ? toCell : state.secondHe;
    state.firstJu = state.firstJu === fromCell ? toCell : state.firstJu;
    state.secondJu = state.secondJu === fromCell ? toCell : state.secondJu;

    state.selected = toCell;
    state.gameEngineState = GameStatesEnum.CHOOSING_BUILD;
  },
  [buildBlock]: (state, action) => {
    const onCell = action.payload.onCell;
    const overrideDefault = action.payload.fromAi;

    if (
      !overrideDefault &&
      state.availableMovesOrBuilds.find(x => x === onCell) === undefined
    ) {
      alertMessage('Cannot build here, please try again.');
      return;
    }

    state.cells[onCell] += 1;

    state.selected = -1;
    state.glowingCells = Array(25).fill(false);
    state.availableMovesOrBuilds = Array(25).fill(0);
    state.gameEngineState = GameStatesEnum.WAITING_AI_MOVE;
  },
  [setWaitAiMove]: (state, action) => {
    state.gameEngineState = GameStatesEnum.WAITING_AI_MOVE;
  },
  [unsetWaitAiMove]: (state, action) => {
    state.gameEngineState = GameStatesEnum.CHOOSING_BUILDER;
  },
  [setAvailableMoves]: (state, action) => {
    state.availableMovesOrBuilds = action.payload.availableMovesOrBuilds;
    state.glowingCells = Array(25).fill(false);
    action.payload.availableMovesOrBuilds.map(
      glowingIndex => (state.glowingCells[glowingIndex] = true),
    );
  },
  [setUpAiBuilders]: (state, action) => {
    const firstHe = action.payload.firstHe;
    const secondHe = action.payload.secondHe;

    state.firstHe = firstHe;
    state.secondHe = secondHe;
    state.cells[firstHe] = 5;
    state.cells[secondHe] = 5;
    state.gameEngineState = GameStatesEnum.CHOOSING_BUILDER;
  },
  [checkWin]: (state, action) => {
    if (action.payload === true) {
      state.gameEnded = true;
      return;
    }

    const index = state.cells.findIndex(x => x === 12 || x === 8);

    if (index !== -1) {
      switch (state.cells[index]) {
        case 8:
          alertMessage('AI won!');
          break;
        case 12:
          alertMessage('Human won!');
          break;
      }
      state.gameEnded = true;
      // TODO: popup dialogue
      // if (window.confirm('Do you want to play another game?')) {
      //   window.location.reload();
      // }
      return;
    }

    if (state.gameEnded) {
      replayGame();
    }
  },
});

function replayGame() {
  // TODO: popup dialogue and replay
  // if (window.confirm('Do you want to play another game?')) {
  //   window.location.reload();
  // }
}

function alertMessage(message) {
  console.log(message);
  //Alert.Alert('Warning', message, [{text: 'OK'}]);
}

export default mainReducer;
