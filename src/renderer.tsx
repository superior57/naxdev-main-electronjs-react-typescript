import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer, remote } from 'electron';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import './App.global.less';

const i18n = require('./configs/i18next.config');

ipcRenderer.on('language-changed', (event, message) => {
  i18n.changeLanguage(message.language);
});

console.log(remote.app.getVersion())

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));
