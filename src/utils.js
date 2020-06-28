import {Alert} from 'react-native';
import {resetState} from './actions/gameEngineActions';

export const getAvailableMovesURL = 'getAvailableMoves';

export const getAvailableBuildsURL = 'getAvailableBuilds';

export const alertMessage = message =>
  Alert.alert('Notification', message, [{text: 'OK'}]);

export function dialogueNewGame(message) {
  return dispatch => {
    Alert.alert('Notification', message, [
      {text: 'Yes', onPress: () => dispatch(resetState())},
      {text: 'No'},
    ]);
  };
}
