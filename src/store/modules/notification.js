import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETNOTIFICATION = "noti/SETNOTIFICATION";
const ADDNOTIFICATION = "noti/ADDNOTIFICATION";

const SETNOTIED = "noti/SETNOTIED";

// Action Create & Export
export const setNotification = createAction({ type: SETNOTIFICATION });
export const addNotification = createAction({ type: ADDNOTIFICATION });
export const setNotied = createAction({ type: SETNOTIED });

// Initial State Definition
const initState = {
    notis: []
}

// Create Reducers
export default handleActions({
    [ SETNOTIFICATION ]: (state, { notis }) => {
        return {
            ...state,
            notis
        }
    },
    [ ADDNOTIFICATION ]: (state, { noti }) => {
        return {
            ...state,
            notis: [ ...state.notis, noti ]
        }
    },
    [ SETNOTIED ]: (state, { noti_key }) => {
        const n = state.notis;
        n[n.indexOf(n.find(v => v.keys == noti_key))].notied = true;
        return {
            ...state,
            notis: n
        }
    },
}, initState);