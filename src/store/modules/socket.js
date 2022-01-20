import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETSOCKET = "socket/SETSOCKET";

// Action Create & Export
export const setSocket = createAction({ type: SETSOCKET });

// Initial State Definition
const initState = {
    socket: null
}

// Create Reducers
export default handleActions({
    [ SETSOCKET ]: (state, { socket }) => {
        return {
            ...state,
            socket
        }
    }
}, initState);