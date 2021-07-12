import { combineReducers } from 'redux';
import map from './map';
import menu from './menu';
import def from './default';
import filter from './filter';

export default combineReducers({ 
    // map,
    filter,
    menu, 
    def
});