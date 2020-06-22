import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import reducer from '../reducers/rootReducer';
import {preloadedState} from './preloadedState';

const middleware = [...getDefaultMiddleware(), thunk, logger];

const store = configureStore({
  reducer,
  middleware,
  preloadedState,
});

export default store;
