import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETMENU = "menu/SETMENU";
const SETMOPEN = "menu/SETMOPEN";

// Action Create & Export
export const setMenu = createAction({ type: SETMENU });
export const setMOpen = createAction({ type: SETMOPEN });

// Initial State Definition
const initState = {
    menu: -100,
    mopen: false
}

// Create Reducers
export default handleActions({
    [ SETMENU ]: (state, { menu }) => {
        return {
            ...state,
            menu
        }
    },
    [ SETMOPEN ]: (state, { mopen }) => {
        return {
            ...state,
            mopen
        }
    },
}, initState);