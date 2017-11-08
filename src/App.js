import React, { Component } from 'react';
import './App.css';

import { HashRouter, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Private from './components/Private/Private';

// sole purpose of App.js is to house our routes

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path='/' component={ Login } />
          <Route path='/private' component={ Private } />
        </div>
      </HashRouter>
    );
  }
}

export default App;
