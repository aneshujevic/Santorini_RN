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
import Alert from 'react-native';

const getAvailableMovesURL = 'http://10.0.2.2:8000/getAvailableMoves/';
const getAvailableBuildsURL = 'http://10.0.2.2:8000/getAvailableBuilds/';
const getMoveMinmaxAiURL = 'http://10.0.2.2:8000/minimax/';
const getMoveAlphaBetaAiURL = 'http://10.0.2.2:8000/alphaBeta/';
const getMoveAlphaBetaCustomAiURL = 'http://10.0.2.2:8000/alphaBetaCustom/';
const defaultDepth = 3;

export const setWaitAiMove = createAction('SET_WAIT_AI_MOVE');

export const unsetWaitAiMove = createAction('UNSET_WAIT_AI_MOVE');

export const setAvailableMoves = createAction('SET_AVAILABLE_MOVES_BUILDS');

export const setUpAiBuilders = createAction('SET_UP_AI_BUILDERS');

export const checkWin = createAction('CHECK_WIN');

function getAvailableMoves(url, customBuilderCoords: undefined) {
  return (dispatch, getState) => {
    const state = getState().gameState;
    const data = createJsonRequestAvailableMoves(customBuilderCoords, state);

    axios
      .post(url, data)
      .then(response => response.data.moves.map(x => x[0] * 5 + x[1]))
      .then(formattedResponse =>
        dispatch(
          setAvailableMoves({availableMovesOrBuilds: formattedResponse}),
        ),
      )
      .catch(err => console.log(err));
  };
}

function getAiMove(url, depth) {
  return (dispatch, getState) => {
    const state = getState().gameState;

    const data = createJsonRequestAiMove(state, depth);
    dispatch(setWaitAiMove());

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
        dispatch(buildBlock({fromAi: true, onCell: build}));
        dispatch(unsetWaitAiMove());
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
  };
}

function checkWinTrigger() {
  return (dispatch, state) => {
    if (state.gameEnded) {
      return;
    }

    let firstJU = state.firstJU;
    let secondJU = state.secondJU;
    let firstHE = state.firstHE;
    let secondHE = state.secondHE;
    let gameEnded = false;

    if (
      getAvailableMoves(getAvailableMovesURL, firstJU).length === 0 &&
      getAvailableMoves(getAvailableMovesURL, secondJU).length === 0
    ) {
      gameEnded = true;
      alertMessage('AI won!');
    } else if (
      getAvailableMoves(getAvailableMovesURL, firstHE).length === 0 &&
      getAvailableMoves(getAvailableMovesURL, secondHE).length === 0
    ) {
      gameEnded = true;
      alertMessage('Human won!');
    }

    dispatch(checkWin(gameEnded));
  };
}

export function doPlayerMove(idOfCell) {
  return (dispatch, getState) => {
    const engineState = getState().gameState.gameEngineState;
    const gameState = getState().gameState;

    if (gameState.gameEnded) {
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        dispatch(setUpBuilder(idOfCell));
        if (
          getState().gameState.gameEngineState ===
          GameStatesEnum.WAITING_AI_SETUP_MOVES
        ) {
          dispatch(doPlayerMove());
        }
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        dispatch(selectBuilder(idOfCell));
        dispatch(getAvailableMoves(getAvailableMovesURL));
        return;
      case GameStatesEnum.CHOOSING_MOVE:
        if (idOfCell === gameState.selected) {
          dispatch(unselectBuilder());
        } else {
          dispatch(moveBuilder({toCell: idOfCell}));
          dispatch(getAvailableMoves(getAvailableBuildsURL));
        }
        return;
      case GameStatesEnum.CHOOSING_BUILD:
        dispatch(buildBlock({onCell: idOfCell}));
        if (idOfCell) {
          dispatch(doPlayerMove());
          dispatch(checkWinTrigger());
        }
        return;
      case GameStatesEnum.WAITING_AI_MOVE:
        dispatch(getAiMove(getMoveAlphaBetaCustomAiURL, defaultDepth));
        return;
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        return;
      case GameStatesEnum.WAITING_AI_SETUP_MOVES:
        dispatch(setUpAiBuildersTrigger());
        return;
    }
  };
}

function alertMessage(message) {
  Alert.Alert('Warning', message, [{text: 'OK'}]);
}
