import { combineReducers } from 'redux';
import specific from './specific';
import user from './user';
import menu from './menu';
import map from './map';
import mobile from './mobile';
import notification from './notification';

export default combineReducers({ 
    specific,
    user,
    menu,
    map,
    mobile,
    notification
});