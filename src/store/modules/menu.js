import { createAction, handleActions } from 'redux-actions';

// action type definition
const SETMENU = 'menu/SETMENU';

// action creater
// export const loadList = () => ({ type: LOADLIST });
// export const addList = () => ({ type: ADDLIST });
export const setMenu = createAction({ type: SETMENU });

// initial State

const initState = {
    menu: undefined
}

// export reducer

export default handleActions({
    [SETMENU]: ( { menu } , { v: _menu }) => {
        console.log(`Update Menu: ${menu} => ${_menu}`);
        return { menu: _menu || 0 };
    }
}, initState);