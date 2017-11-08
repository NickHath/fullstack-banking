import React, { Component } from 'react';
import './Login.css';
import logo from './communityBank.svg';

require('dotenv').config();

export default class Login extends Component {
  render() {
    return (
      <div className='App'>
        <img src={ logo } alt="Logo"/>
        <a href={ process.env.REACT_APP_LOGIN }>
         <button>Login</button>
        </a>
      </div>
    )
}
}