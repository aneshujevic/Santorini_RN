import {Provider} from 'react-redux';
import React from 'react';

import store from '../store/configureStore';
import {Navigation} from './Navigation';

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
