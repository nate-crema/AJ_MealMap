import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETUSER = "user/SETUSER";

// Action Create & Export
export const setUser = createAction({ type: SETUSER });

// Initial State Definition
const initState = {
    uinfo: {}
}

// Create Reducers
export default handleActions({
    [ SETUSER ]: (state, { uinfo }) => {
        return {
            ...state,
            uinfo
        }
    }
}, initState);