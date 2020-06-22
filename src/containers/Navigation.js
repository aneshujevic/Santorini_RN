import {Menu} from './Menu';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import GameTable from './GameTable';

const Stack = createStackNavigator();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Menu} options={styles.menuScreen} />
      <Stack.Screen
        name="Game"
        component={GameTable}
        options={styles.gameScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = {
  gameScreen: {
    title: 'To main menu',
    headerStyle: {
      backgroundColor: 'rgba(4,175,169,0.36)',
      height: 35,
    },
    headerTitleStyle: {
      fontSize: 15,
    },
  },
  menuScreen: {
    title: 'Main menu',
    headerStyle: {
      backgroundColor: 'white',
      height: 35,
    },
    headerTitleStyle: {
      fontSize: 15,
    },
  },
};
