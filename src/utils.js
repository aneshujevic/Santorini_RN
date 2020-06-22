import {Alert} from 'react-native';
import RNRestart from 'react-native-restart';

export const alertMessage = message =>
  Alert.alert('ALERT', message, [{text: 'OK'}]);

export const dialogueNewGame = message =>
  Alert.alert('Notification', message, [
    {text: 'Yes', onPress: () => RNRestart.Restart()},
    {text: 'No'},
  ]);
