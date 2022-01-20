import { combineReducers } from 'redux';
import search from './search';
import specific from './specific';
import user from './user';
import menu from './menu';
import map from './map';
import mobile from './mobile';
import notification from './notification';
import socket from './socket';

export default combineReducers({ 
    search,
    specific,
    user,
    menu,
    map,
    mobile,
    notification,
    socket,
});