import {combineReducers} from 'redux';

import mainReducer from './mainReducer';

const reducer = combineReducers({
  gameState: mainReducer,
});

export default reducer;
