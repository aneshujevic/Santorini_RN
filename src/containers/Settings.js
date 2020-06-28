import React from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Text, StyleSheet, ImageBackground, View} from 'react-native';
import {imageList} from '../components/ImageSourceList';
import {SettingsItem} from '../components/SettingsItem';
import {
  setServerUrl,
  setSuperSecretKey,
  setUsername,
} from '../actions/gameEngineActions';

const Settings = props => (
  <View style={styles.containerView}>
    <ImageBackground source={imageList[13]} style={styles.backgroundStyle}>
      <View style={styles.optionsList}>
        <SettingsItem
          textValue="Username"
          textInputValue={props.username}
          onChangeText={username => props.setUsername(username)}
        />
        <View>
          <SettingsItem
            textValue="Super secret key: "
            textInputValue={props.secretKey}
            onChangeText={secretKey => props.setSecretKey(secretKey)}
          />
          <Text style={styles.tipStyle}>
            [TIP] Secret key is used to connect you and your mate with which you
            want want to play so keep it secret otherwise you can expect
            unwanted guests..
          </Text>
        </View>
        <SettingsItem
          textValue="Server URL: "
          textInputValue={props.serverUrl}
          onChangeText={url => props.setServerUrl(url)}
        />
      </View>
    </ImageBackground>
  </View>
);

Settings.propTypes = {
  username: PropTypes.string,
  serverUrl: PropTypes.string,
  secretKey: PropTypes.string,
  setServerUrl: PropTypes.func.isRequired,
  setSecretKey: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  containerView: {
    height: '100%',
  },
  optionsList: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  backgroundStyle: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  tipStyle: {
    fontSize: 17,
    borderRadius: 1,
    color: 'green',
    backgroundColor: 'rgba(255,255,255,0.89)',
    padding: 10,
    margin: 10,
  },
});

const mapStateToProps = state => ({
  secretKey: state.gameState.secretKey,
  username: state.gameState.username,
  serverUrl: state.gameState.serverUrl,
});

const mapDispatchToProps = dispatch => ({
  setServerUrl: url => dispatch(setServerUrl(url)),
  setSecretKey: secretKey => dispatch(setSuperSecretKey(secretKey)),
  setUsername: username => dispatch(setUsername(username)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
