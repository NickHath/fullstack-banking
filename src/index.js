import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// what we added
import { unregister } from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store';

// any time we have async calls, we need redux promise middleware
// sole purpose of index.js is to mount App to DOM

ReactDOM.render(
<Provider store={ store }>
  <App />
</Provider>
, document.getElementById('root'));
unregister();