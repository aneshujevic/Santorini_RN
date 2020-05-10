import React from 'react';
import {PropTypes} from 'prop-types';
import {imageList} from './ImageSourceList';

import {TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';

// TODO: Connect with image wrapper
// TODO: Finish propTypes

const Cell = props => (
  <ImageBackground
    source={imageList[props.stateOfCell]}
    style={[props.selected ? styles.selected : styles.available, styles.image]}>
    <TouchableOpacity style={[styles.container]} />
  </ImageBackground>
);

Cell.propTypes = {
  stateOfCell: PropTypes.number.isRequired,
  style: TouchableOpacity.style,
  selected: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0.5,
  },
  image: {
    margin: 5,
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  available: {
    borderColor: 'black',
  },
  selected: {
    shadowColor: '#8dff70',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderColor: 'cyan',
  },
});

export default Cell;
