import {createAction} from '@reduxjs/toolkit';
import {GameStatesEnum} from '../gameStatesEnum';
import {setUpJuBuilder} from './playerMoveActions';
import {alertMessage, dialogueNewGame, getAvailableMovesURL} from '../utils';
import {getAvailableMovesBuilds} from '../server_communication/movesThunks';

export const setAvailableMoves = createAction('SET_AVAILABLE_MOVES_BUILDS');

export const setUpHeBuilder = createAction('SET_UP_HE_BUILDERS');

export const changeGameEngineState = createAction('CHANGE_GAME_ENGINE_STATE');

export const checkWin = createAction('CHECK_WIN');

export const resetState = createAction('RESET_STATE');

export const setGameType = createAction('SET_GAME_TYPE');

export const setAlgorithmType = createAction('SET_ALGORITHM_TYPE');

export const setServerUrl = createAction('SET_SERVER_URL');

export const setDepth = createAction('SET_DEPTH_OF_SEARCH');

export const setSuperSecretKey = createAction('SET_SECRET_KEY');

export const setUsername = createAction('SET_USERNAME');

export const setFirstPlayer = createAction('SET_FIRST_PLAYER');

export const resetGlowingCells = createAction('RESET_GLOWING_CELLS');

export function setUpAiBuildersTrigger() {
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

    dispatch(setUpHeBuilder(firstHe));
    dispatch(setUpHeBuilder(secondHe));
    dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
  };
}

export function setUpAiAiBuildersTrigger() {
  return dispatch => {
    const indexes = [];

    for (let i = 0; i < 4; ) {
      let newIndex = Math.floor(Math.random() * 25);

      if (indexes.indexOf(newIndex) === -1) {
        indexes.push(newIndex);
        i++;
      }
    }

    dispatch(setUpJuBuilder(indexes[0]));
    dispatch(setUpJuBuilder(indexes[2]));
    dispatch(setUpHeBuilder(indexes[1]));
    dispatch(setUpHeBuilder(indexes[3]));
    dispatch(changeGameEngineState(GameStatesEnum.DO_ENEMY_MOVE));
  };
}

export function checkWinTrigger() {
  return (dispatch, getState) => {
    const state = getState().gameState;
    if (state.gameEnded) {
      dispatch(dialogueNewGame('Do you want to play another game?'));
      return;
    }

    let firstJU = state.firstJu;
    let secondJU = state.secondJu;
    let firstHE = state.firstHe;
    let secondHE = state.secondHe;
    let gameEnded = false;

    let juPlayer = {first: 0, second: 0};
    dispatch(getAvailableMovesBuilds(getAvailableMovesURL, firstJU))
      .then(
        () =>
          (juPlayer.first = getState().gameState.availableMovesOrBuilds.length),
      )
      .then(() =>
        dispatch(getAvailableMovesBuilds(getAvailableMovesURL, secondJU)).then(
          () =>
            (juPlayer.second = getState().gameState.availableMovesOrBuilds.length),
        ),
      )
      .then(() => {
        console.log('first', juPlayer.first);
        console.log('second', juPlayer.second);
        if (juPlayer.first === 0 && juPlayer.second === 0) {
          gameEnded = true;
          alertMessage('Enemy won!');
        }
      });

    let hePlayer = {first: 0, second: 0};
    return dispatch(getAvailableMovesBuilds(getAvailableMovesURL, firstHE))
      .then(
        () =>
          (hePlayer.first = getState().gameState.availableMovesOrBuilds.length),
      )
      .then(() =>
        dispatch(getAvailableMovesBuilds(getAvailableMovesURL, secondHE)).then(
          () =>
            (hePlayer.second = getState().gameState.availableMovesOrBuilds.length),
        ),
      )
      .then(() => {
        if (hePlayer.first === 0 && hePlayer.second === 0) {
          gameEnded = true;
          alertMessage('You won!');
        }
      })
      .then(() => {
        dispatch(checkWin(gameEnded));
        const index = state.cells.findIndex(x => x === 12 || x === 8);
        if (index !== -1) {
          if (state.cells[index] === 8) {
            alertMessage('Enemy won!');
          } else {
            alertMessage('You won!');
          }
        }
      });
  };
}
