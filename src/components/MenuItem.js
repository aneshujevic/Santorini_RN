import React from 'react';
import {PropTypes} from 'prop-types';
import {View, Text, TouchableOpacity} from 'react-native';

export const MenuItem = props => (
  <View>
    <TouchableOpacity onPress={props.onPressItem}>
      <Text style={props.textStyle}>{props.textValue}</Text>
    </TouchableOpacity>
  </View>
);

MenuItem.propTypes = {
  textStyle: PropTypes.object,
  textValue: PropTypes.string.isRequired,
  onPressItem: PropTypes.func.isRequired,
};
