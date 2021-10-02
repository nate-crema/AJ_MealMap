import { combineReducers } from 'redux';
import user from './user';
import menu from './menu';
import map from './map';

export default combineReducers({ 
    user,
    menu,
    map
});