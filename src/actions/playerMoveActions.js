import createAction from 'redux-toolkit/lib/createAction';

import {GameStatesEnum} from '../gameStatesEnum';

export const moveBuilder = createAction('MOVE_BUILDER');

export const buildBlock = createAction('BUILD_BLOCK');

export const selectBuilder = createAction('SELECT_BUILDER');

export const unselectBuilder = createAction('UNSELECT_BUILDER');

export const setUpBuilder = createAction('SET_UP_BUILDER');

// TODO: implement interaction for each case
export function doPlayerMove(idOfCell) {
  return (dispatch, getState) => {
    const {gameState} = getState().gameState;

    switch (gameState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        return;
      case GameStatesEnum.CHOOSING_MOVE:
        return;
      case GameStatesEnum.CHOOSING_BUILD:
        return;
      case GameStatesEnum.WAITING_AI_MOVE:
        return;
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        return;
      case GameStatesEnum.FREE_TO_PLAY:
        return;
    }
  };
}
