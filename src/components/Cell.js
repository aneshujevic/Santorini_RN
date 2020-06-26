import React from 'react';
import {PropTypes} from 'prop-types';
import {
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';

import {imageList} from './ImageSourceList';

export const Cell = props => (
  <View style={[styles.container]}>
    <ImageBackground source={imageList[0]} style={styles.image}>
      <TouchableOpacity
        style={[
          props.selected
            ? styles.selected
            : props.glowing
            ? styles.glowing
            : styles.available,
          styles.touchable,
        ]}
        onPress={props.onPress}>
        <ImageBackground
          source={imageList[props.stateOfCell]}
          style={[styles.image]}
        />
      </TouchableOpacity>
    </ImageBackground>
  </View>
);

Cell.propTypes = {
  stateOfCell: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  glowing: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 3,
    backgroundColor: 'white',
  },
  touchable: {
    flex: 1,
  },
  image: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.24)',
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
    borderWidth: 3,
  },
  glowing: {
    borderColor: 'rgba(36,248,42,0.6)',
    borderStyle: 'solid',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 24,
  },
});
