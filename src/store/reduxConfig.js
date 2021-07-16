import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import modules from './modules';

// middleware
import getList from "./middleware/map";

const configure = () => {
//   const store = createStore(modules);
    const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
    const store = createStore(modules, composeWithDevTools(applyMiddleware(getList)));
    return store;
}

export default configure;