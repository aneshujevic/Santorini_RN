import {createAction} from '@reduxjs/toolkit';
import axios from 'axios';

import {
  createJsonRequestAiMove,
  createJsonRequestAvailableMoves,
} from '../server_communication/serializers';

import {
  buildBlock,
  moveBuilder,
  selectBuilder,
  setUpBuilder,
  unselectBuilder,
} from './playerMoveActions';
import {GameStatesEnum} from '../gameStatesEnum';
import {alertMessage, dialogueNewGame} from '../utils';

const getAvailableMovesURL = 'http://10.0.2.2:8000/getAvailableMoves/';
const getAvailableBuildsURL = 'http://10.0.2.2:8000/getAvailableBuilds/';
const getMoveMinmaxAiURL = 'http://10.0.2.2:8000/minimax/';
const getMoveAlphaBetaAiURL = 'http://10.0.2.2:8000/alphaBeta/';
const getMoveAlphaBetaCustomAiURL = 'http://10.0.2.2:8000/alphaBetaCustom/';
const defaultDepth = 4;

export const setAvailableMoves = createAction('SET_AVAILABLE_MOVES_BUILDS');

export const setUpAiBuilders = createAction('SET_UP_AI_BUILDERS');

export const changeGameEngineState = createAction('CHANGE_GAME_ENGINE_STATE');

export const checkWin = createAction('CHECK_WIN');

export const resetMovesGlowing = createAction('RESET_GLOWING_MOVES');

function getAvailableMoves(url, customBuilderCoords: undefined) {
  return (dispatch, getState) => {
    const state = getState().gameState;
    const data = createJsonRequestAvailableMoves(customBuilderCoords, state);

    axios
      .post(url, data)
      .then(response => response.data.moves.map(x => x[0] * 5 + x[1]))
      .then(formattedResponse => {
        console.log(formattedResponse);
        dispatch(
          setAvailableMoves({availableMovesOrBuilds: formattedResponse}),
        );
      })
      .catch(err => console.log(err));
  };
}

function getAiMove(url, depth) {
  return (dispatch, getState) => {
    const state = getState().gameState;

    const data = createJsonRequestAiMove(state, depth);
    dispatch(changeGameEngineState(GameStatesEnum.WAITING_AI_MOVE));

    axios
      .post(url, data)
      .then(response => {
        const buildersID = response.data.id;
        const move = response.data.move[0] * 5 + response.data.move[1];
        const build = response.data.build[0] * 5 + response.data.build[1];
        const coordinatesMoveFrom =
          buildersID === 1 ? state.firstHe : state.secondHe;
        dispatch(
          moveBuilder({
            fromCell: coordinatesMoveFrom,
            toCell: move,
            fromAi: true,
          }),
        );
        dispatch(buildBlock({onCell: build}));
        dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
        dispatch(checkWinTrigger());
      })
      .catch(err => console.log(err));
  };
}

function setUpAiBuildersTrigger() {
  return (dispatch, getState) => {
    const state = getState().gameState;
    const firstJULocal = state.firstJu;
    const secondJULocal = state.secondJu;

    let firstHe = 0;
    let secondHe = 0;

    let combinationsFirst = [7, 6, 8];
    let combinationsSecond = [17, 18, 19];

    for (let i = 0; i < 3; i++) {
      if (
        combinationsFirst[i] !== firstJULocal &&
        combinationsFirst[i] !== secondJULocal &&
        firstHe === 0
      ) {
        firstHe = combinationsFirst[i];
      }

      if (
        combinationsSecond[i] !== firstJULocal &&
        combinationsSecond[i] !== secondJULocal &&
        secondHe === 0
      ) {
        secondHe = combinationsSecond[i];
      }

      if (firstHe && secondHe) {
        break;
      }
    }

    dispatch(setUpAiBuilders({firstHe: firstHe, secondHe: secondHe}));
    dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
  };
}

function checkWinTrigger() {
  return (dispatch, state) => {
    if (state.gameEnded) {
      return;
    }

    // let firstJU = state.firstJu;
    // let secondJU = state.secondJu;
    // let firstHE = state.firstHe;
    // let secondHE = state.secondHe;
    let gameEnded = false;

    // TODO: solve the bug around here Array[0] = 0 as response ? or implement a check :)
    // if (
    //   dispatch(getAvailableMoves(getAvailableMovesURL, firstJU)) &&
    //   state.availableMovesOrBuilds.length === 0 &&
    //   dispatch(getAvailableMoves(getAvailableMovesURL, secondJU)) &&
    //   state.availableMovesOrBuilds.length === 0
    // ) {
    //   gameEnded = true;
    //   alertMessage('AI won!!!!');
    // } else if (
    //   dispatch(getAvailableMoves(getAvailableMovesURL, firstHE)) &&
    //   state.availableMovesOrBuilds.length === 0 &&
    //   dispatch(getAvailableMoves(getAvailableMovesURL, secondHE)) &&
    //   state.availableMovesOrBuilds.length === 0
    // ) {
    //   gameEnded = true;
    //   alertMessage('Human won!!!!!');
    // }

    dispatch(checkWin(gameEnded));
    // dispatch(resetMovesGlowing());
  };
}

export function doPlayerMoveHuAi(idOfCell) {
  return (dispatch, getState) => {
    const engineState = getState().gameState.gameEngineState;
    const gameState = getState().gameState;

    if (gameState.gameEnded) {
      dialogueNewGame('The party is over, start another one?');
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        dispatch(setUpBuilder(idOfCell));
        if (
          getState().gameState.gameEngineState ===
          GameStatesEnum.WAITING_AI_SETUP_MOVES
        ) {
          dispatch(doPlayerMoveHuAi());
        }
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        if (idOfCell !== gameState.firstJu && idOfCell !== gameState.secondJu) {
          alertMessage('Please choose your builder.');
          return;
        }

        dispatch(selectBuilder(idOfCell));
        dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_MOVE));
        dispatch(getAvailableMoves(getAvailableMovesURL));
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
          dispatch(getAvailableMoves(getAvailableBuildsURL));
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
        dispatch(getAiMove(getMoveAlphaBetaCustomAiURL, defaultDepth));
        return;
      case GameStatesEnum.WAITING_AI_MOVE:
        return;
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        return;
      case GameStatesEnum.WAITING_AI_SETUP_MOVES:
        dispatch(setUpAiBuildersTrigger());
        return;
    }
  };
}
