import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
} from 'react-native';
import {imageList} from '../components/ImageSourceList';
import {SettingsItem} from '../components/SettingsItem';
import {setServerUrl, setUsername} from '../actions/gameEngineActions';

const Settings = props => (
  <View style={styles.containerView}>
    <ImageBackground source={imageList[13]} style={styles.backgroundStyle}>
      <View style={styles.optionsList}>
        <SettingsItem
          textValue="Username: "
          textInputValue={props.username}
          onChangeText={username => props.setUsername(username)}
        />
        <SettingsItem
          textValue="Server URL: "
          textInputValue={props.serverUrl}
          onChangeText={url => props.setServerUrl(url)}
        />
      </View>
    </ImageBackground>
  </View>
);

Settings.propTypes = {};

const styles = StyleSheet.create({
  containerView: {
    height: '100%',
  },
  optionsList: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  submitButton: {
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
    borderRadius: 3,
    fontFamily: 'monospace',
    color: 'white',
    backgroundColor: 'rgba(0,82,66,0.7)',
  },
  backgroundStyle: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  settingsItem: {
    fontSize: 17,
    borderRadius: 1,
    padding: 10,
  },
});

const mapStateToProps = state => ({
  username: state.gameState.username,
  serverUrl: state.gameState.serverUrl,
});

const mapDispatchToProps = dispatch => ({
  setServerUrl: url => dispatch(setServerUrl(url)),
  setUsername: username => dispatch(setUsername(username)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
