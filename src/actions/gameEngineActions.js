import createAction from 'redux-toolkit/lib/createAction';
import axios from 'axios';

import {
  createJsonRequestAiMove,
  createJsonRequestAvailableMoves,
} from '../server_communication/serializers';
import {
  buildBlock,
  moveBuilder,
  selectBuilder,
  setUpBuilder,
  unselectBuilder,
} from './playerMoveActions';
import {GameStatesEnum} from '../gameStatesEnum';
import Alert from 'react-native';

const getAvailableMovesURL = 'http://127.0.0.1:8000/getAvailableMoves/';
const getAvailableBuildsURL = 'http://127.0.0.1:8000/getAvailableBuilds/';
const getMoveMinmaxAiURL = 'http://127.0.0.1:8000/minimax/';
const getMoveAlphaBetaAiURL = 'http://127.0.0.1:8000/alphaBeta/';
const getMoveAlphaBetaCustomAiURL = 'http://127.0.0.1:8000/alphaBetaCustom/';
const defaultDepth = 3;

export const setWaitAiMove = createAction('SET_WAIT_AI_MOVE');

export const unsetWaitAiMove = createAction('UNSET_WAIT_AI_MOVE');

export const setAvailableMoves = createAction('SET_AVAILABLE_MOVES_BUILDS');

function getAvailableMoves(url) {
  return (dispatch, getState) => {
    const state = getState().gameState;
    const data = createJsonRequestAvailableMoves(state);

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

function getAiMove(url, depth) {
  return (dispatch, getState) => {
    const state = getState().gameState;
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

export function doPlayerMove(idOfCell) {
  return (dispatch, getState) => {
    const engineState = getState().gameEngineState.gameState;
    const gameState = getState().gameState;

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        dispatch(setUpBuilder(idOfCell));
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        dispatch(selectBuilder(idOfCell));
        dispatch(getAvailableMoves(getAvailableMovesURL));
        return;
      case GameStatesEnum.CHOOSING_MOVE:
        if (idOfCell === gameState.selected) {
          dispatch(unselectBuilder());
        } else {
          dispatch(moveBuilder(idOfCell));
          dispatch(getAvailableMoves(getAvailableBuildsURL));
        }
        return;
      case GameStatesEnum.CHOOSING_BUILD:
        dispatch(buildBlock(idOfCell));
        return;
      case GameStatesEnum.WAITING_AI_MOVE:
        dispatch(getAiMove(getMoveAlphaBetaCustomAiURL, defaultDepth));
        return;
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        return;
    }
  };
}


function alertMessage(message) {
  Alert.Alert('Warning', message, [{text: 'OK'}]);
}
