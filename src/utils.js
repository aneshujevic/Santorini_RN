import {Alert} from 'react-native';
import {resetState} from './actions/gameEngineActions';

export const alertMessage = message =>
  Alert.alert('Notification', message, [{text: 'OK'}]);

export function dialogueNewGame(message) {
  return (dispatch, getState) => {
    Alert.alert('Notification', message, [
      {text: 'Yes', onPress: () => dispatch(resetState())},
      {text: 'No'},
    ]);
  };
}
