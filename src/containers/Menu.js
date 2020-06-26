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
import {MenuItem} from '../components/MenuItem';

const Menu = props => (
  <View style={styles.containerView}>
    <ImageBackground source={imageList[13]} style={styles.backgroundStyle}>
      <View style={styles.mainMenu}>
        <MenuItem
          onPressItem={() => {
            props.navigation.navigate('Game');
            props.setGameType(GameTypesEnum.HUMAN_VS_AI);
          }}
          textStyle={styles.menuItem}
          textValue={'Human vs AI mode'}
        />
        <MenuItem
          onPressItem={() => {
            props.navigation.navigate('Game');
            props.setGameType(GameTypesEnum.AI_VS_AI);
          }}
          textStyle={styles.menuItem}
          textValue={'AI vs AI mode'}
        />
        <MenuItem
          onPressItem={() => {
            props.navigation.navigate('Game');
            props.setGameType(GameTypesEnum.HUMAN_VS_HUMAN);
          }}
          textStyle={styles.menuItem}
          textValue={'Human vs Human mode'}
        />
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
    height: '100%',
  },
  mainMenu: {
    flex: 1,
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
