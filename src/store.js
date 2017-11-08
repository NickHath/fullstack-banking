// we need applyMiddleware from redux to use redux-promise-middleware
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reducer from './ducks/users';

// 2nd arg to creatStore is applyMiddleware with the arg promiseMiddleware()
// middleware - someone hits an endpoint, apply this first, then keep going
// execute an action in the middle 
export default createStore(reducer, applyMiddleware(promiseMiddleware()));
