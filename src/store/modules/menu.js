import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETMENU = "menu/SETMENU";

// Action Create & Export
export const setMenu = createAction({ type: SETMENU });

// Initial State Definition
const initState = {
    menu: -100
}

// Create Reducers
export default handleActions({
    [ SETMENU ]: (state, { menu }) => {
        return {
            ...state,
            menu
        }
    }
}, initState);