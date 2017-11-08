import axios from 'axios';

const initialState = {
  userData: {}
};

const GET_USER_INFO = 'GET_USER_INFO';

// axios is asynchronous, so we need redux-promise-middleware
// middleware will run the action that is returned through the reducer
// two times, the first time the payload will still be a promise
// and the second time the payload will be fulfilled
export function getUserInfo() {
  const user = axios.get('/auth/me').then(res => res.data);
  return {
    type: GET_USER_INFO,
    payload: user
  }
}

export default function reducer(state=initialState, action) {
  switch(action.type) {
    // also '_REJECTED' and '_PENDING' -- look at redux-promise-middleware docs
    case GET_USER_INFO + '_FULFILLED':
      return Object.assign({}, state, { userData: action.payload })
    default:
      return state;    
  }
}