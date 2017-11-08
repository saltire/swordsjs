import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './index.scss';
import App from './App';


const root = document.querySelector('#root');

function renderApp() {
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    root);
}

renderApp();

if (module.hot) {
  module.hot.accept('./App', renderApp);
}
