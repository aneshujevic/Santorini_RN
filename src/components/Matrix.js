import React from 'react';
import {View, StyleSheet} from 'react-native';

import Row from './Row';

// TODO: Make it presentational

export default () => (
  <View style={styles.matrix}>
    <Row statesOfCells={[0, 1, 2, 3, 4]}  onClick={} selected stateOfCell={}/>
    <Row statesOfCells={[5, 6, 7, 8, 9]}  onClick={} selected stateOfCell={}/>
    <Row statesOfCells={[10, 11, 12, 0, 0]} onClick={} selected stateOfCell={}/>
    <Row statesOfCells={[0, 0, 0, 0, 0]} onClick={} selected stateOfCell={}/>
    <Row statesOfCells={[0, 0, 0, 0, 0]} onClick={} selected stateOfCell={}/>
  </View>
);

const styles = StyleSheet.create({
  matrix: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
});
