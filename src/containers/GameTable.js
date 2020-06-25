import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {PropTypes} from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import {connect} from 'react-redux';

import Cell from '../components/Cell';
import {resetState} from '../actions/gameEngineActions';
import {imageList} from '../components/ImageSourceList';
import {doMove} from '../actions/playerMoveActions';

function GameTable(props) {
  const rows = [[], [], [], [], []];

  for (let i = 0; i < 5; i++) {
    rows[i].push(
      <Cell
        key={i * 5}
        stateOfCell={props.cells[i * 5]}
        selected={props.selected === i * 5}
        glowing={props.glowing[i * 5]}
        onPress={() => props.click(i * 5)}
      />,
      <Cell
        key={i * 5 + 1}
        stateOfCell={props.cells[i * 5 + 1]}
        selected={props.selected === i * 5 + 1}
        glowing={props.glowing[i * 5 + 1]}
        onPress={() => props.click(i * 5 + 1)}
      />,
      <Cell
        key={i * 5 + 2}
        stateOfCell={props.cells[i * 5 + 2]}
        selected={props.selected === i * 5 + 2}
        glowing={props.glowing[i * 5 + 2]}
        onPress={() => props.click(i * 5 + 2)}
      />,
      <Cell
        key={i * 5 + 3}
        stateOfCell={props.cells[i * 5 + 3]}
        selected={props.selected === i * 5 + 3}
        glowing={props.glowing[i * 5 + 3]}
        onPress={() => props.click(i * 5 + 3)}
      />,
      <Cell
        key={i * 5 + 4}
        stateOfCell={props.cells[i * 5 + 4]}
        selected={props.selected === i * 5 + 4}
        glowing={props.glowing[i * 5 + 4]}
        onPress={() => props.click(i * 5 + 4)}
      />,
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        props.resetGameState();
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
      </ImageBackground>
    </View>
  );
}

GameTable.propTypes = {
  selected: PropTypes.number.isRequired,
  glowing: PropTypes.array.isRequired,
  cells: PropTypes.array.isRequired,
  click: PropTypes.func.isRequired,
  resetGameState: PropTypes.func.isRequired,
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
});

const mapDispatchToProps = dispatch => ({
  click: idOfCell => {
    dispatch(doMove(idOfCell));
  },
  resetGameState: () => {
    dispatch(resetState());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameTable);
