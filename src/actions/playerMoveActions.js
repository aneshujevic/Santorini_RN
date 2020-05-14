import createAction from 'redux-toolkit/lib/createAction';

export const moveBuilder = createAction('MOVE_BUILDER');

export const buildBlock = createAction('BUILD_BLOCK');

export const chooseBuilder = createAction('CHOOSE_BUILDER');

export const setUpBuilder = createAction('SET_UP_BUILDER');

export const toggleTurn = createAction('TOGGLE_TURN');
