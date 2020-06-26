import axios from 'axios';

import {Algorithms, GameStatesEnum} from '../gameStatesEnum';
import {buildBlock, moveBuilder} from '../actions/playerMoveActions';
import {
  createJsonRequestAiMove,
  createJsonRequestAvailableMoves,
} from './serializers';
import {
  changeGameEngineState,
  checkWinTrigger,
  setAvailableMoves,
} from '../actions/gameEngineActions';
import {alertMessage} from '../utils';

export function getAndDoAiMove(aiVsAiMode = false) {
  return (dispatch, getState) => {
    const state = getState().gameState;
    const url = `${state.serverUrl}/${state.algorithmUri}/`;
    const depth = state.depth;
    const data = createJsonRequestAiMove(state, depth, aiVsAiMode);

    console.log(state.depth);

    axios
      .post(url, data)
      .then(response => {
        const buildersId = response.data.id;
        const move = response.data.move[0] * 5 + response.data.move[1];
        const build = response.data.build[0] * 5 + response.data.build[1];
        const coordinatesMoveFrom = getMoveFromCoordinate(buildersId, state);

        dispatch(
          moveBuilder({
            fromCell: coordinatesMoveFrom,
            toCell: move,
          }),
        );
        dispatch(buildBlock({onCell: build}));
        if (!aiVsAiMode) {
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
        } else {
          dispatch(changeGameEngineState(GameStatesEnum.DO_AI_MOVE));
        }
        dispatch(checkWinTrigger());
      })
      .catch(() =>
        alertMessage("Couldn't connect to server, check internet connection. "),
      );
  };
}

function getMoveFromCoordinate(buildersId, state) {
  switch (buildersId) {
    case 1:
      return state.firstHe;
    case 2:
      return state.secondHe;
    case 3:
      return state.firstJu;
    case 4:
      return state.secondJu;
    default:
      return undefined;
  }
}

export function getAvailableMovesBuilds(uri, customBuilderCoords: undefined) {
  return (dispatch, getState) => {
    const state = getState().gameState;
    const url = `${state.serverUrl}/${uri}/`;
    const data = createJsonRequestAvailableMoves(customBuilderCoords, state);

    axios
      .post(url, data)
      .then(response => response.data.moves.map(x => x[0] * 5 + x[1]))
      .then(formattedResponse =>
        dispatch(
          setAvailableMoves({availableMovesOrBuilds: formattedResponse}),
        ),
      )
      .catch(() =>
        alertMessage("Couldn't connect to server, check internet connection. "),
      );
  };
}
