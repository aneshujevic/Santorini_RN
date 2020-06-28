import {createAction} from '@reduxjs/toolkit';
import {GameStatesEnum, GameTypesEnum} from '../gameStatesEnum';
import {
  alertMessage,
  dialogueNewGame,
  getAvailableBuildsURL,
  getAvailableMovesURL,
} from '../utils';
import {
  changeGameEngineState,
  checkWinTrigger,
  setFirstPlayer,
  setUpAiAiBuildersTrigger,
  setUpAiBuildersTrigger,
  setUpHeBuilder,
} from './gameEngineActions';
import {
  getAndDoAiMove,
  getAvailableMovesBuilds,
} from '../server_communication/movesThunks';
import {
  getMoveAndTypeMessageJson,
  getSetupMovesMessageJson,
  getStartingPlayerMessageJson,
} from '../server_communication/serializers';

export const moveBuilder = createAction('MOVE_BUILDER');

export const buildBlock = createAction('BUILD_BLOCK');

export const selectBuilder = createAction('SELECT_BUILDER');

export const unselectBuilder = createAction('UNSELECT_BUILDER');

export const setUpJuBuilder = createAction('SET_UP_JU_BUILDER');

export const toggleMinNext = createAction('TOGGLE_MINIMIZER_NEXT');

export function doMove(idOfCell, webSock) {
  return (dispatch, getState) => {
    const gameState = getState().gameState;

    switch (gameState.gameType) {
      case GameTypesEnum.HUMAN_VS_AI:
        dispatch(doPlayerMoveHuAi(idOfCell));
        break;
      case GameTypesEnum.HUMAN_VS_HUMAN:
        dispatch(doPlayerMoveHuHu(idOfCell, undefined, webSock));
        break;
      case GameTypesEnum.AI_VS_AI:
        dispatch(doPlayerMoveAiAi());
        break;
    }
  };
}

export function doPlayerMoveHuAi(idOfCell) {
  return (dispatch, getState) => {
    const engineState = getState().gameState.gameEngineState;
    const gameState = getState().gameState;

    if (gameState.gameEnded) {
      dispatch(dialogueNewGame('The party is over, start another one?'));
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        dispatch(setUpJuBuilder(idOfCell));
        if (
          getState().gameState.gameEngineState ===
          GameStatesEnum.WAITING_ENEMY_SETUP_MOVES
        ) {
          dispatch(doPlayerMoveHuAi());
        }
        return;
      case GameStatesEnum.WAITING_ENEMY_SETUP_MOVES:
        dispatch(setUpAiBuildersTrigger());
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        if (idOfCell !== gameState.firstJu && idOfCell !== gameState.secondJu) {
          alertMessage('Please choose your builder.');
          return;
        }

        dispatch(selectBuilder(idOfCell));
        dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_MOVE));
        dispatch(getAvailableMovesBuilds(getAvailableMovesURL));
        return;
      case GameStatesEnum.CHOOSING_MOVE:
        if (idOfCell === gameState.selected) {
          dispatch(unselectBuilder());
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
        } else {
          if (
            gameState.availableMovesOrBuilds.find(x => x === idOfCell) ===
            undefined
          ) {
            alertMessage('Cannot move builder here, please try again.');
            return;
          }
          dispatch(moveBuilder({toCell: idOfCell}));
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILD));
          dispatch(checkWinTrigger()).then(() => {
            dispatch(getAvailableMovesBuilds(getAvailableBuildsURL));
          });
        }
        return;
      case GameStatesEnum.CHOOSING_BUILD:
        if (
          gameState.availableMovesOrBuilds.find(x => x === idOfCell) ===
          undefined
        ) {
          alertMessage('Cannot build here, please try again.');
          return;
        }

        dispatch(buildBlock({onCell: idOfCell}));
        dispatch(changeGameEngineState(GameStatesEnum.DO_ENEMY_MOVE));

        if (idOfCell) {
          dispatch(doPlayerMoveHuAi());
        }
        return;
      case GameStatesEnum.DO_ENEMY_MOVE:
        dispatch(changeGameEngineState(GameStatesEnum.WAITING_ENEMY_MOVE));
        dispatch(getAndDoAiMove());
        return;
      case GameStatesEnum.WAITING_ENEMY_MOVE:
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        alertMessage('Waiting for server to respond, please wait..');
        return;
    }
  };
}

