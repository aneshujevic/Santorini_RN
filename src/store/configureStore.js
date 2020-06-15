import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import reducer from '../reducers/rootReducer';
import {GameStatesEnum} from '../gameStatesEnum';

const middleware = [...getDefaultMiddleware(), thunk, logger];

let preloadedState = {
  gameState: {
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
  },
};

const store = configureStore({
  reducer: reducer,
  middleware: middleware,
  preloadedState: preloadedState,
});

export default store;
