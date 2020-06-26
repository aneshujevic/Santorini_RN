import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export const SettingsItem = props => (
  <View style={styles.containerView}>
    <Text style={styles.textStyle}>{props.textValue}</Text>
    <TextInput
      style={styles.inputStyle}
      keyboardType={props.keyboardType}
      onChangeText={text => props.onChangeText(text)}>
      {props.textInputValue}
    </TextInput>
  </View>
);

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: 'rgba(0,79,82,0.75)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  textStyle: {
    color: 'white',
    margin: 15,
    fontSize: 15,
  },
  inputStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    marginLeft: 5,
    flex: 1,
  },
});
