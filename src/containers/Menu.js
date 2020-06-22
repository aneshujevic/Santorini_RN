import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, TouchableOpacity, View, ImageBackground} from 'react-native';
import RNRestart from 'react-native-restart';
import {imageList} from '../components/ImageSourceList';
import {GameTypesEnum} from '../gameStatesEnum';

export const Menu = ({navigation}) => (
  <View style={styles.containerView}>
    <ImageBackground source={imageList[13]} style={styles.backgroundStyle}>
      <View style={styles.mainMenu}>
        <TouchableOpacity onPress={() => navigation.navigate('Game', {type: GameTypesEnum.HUMAN_VS_AI})}>
          <Text style={styles.menuItem}>Human vs AI mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Game', {type: GameTypesEnum.AI_VS_AI})
          }>
          <Text style={styles.menuItem}>AI vs AI mode</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Game', {type: GameTypesEnum.HUMAN_VS_HUMAN})}>
          <Text style={styles.menuItem}>Human vs Human mode</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainMenu: {
    marginTop: 25,
    marginBottom: 45,
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  menuItem: {
    textAlign: 'center',
    fontSize: 20,
    padding: 15,
    fontFamily: 'monospace',
    color: 'white',
    backgroundColor: 'rgba(0,82,23,0.71)',
  },
  backgroundStyle: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
