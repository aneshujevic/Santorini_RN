import {createAction} from '@reduxjs/toolkit';
import {GameStatesEnum} from '../gameStatesEnum';
import {setUpJuBuilder} from './playerMoveActions';
import {dialogueNewGame} from '../utils';

export const setAvailableMoves = createAction('SET_AVAILABLE_MOVES_BUILDS');

export const setUpHeBuilder = createAction('SET_UP_HE_BUILDERS');

export const changeGameEngineState = createAction('CHANGE_GAME_ENGINE_STATE');

export const checkWin = createAction('CHECK_WIN');

export const resetMovesGlowing = createAction('RESET_GLOWING_MOVES');

export const resetState = createAction('RESET_STATE');

export const setGameType = createAction('SET_GAME_TYPE');

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
    dispatch(changeGameEngineState(GameStatesEnum.DO_AI_MOVE));
  };
}

export function checkWinTrigger() {
  return (dispatch, getState) => {
    if (getState().gameState.gameEnded) {
      dispatch(dialogueNewGame('Do you want to play another game?'));
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
