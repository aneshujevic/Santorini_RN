import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';

import {imageList} from '../components/ImageSourceList';
import {GameTypesEnum} from '../gameStatesEnum';
import {setGameType} from '../actions/gameEngineActions';

const Menu = props => (
  <View style={styles.containerView}>
    <ImageBackground source={imageList[13]} style={styles.backgroundStyle}>
      <View style={styles.mainMenu}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Game');
            props.setGameType(GameTypesEnum.HUMAN_VS_AI);
          }}>
          <Text style={styles.menuItem}>Human vs AI mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Game');
            props.setGameType(GameTypesEnum.HUMAN_VS_HUMAN);
          }}>
          <Text style={styles.menuItem}>Human vs Human mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Game');
            props.setGameType(GameTypesEnum.AI_VS_AI);
          }}>
          <Text style={styles.menuItem}>AI vs AI mode</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Settings')}>
          <Text style={[styles.menuItem, styles.settingsItem]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
);

Menu.propTypes = {
  setGameType: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  mainMenu: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  menuItem: {
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
    borderRadius: 3,
    fontFamily: 'monospace',
    color: 'white',
    backgroundColor: 'rgba(0,79,82,0.75)',
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

export default connect(
  null,
  dispatch => ({
    setGameType: gameType => dispatch(setGameType(gameType)),
  }),
)(Menu);
