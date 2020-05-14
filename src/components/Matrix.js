import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import Cell from './Cell';

// TODO: Make it presentational

export default () => {
  const rows = [[], [], [], [], []];
  for (let i = 0; i < 5; i++) {
    rows[i].push(
      <Cell
        key={i * 5}
        stateOfCell={fakePropsStatesOfCells[i * 5]}
        selected={fakePropsSelected === i * 5}
        onPress={() => alertMessage(i * 5)}
      />,
      <Cell
        key={i * 5 + 1}
        stateOfCell={fakePropsStatesOfCells[i * 5 + 1]}
        selected={fakePropsSelected === i * 5 + 1}
        onPress={() => alertMessage(i * 5 + 1)}
      />,
      <Cell
        key={i * 5 + 2}
        stateOfCell={fakePropsStatesOfCells[i * 5 + 2]}
        selected={fakePropsSelected === i * 5 + 2}
        onPress={() => alertMessage(i * 5 + 2)}
      />,
      <Cell
        key={i * 5 + 3}
        stateOfCell={fakePropsStatesOfCells[i * 5 + 3]}
        selected={fakePropsSelected === i * 5 + 3}
        onPress={() => alertMessage(i * 5 + 3)}
      />,
      <Cell
        key={i * 5 + 4}
        stateOfCell={fakePropsStatesOfCells[i * 5 + 4]}
        selected={fakePropsSelected === i * 5 + 4}
        onPress={() => alertMessage(i * 5 + 4)}
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
};

function alertMessage(id) {
  Alert.alert('ALERT', id.toString(), [
    {text: 'OK', onPress: () => console.log('ok pressed')},
  ]);
}

const fakePropsSelected = 1;
const fakePropsStatesOfCells = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

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
