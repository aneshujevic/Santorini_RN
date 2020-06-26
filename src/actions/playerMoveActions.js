import {createAction} from '@reduxjs/toolkit';
import {GameStatesEnum, GameTypesEnum} from '../gameStatesEnum';
import {alertMessage, dialogueNewGame} from '../utils';
import {
  changeGameEngineState,
  checkWinTrigger,
  setUpAiAiBuildersTrigger,
  setUpAiBuildersTrigger,
} from './gameEngineActions';
import {
  getAndDoAiMove,
  getAvailableMovesBuilds,
} from '../server_communication/movesThunks';

const getAvailableMovesURL = 'getAvailableMoves';
const getAvailableBuildsURL = 'getAvailableBuilds';
const getMoveMinmaxAiURL = 'http://10.0.2.2:8000/minimax/';
const getMoveAlphaBetaAiURL = 'http://10.0.2.2:8000/alphaBeta/';
const getMoveAlphaBetaCustomAiURL = 'http://10.0.2.2:8000/alphaBetaCustom/';

export const moveBuilder = createAction('MOVE_BUILDER');

export const buildBlock = createAction('BUILD_BLOCK');

export const selectBuilder = createAction('SELECT_BUILDER');

export const unselectBuilder = createAction('UNSELECT_BUILDER');

export const setUpJuBuilder = createAction('SET_UP_JU_BUILDER');

export const toggleMinNext = createAction('TOGGLE_MINIMIZER_NEXT');

export function doMove(idOfCell) {
  return (dispatch, getState) => {
    const gameState = getState().gameState;

    switch (gameState.gameType) {
      case GameTypesEnum.HUMAN_VS_AI:
        dispatch(doPlayerMoveHuAi(idOfCell));
        break;
      case GameTypesEnum.HUMAN_VS_HUMAN:
        dispatch(doPlayerMoveHuHu(idOfCell));
        break;
      case GameTypesEnum.AI_VS_AI:
        dispatch(doPlayerMoveAiAi());
        break;
    }
  };
}

export function doPlayerMoveHuAi(idOfCell) {
  return (dispatch, getState) => {
    const engineState = getState().gameState.gameEngineState;
    const gameState = getState().gameState;

    if (gameState.gameEnded) {
      dispatch(dialogueNewGame('The party is over, start another one?'));
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        dispatch(setUpJuBuilder(idOfCell));
        if (
          getState().gameState.gameEngineState ===
          GameStatesEnum.WAITING_AI_SETUP_MOVES
        ) {
          dispatch(doPlayerMoveHuAi());
        }
        return;
      case GameStatesEnum.WAITING_AI_SETUP_MOVES:
        dispatch(setUpAiBuildersTrigger());
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        if (idOfCell !== gameState.firstJu && idOfCell !== gameState.secondJu) {
          alertMessage('Please choose your builder.');
          return;
        }

        dispatch(selectBuilder(idOfCell));
        dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_MOVE));
        dispatch(getAvailableMovesBuilds(getAvailableMovesURL));
        return;
      case GameStatesEnum.CHOOSING_MOVE:
        if (idOfCell === gameState.selected) {
          dispatch(unselectBuilder());
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
        } else {
          if (
            gameState.availableMovesOrBuilds.find(x => x === idOfCell) ===
            undefined
          ) {
            alertMessage('Cannot move builder here, please try again.');
            return;
          }
          dispatch(moveBuilder({toCell: idOfCell}));
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILD));
          dispatch(checkWinTrigger());
          dispatch(getAvailableMovesBuilds(getAvailableBuildsURL));
        }
        return;
      case GameStatesEnum.CHOOSING_BUILD:
        if (
          gameState.availableMovesOrBuilds.find(x => x === idOfCell) ===
          undefined
        ) {
          alertMessage('Cannot build here, please try again.');
          return;
        }

        dispatch(buildBlock({onCell: idOfCell}));
        dispatch(changeGameEngineState(GameStatesEnum.DO_AI_MOVE));

        if (idOfCell) {
          dispatch(doPlayerMoveHuAi());
        }
        return;
      case GameStatesEnum.DO_AI_MOVE:
        dispatch(changeGameEngineState(GameStatesEnum.WAITING_AI_MOVE));
        dispatch(getAndDoAiMove());
        return;
      case GameStatesEnum.WAITING_AI_MOVE:
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        alertMessage('Waiting for server to respond, please wait..');
        return;
    }
  };
}

function doPlayerMoveHuHu(idOfCell) {
  return (dispatch, getState) => {
    alertMessage('huhu move');
  };
}

function doPlayerMoveAiAi() {
  return (dispatch, getState) => {
    const engineState = getState().gameState.gameEngineState;
    const gameState = getState().gameState;

    if (gameState.gameEnded) {
      dispatch(dialogueNewGame('The party is over, start another one?'));
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
      case GameStatesEnum.WAITING_AI_SETUP_MOVES:
        dispatch(setUpAiAiBuildersTrigger());
        return;
      case GameStatesEnum.DO_AI_MOVE:
        dispatch(changeGameEngineState(GameStatesEnum.WAITING_AI_MOVE));
        dispatch(getAndDoAiMove(true));
        dispatch(toggleMinNext());
        return;
      case GameStatesEnum.WAITING_AI_MOVE:
        alertMessage('Waiting for server to respond, please wait..');
        return;
    }
  };
}
