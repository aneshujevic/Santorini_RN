import createReducer from 'redux-toolkit/lib/createReducer';
import {GameStatesEnum} from '../gameStatesEnum';

export const gameEngineReducer = createReducer({
  SET_WAIT_AI_MOVE: (state, action) => {
    state.gameState = GameStatesEnum.WAITING_AI_MOVE;
  },
  UNSET_WAIT_AI_MOVE: (state, action) => {
    state.gameState = GameStatesEnum.CHOOSING_BUILDER;
  },
  SET_AVAILABLE_MOVES_BUILDS: (state, action) => {
    state.availableMovesOrBuilds = action.payload.availableMovesOrBuilds;
    state.gameState = GameStatesEnum.FREE_TO_PLAY;
  },
});