export function doPlayerMoveHuHu(idOfCell, enemyMoveData, webSock) {
  return (dispatch, getState) => {
    let message;
    let gameState = getState().gameState;
    const engineState = getState().gameState.gameEngineState;
    const meFirstPlayer = gameState.firstPlayer === gameState.username;

    if (gameState.gameEnded) {
      dispatch(dialogueNewGame('The party is over, start another one?'));
      return;
    }

    // setting up the starting player
    if (gameState.firstPlayer === undefined) {
      // we are not a starting player
      if (enemyMoveData !== undefined) {
        if (enemyMoveData.firstPlayer !== undefined) {
          dispatch(setFirstPlayer(enemyMoveData.firstPlayer));
          dispatch(
            changeGameEngineState(GameStatesEnum.WAITING_ENEMY_SETUP_MOVES),
          );
          alertMessage(
            `Starting player will be ${
              enemyMoveData.firstPlayer
            }. Please wait for their moves first.`,
          );
        }
        // we are a starting player
      } else {
        message = getStartingPlayerMessageJson(
          gameState.username,
          gameState.secretKey,
        );
        webSock.send(message);
        dispatch(setFirstPlayer(gameState.username));
        dispatch(changeGameEngineState(GameStatesEnum.SETTING_UP_BUILDERS));
        alertMessage('You are starting player, make your move and good luck!');
      }
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
        dispatch(setUpJuBuilder(idOfCell));
        // if we've setup our two builders (game state in waiting enemy setup moves)
        // we send our move and we either wait for their setup move or for their first move
        if (
          getState().gameState.gameEngineState ===
          GameStatesEnum.WAITING_ENEMY_SETUP_MOVES
        ) {
          gameState = getState().gameState;

          if (meFirstPlayer) {
            message = getSetupMovesMessageJson(
              gameState.username,
              gameState.firstJu,
              gameState.secondJu,
              gameState.secretKey,
            );
          } else {
            message = getSetupMovesMessageJson(
              gameState.username,
              gameState.firstJu,
              gameState.secondJu,
              gameState.secretKey,
            );
            dispatch(changeGameEngineState(GameStatesEnum.WAITING_ENEMY_MOVE));
          }
          webSock.send(message);
        }
        return;
      case GameStatesEnum.WAITING_ENEMY_SETUP_MOVES:
        if (enemyMoveData !== undefined) {
          // setting up enemy players
          let moves = enemyMoveData;
          dispatch(setUpHeBuilder(moves.firstBuilderIndex));
          dispatch(setUpHeBuilder(moves.secondBuilderIndex));
          // if I am the first player then all figures are now set up and we can play
          if (meFirstPlayer) {
            dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
            // otherwise it's my turn to set up builders
          } else {
            dispatch(changeGameEngineState(GameStatesEnum.SETTING_UP_BUILDERS));
          }
        }
        return;
      case GameStatesEnum.CHOOSING_BUILDER:
        if (idOfCell !== gameState.firstJu && idOfCell !== gameState.secondJu) {
          alertMessage('Please choose your builder.');
          return;
        }

        dispatch(selectBuilder(idOfCell));
        dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_MOVE));
        dispatch(getAvailableMovesBuilds(getAvailableMovesURL));
        message = getMoveAndTypeMessageJson(
          gameState.username,
          idOfCell,
          GameStatesEnum.CHOOSING_BUILDER,
          getState().gameState.availableMovesOrBuilds,
          idOfCell,
          gameState.secretKey,
        );
        webSock.send(message);

        return;
      case GameStatesEnum.CHOOSING_MOVE:
        if (idOfCell === gameState.selected) {
          dispatch(unselectBuilder());
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
        } else {
          if (
            gameState.availableMovesOrBuilds.find(x => x === idOfCell) ===
            undefined
          ) {
            alertMessage('Cannot move builder here, please try again.');
            return;
          }
          dispatch(moveBuilder({toCell: idOfCell}));
          dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILD));
          dispatch(checkWinTrigger()).then(() => {
            dispatch(getAvailableMovesBuilds(getAvailableBuildsURL));
          });
        }
        message = getMoveAndTypeMessageJson(
          gameState.username,
          idOfCell,
          GameStatesEnum.CHOOSING_MOVE,
          getState().gameState.availableMovesOrBuilds,
          idOfCell,
          gameState.secretKey,
        );
        webSock.send(message);
        return;
      case GameStatesEnum.CHOOSING_BUILD:
        if (
          gameState.availableMovesOrBuilds.find(x => x === idOfCell) ===
          undefined
        ) {
          alertMessage('Cannot build here, please try again.');
          return;
        }
        dispatch(buildBlock({onCell: idOfCell}));

        message = getMoveAndTypeMessageJson(
          gameState.username,
          -1,
          GameStatesEnum.CHOOSING_BUILD,
          getState().gameState.availableMovesOrBuilds,
          idOfCell,
          gameState.secretKey,
        );
        webSock.send(message);
        dispatch(checkWinTrigger());
        dispatch(changeGameEngineState(GameStatesEnum.WAITING_ENEMY_MOVE));
        return;
      case GameStatesEnum.WAITING_ENEMY_MOVE:
        if (enemyMoveData !== undefined) {
          switch (enemyMoveData.moveType) {
            case GameStatesEnum.CHOOSING_BUILDER:
              dispatch(selectBuilder(enemyMoveData.selected));
              dispatch(getAvailableMovesBuilds(getAvailableMovesURL));
              dispatch(
                changeGameEngineState(GameStatesEnum.WAITING_ENEMY_MOVE),
              );
              return;
            case GameStatesEnum.CHOOSING_MOVE:
              if (enemyMoveData.selected === gameState.selected) {
                dispatch(unselectBuilder());
              } else {
                dispatch(moveBuilder({toCell: enemyMoveData.toCell}));
                dispatch(checkWinTrigger()).then(() => {
                  dispatch(getAvailableMovesBuilds(getAvailableBuildsURL));
                });
              }
              dispatch(
                changeGameEngineState(GameStatesEnum.WAITING_ENEMY_MOVE),
              );
              return;
            case GameStatesEnum.CHOOSING_BUILD:
              dispatch(buildBlock({onCell: enemyMoveData.toCell}));
              dispatch(changeGameEngineState(GameStatesEnum.CHOOSING_BUILDER));
              dispatch(checkWinTrigger());
              return;
            default:
              dispatch(checkWinTrigger());
              return;
          }
        } else {
          alertMessage('Waiting for enemy move, please wait.');
          return;
        }
      case GameStatesEnum.WAITING_AVAILABLE_MOVES:
        alertMessage('Waiting for server to respond, please wait..');
        return;
    }
  };
}

function doPlayerMoveAiAi() {
  return (dispatch, getState) => {
    const engineState = getState().gameState.gameEngineState;
    const gameState = getState().gameState;

    if (gameState.gameEnded) {
      dispatch(dialogueNewGame('The party is over, start another one?'));
      return;
    }

    switch (engineState) {
      case GameStatesEnum.SETTING_UP_BUILDERS:
      case GameStatesEnum.WAITING_ENEMY_SETUP_MOVES:
        dispatch(setUpAiAiBuildersTrigger());
        return;
      case GameStatesEnum.DO_ENEMY_MOVE:
        dispatch(changeGameEngineState(GameStatesEnum.WAITING_ENEMY_MOVE));
        dispatch(getAndDoAiMove(true));
        dispatch(toggleMinNext());
        return;
      case GameStatesEnum.WAITING_ENEMY_MOVE:
        alertMessage('Waiting for server to respond, please wait..');
        return;
    }
  };
}
