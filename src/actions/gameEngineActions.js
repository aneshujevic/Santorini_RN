import createAction from 'redux-toolkit/lib/createAction';
import axios from 'axios';

import {
  createJsonRequestAiMove,
  createJsonRequestAvailableMoves,
} from '../server_communication/serializers';
import {buildBlock, moveBuilder} from './playerMoveActions';

export const setWaitAiMove = createAction('SET_WAIT_AI_MOVE');

export const unsetWaitAiMove = createAction('UNSET_WAIT_AI_MOVE');

export const setAvailableMoves = createAction('SET_AVAILABLE_MOVES_BUILDS');

export function getAvailableMoves(state, selectedCoordinate, url) {
  return dispatch => {
    const data = createJsonRequestAvailableMoves(state, selectedCoordinate);

    axios
      .post(url, data)
      .then(response => response.data.moves.map(x => x[0] * 5 + x[1]))
      .then(formattedResponse =>
        dispatch(
          setAvailableMoves({availableMovesOrBuilds: formattedResponse}),
        ),
      )
      .catch(err => console.log(err));
  };
}

export function getAiMove(state, url, depth) {
  return dispatch => {
    const data = createJsonRequestAiMove(state, depth);
    dispatch(setWaitAiMove());

    axios
      .post(url, data)
      .then(response => {
        const buildersID = response.data.id;
        const move = response.data.move[0] * 5 + response.data.move[1];
        const build = response.data.build[0] * 5 + response.data.build[1];
        const coordinatesMoveFrom =
          buildersID === 1 ? this.state.firstHE : this.state.secondHE;
        dispatch(moveBuilder({fromCell: coordinatesMoveFrom, toCell: move}));
        dispatch(buildBlock({onCell: build}));
        dispatch(unsetWaitAiMove());
      })
      .catch(err => console.log(err));
  };
}
