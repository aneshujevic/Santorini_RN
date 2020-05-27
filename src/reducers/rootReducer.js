import {combineReducers} from 'redux';

import gameEngineReducer from './gameEngineReducer';
import playerMoveReducer from './playerMoveReducer';

const reducer = combineReducers({
  gameEngineState: gameEngineReducer,
  gameState: playerMoveReducer,
});

export default reducer;
