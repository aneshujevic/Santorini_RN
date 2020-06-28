import React from 'react';
import {PropTypes} from 'prop-types';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {Algorithms} from '../gameStatesEnum';

export const ConfigBar = props => (
  <View style={styles.wholeBar}>
    <View style={styles.row}>
      <Text style={styles.textStyle}>Algorithm : </Text>
      <Picker
        style={styles.pickerStyle}
        selectedValue={props.selectedAlgorithm}
        mode={'dropdown'}
        onValueChange={(itemValue, itemIndex) => props.setAlgorithm(itemValue)}>
        <Picker.Item label="Minimax" value={Algorithms.MINIMAX} />
        <Picker.Item label="Alpha Beta" value={Algorithms.ALPHA_BETA} />
        <Picker.Item
          label="Alpha Beta Custom"
          value={Algorithms.ALPHA_BETA_CUSTOM_HEURISTICS}
        />
      </Picker>
    </View>
    <View style={styles.row}>
      <Text style={styles.textStyle}>Depth of search : </Text>
      <TextInput
        keyboardType="numeric"
        style={[styles.textStyle, styles.inputStyle]}
        onChangeText={text => props.setDepthOfSearch(+text)}
        placeholder={props.depthOfSearch}>
        {props.depthOfSearch}
      </TextInput>
    </View>
  </View>
);

ConfigBar.propTypes = {
  setAlgorithm: PropTypes.func.isRequired,
  setDepthOfSearch: PropTypes.func.isRequired,
  depthOfSearch: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  wholeBar: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,79,82,0.75)',
  },
  pickerStyle: {
    flex: 1,
    color: 'white',
  },
  textStyle: {
    fontSize: 17,
    color: 'white',
    fontFamily: 'monospace',
  },
  inputStyle: {
    flex: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.1,
    borderColor: 'rgba(255,255,255,0.76)',
    padding: 3,
  },
});
