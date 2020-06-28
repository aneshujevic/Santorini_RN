import React, {useEffect} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {PropTypes} from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import {connect, useDispatch} from 'react-redux';

import {Cell} from '../components/Cell';
import {
  resetState,
  setAlgorithmType,
  setDepth,
} from '../actions/gameEngineActions';
import {imageList} from '../components/ImageSourceList';
import {doMove, doPlayerMoveHuHu} from '../actions/playerMoveActions';
import {ConfigBar} from '../components/ConfigBar';
import {GameTypesEnum} from '../gameStatesEnum';
import {alertMessage} from '../utils';

const humanHumanUri = 'huhuchannel';

function GameTable(props) {
  const rows = [[], [], [], [], []];
  let dispatch = useDispatch();
  let url = `${props.serverUrl}/${humanHumanUri}/`;
  const webSock = new WebSocket(url);

  for (let i = 0; i < 5; i++) {
    rows[i].push(
      <Cell
        key={i * 5}
        stateOfCell={props.cells[i * 5]}
        selected={props.selected === i * 5}
        glowing={props.glowing[i * 5]}
        onPress={() => props.click(i * 5, webSock)}
      />,
      <Cell
        key={i * 5 + 1}
        stateOfCell={props.cells[i * 5 + 1]}
        selected={props.selected === i * 5 + 1}
        glowing={props.glowing[i * 5 + 1]}
        onPress={() => props.click(i * 5 + 1, webSock)}
      />,
      <Cell
        key={i * 5 + 2}
        stateOfCell={props.cells[i * 5 + 2]}
        selected={props.selected === i * 5 + 2}
        glowing={props.glowing[i * 5 + 2]}
        onPress={() => props.click(i * 5 + 2, webSock)}
      />,
      <Cell
        key={i * 5 + 3}
        stateOfCell={props.cells[i * 5 + 3]}
        selected={props.selected === i * 5 + 3}
        glowing={props.glowing[i * 5 + 3]}
        onPress={() => props.click(i * 5 + 3, webSock)}
      />,
      <Cell
        key={i * 5 + 4}
        stateOfCell={props.cells[i * 5 + 4]}
        selected={props.selected === i * 5 + 4}
        glowing={props.glowing[i * 5 + 4]}
        onPress={() => props.click(i * 5 + 4, webSock)}
      />,
    );
  }

  useEffect(
    React.useCallback(() => {
      if (props.gameType === GameTypesEnum.HUMAN_VS_HUMAN) {
        // configureWebSocket(webSock, url, props.username);
        webSock.onopen = () => {
          let message = {
            type: 'greet',
            messageFrom: props.username,
            key: props.secretKey,
          };

          let greetMessageJson = JSON.stringify(message);
          webSock.send(greetMessageJson);
        };

        webSock.onmessage = message => {
          let messageObj = JSON.parse(message.data);
          let messageDataObj = JSON.parse(messageObj.message);

          // reject messages which don't have the appropriate key
          if (messageDataObj.key !== props.secretKey) {
            return;
          }

          // reject echo messages
          if (props.username !== messageDataObj.messageFrom) {
            // if greet message has arrived show it
            if (messageDataObj.type === 'greet') {
              alertMessage(
                `Player ${messageDataObj.messageFrom} has joined the game.`,
              );
              return;
            }
            if (messageDataObj.type === 'exit') {
              alertMessage(
                `Player ${messageDataObj.messageFrom} has left the game`,
              );
              props.navigation.navigate('Home');
              return;
            }
            dispatch(doPlayerMoveHuHu(undefined, messageDataObj, webSock));
          }
        };

        webSock.onerror = e => {
          alertMessage(e.message);
        };
      }
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        props.resetGameState();

        let outMessage = {
          type: 'exit',
          messageFrom: props.username,
          key: props.secretKey,
        };

        webSock.send(JSON.stringify(outMessage));
        webSock.close();
      };
    }, []),
  );

  return (
    <View style={styles.matrix}>
      <ImageBackground source={imageList[13]} style={styles.backgroundStyle}>
        <View style={styles.row}>{rows[0]}</View>
        <View style={styles.row}>{rows[1]}</View>
        <View style={styles.row}>{rows[2]}</View>
        <View style={styles.row}>{rows[3]}</View>
        <View style={styles.row}>{rows[4]}</View>
        {props.gameType !== GameTypesEnum.HUMAN_VS_HUMAN && (
          <ConfigBar
            selectedAlgorithm={props.selectedAlgorithm}
            setAlgorithm={algorithm => props.setAlgorithm(algorithm)}
            depthOfSearch={props.depthOfSearch}
            setDepthOfSearch={depth => props.setDepth(depth)}
          />
        )}
      </ImageBackground>
    </View>
  );
}

GameTable.propTypes = {
  click: PropTypes.func.isRequired,
  cells: PropTypes.array.isRequired,
  glowing: PropTypes.array.isRequired,
  setDepth: PropTypes.func.isRequired,
  selected: PropTypes.number.isRequired,
  depthOfSearch: PropTypes.string.isRequired,
  selectedAlgorithm: PropTypes.string.isRequired,
  resetGameState: PropTypes.func.isRequired,
  setAlgorithm: PropTypes.func.isRequired,
  serverUrl: PropTypes.string.isRequired,
  gameType: PropTypes.number.isRequired,
  username: PropTypes.string,
  secretKey: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  matrix: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backgroundStyle: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

const mapStateToProps = state => ({
  cells: state.gameState.cells,
  selected: state.gameState.selected,
  glowing: state.gameState.glowingCells,
  depthOfSearch: state.gameState.depth.toString(),
  selectedAlgorithm: state.gameState.algorithmUri,
  gameType: state.gameState.gameType,
  serverUrl: state.gameState.serverUrl,
  username: state.gameState.username,
  secretKey: state.gameState.secretKey,
});

const mapDispatchToProps = dispatch => ({
  click: (idOfCell, webSock) => {
    dispatch(doMove(idOfCell, webSock));
  },
  resetGameState: () => {
    dispatch(resetState());
  },
  setAlgorithm: algorithm => {
    dispatch(setAlgorithmType(algorithm));
  },
  setDepth: depth => {
    dispatch(setDepth(depth));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameTable);
