import React from 'react';
import {PropTypes} from 'prop-types';
import {imageList} from './ImageSourceList';

import {
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

// TODO: Connect with image wrapper
// TODO: Finish propTypes

const Cell = props => (
  <View style={[styles.container]}>
    <TouchableOpacity
      style={[
        props.selected ? styles.selected : styles.available,
        styles.touchable,
      ]}
      onPress={props.onPress}>
      <ImageBackground
        source={imageList[props.stateOfCell]}
        style={[styles.image]}
      />
    </TouchableOpacity>
  </View>
);

Cell.propTypes = {
  stateOfCell: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  touchable: {
    flex: 1,
  },
  image: {
    borderWidth: 0.5,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  available: {
    borderColor: 'black',
  },
  selected: {
    borderColor: 'rgba(36,248,42,0.6)',
    borderStyle: 'solid',
    borderWidth: 5,
  },
});

export default Cell;
