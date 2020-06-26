import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import Menu from './Menu';
import GameTable from './GameTable';
import Settings from './Settings';

const Stack = createStackNavigator();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Menu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Game"
        component={GameTable}
        options={styles.gameScreen}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={styles.settingsScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = {
  gameScreen: {
    title: 'To main menu',
    headerStyle: {
      backgroundColor: 'rgba(0,79,82,0.75)',
      height: 35,
    },
    headerTitleStyle: {
      fontSize: 15,
      color: 'white',
    },
  },
  settingsScreen: {
    title: 'To main menu',
    headerStyle: {
      backgroundColor: 'rgba(0,79,82,0.75)',
      height: 35,
    },
    headerTitleStyle: {
      fontSize: 15,
      color: 'white',
    },
  },
};
