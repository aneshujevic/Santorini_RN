import {createReducer} from '@reduxjs/toolkit';

import {
  buildBlock,
  moveBuilder,
  selectBuilder,
  setUpJuBuilder,
  toggleMinNext,
  unselectBuilder,
} from '../actions/playerMoveActions';
import {GameStatesEnum, GameTypesEnum} from '../gameStatesEnum';
import {
  changeGameEngineState,
  checkWin,
  resetMovesGlowing,
  resetState,
  setAvailableMoves,
  setGameType,
  setUpHeBuilder,
} from '../actions/gameEngineActions';
import {alertMessage, dialogueNewGame} from '../utils';
import {preloadedState} from '../store/preloadedState';

const mainReducer = createReducer(preloadedState.gameState, {
  [setUpJuBuilder]: (state, action) => {
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
    state.selected = action.payload;
  },
  [unselectBuilder]: (state, action) => {
    state.selected = -1;
    state.availableMovesOrBuilds = Array(25).fill(0);
    state.glowingCells = Array(25).fill(false);
  },
  [moveBuilder]: (state, action) => {
    const fromCell = action.payload.fromCell
      ? action.payload.fromCell
      : state.selected;
    const toCell = action.payload.toCell;

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
  },
  [buildBlock]: (state, action) => {
    const onCell = action.payload.onCell;

    state.cells[onCell] += 1;

    state.selected = -1;
    state.glowingCells = Array(25).fill(false);
    state.availableMovesOrBuilds = Array(25).fill(0);
  },
  [setAvailableMoves]: (state, action) => {
    state.availableMovesOrBuilds = action.payload.availableMovesOrBuilds;
    state.glowingCells = Array(25).fill(false);
    action.payload.availableMovesOrBuilds.map(
      glowingIndex => (state.glowingCells[glowingIndex] = true),
    );
  },
  [setUpHeBuilder]: (state, action) => {
    const cellIndex = action.payload;

    if (state.cells[cellIndex] === 0) {
      if (state.firstHe === -1) {
        state.firstHe = cellIndex;
      } else {
        state.secondHe = cellIndex;
      }
      state.cells[cellIndex] = 5;
    }
  },
  [changeGameEngineState]: (state, action) => {
    state.gameEngineState = action.payload;
  },
  [checkWin]: (state, action) => {
    if (action.payload === true) {
      state.gameEnded = true;
      return;
    }

    const index = state.cells.findIndex(x => x === 12 || x === 8);

    if (index !== -1) {
      if (state.cells[index] === 8) {
        alertMessage('AI won!');
      } else {
        alertMessage('Human won!');
      }
      state.gameEnded = true;
    }
  },
  [resetMovesGlowing]: state => {
    state.availableMovesOrBuilds = Array(25).fill(0);
    state.glowingCells = Array(25).fill(false);
  },
  [setGameType]: (state, action) => {
    state.gameType = action.payload;
  },
  [resetState]: state => {
    state = preloadedState.gameState;
    return state;
  },
  [toggleMinNext]: state => {
    state.minNext = !state.minNext;
  },
});

export default mainReducer;
