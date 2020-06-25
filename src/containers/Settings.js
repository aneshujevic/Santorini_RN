import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Text, StyleSheet} from 'react-native';

const Settings = props => <Text>Hello, settings!</Text>;

Settings.propTypes = {

};

const styles = StyleSheet.create({

});

export default connect(
  null,
  null,
)(Settings);
