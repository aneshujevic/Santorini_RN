import React from 'react';
import {connect} from 'react-redux';
import {Alert, StyleSheet, View} from 'react-native';

import Cell from '../components/Cell';
import {doPlayerMove} from '../actions/gameEngineActions';

function RootApp(props) {
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

  return (
    <View style={styles.matrix}>
      <View style={styles.row}>{rows[0]}</View>
      <View style={styles.row}>{rows[1]}</View>
      <View style={styles.row}>{rows[2]}</View>
      <View style={styles.row}>{rows[3]}</View>
      <View style={styles.row}>{rows[4]}</View>
    </View>
  );
}

function alertMessage(id) {
  Alert.alert('ALERT', id.toString(), [
    {text: 'OK', onPress: () => console.log('ok pressed')},
  ]);
}

const styles = StyleSheet.create({
  matrix: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => ({
  cells: state.gameState.cells,
  selected: state.gameState.selected,
  glowing: state.gameState.glowingCells,
});

const mapDispatchToProps = dispatch => ({
  click: idOfCell => {
    dispatch(doPlayerMove(idOfCell));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RootApp);
