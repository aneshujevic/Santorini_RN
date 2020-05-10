import React from 'react';
import {PropTypes} from 'prop-types';
import {View, StyleSheet} from 'react-native';

import Cell from './Cell';

const Row = props => (
  <View style={styles.row}>
    <Cell
      stateOfCell={props.statesOfCells[0]}
      styles={props.style}
      selected={props.selected}
    />
    <Cell
      stateOfCell={props.statesOfCells[1]}
      styles={props.style}
      selected={props.false}
      onClick={props.onClick}
    />
    <Cell
      stateOfCell={props.statesOfCells[2]}
      styles={props.style}
      selected={props.false}
      onClick={props.onClick}
    />
    <Cell
      stateOfCell={props.statesOfCells[3]}
      styles={props.style}
      selected={props.false}
      onClick={props.onClick}
    />
    <Cell
      stateOfCell={props.statesOfCells[4]}
      styles={props.style}
      selected={props.false}
      onClick={props.onClick}
    />
  </View>
);

Row.propTypes = {
  stateOfCell: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  style: Cell.propTypes.style,
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Row;
