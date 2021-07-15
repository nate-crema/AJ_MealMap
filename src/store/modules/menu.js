import { createAction, handleActions } from 'redux-actions';

// action type definition
const SETMENU = 'menu/SETMENU';
const INITMENU = 'menu/INITMENU';

// action creater
// export const loadList = () => ({ type: LOADLIST });
// export const addList = () => ({ type: ADDLIST });
export const setMenu = createAction({ type: SETMENU });
export const initMenu = createAction({ type: INITMENU });

// initial State

const initState = {
    menu: undefined,
    init: false
}

// export reducer

export default handleActions({
    [SETMENU]: ( state , { v: _menu }) => {
        console.log(`Update Menu: ${state.menu} => ${_menu}`);
        return { ...state, menu: _menu || 0 };
    },
    [INITMENU]: ( state ) => {
        // console.log(`Update Menu: ${menu} => ${_menu}`);
        return { ...state, init: true };
    },

}, initState);