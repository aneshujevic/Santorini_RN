import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import reducer from '../reducers/rootReducer';
import {GameStatesEnum} from '../gameStatesEnum';

const middleware = [...getDefaultMiddleware(), thunk, logger];
let preloadedState = {
  gameEngineState: {
    gameState: GameStatesEnum.SETTING_UP_BUILDERS,
  },
  gameState: {
    cells: Array(25).fill(0),
    firstHE: -1,
    secondHE: -1,
    firstJU: -1,
    secondJU: -1,
    selected: -1,
    availableMovesOrBuilds: [],
  },
};

const store = configureStore({
  reducer: reducer,
  middleware: middleware,
  preloadedState: preloadedState,
});

export default store;
