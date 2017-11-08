import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from '../../ducks/users';

import './Private.css';

// in react, two things will cause a re-render
// calling this.setState() and causing a change 
// in the redux store

class Private extends Component {
  componentDidMount() {
    this.props.getUserInfo();
  }

  bankBalance() {
    return Math.floor((Math.random() + 1000) * 1000000);
  }

  render() {
    const user = this.props.userData;
    return (
      <div className=''>
        <h1>Community Bank</h1><hr />
        <h4>Account information:</h4>
        { user ? <img className='avatar' src={user.img} /> : null }
        <p>Username: { user ? user.user_name : null }</p>
        <p>Email: { user ? user.email : null }</p>
        <p>ID: { user ? user.auth_id : null }</p>
        <h4>Available balance: { user ? '$' + this.bankBalance() + '.00' : null } </h4>
        <a href='http://localhost:4200/logout'><button>Log out</button></a>
      </div> 
    )
  }
}

function mapStateToProps(state) {
  return { userData: state.userData };
}

export default connect(mapStateToProps, { getUserInfo })(Private);