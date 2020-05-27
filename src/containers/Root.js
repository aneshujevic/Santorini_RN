import {Provider} from 'react-redux';
import React from 'react';

import store from '../store/configureStore';
import Matrix from './Matrix';

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Matrix />
      </Provider>
    );
  }
}
