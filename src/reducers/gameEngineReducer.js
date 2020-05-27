import createReducer from 'redux-toolkit/lib/createReducer';

import {
  setWaitAiMove,
  unsetWaitAiMove,
  setAvailableMoves,
} from '../actions/gameEngineActions';
import {GameStatesEnum} from '../gameStatesEnum';

const initState = {
  engineState: GameStatesEnum.SETTING_UP_BUILDERS,
};

const gameEngineReducer = createReducer(initState, {
  [setWaitAiMove]: (state, action) => {
    state.gameState = GameStatesEnum.WAITING_AI_MOVE;
  },
  [unsetWaitAiMove]: (state, action) => {
    state.gameState = GameStatesEnum.CHOOSING_BUILDER;
  },
  [setAvailableMoves]: (state, action) => {
    state.availableMovesOrBuilds = action.payload.availableMovesOrBuilds;
  },
});

export default gameEngineReducer;
