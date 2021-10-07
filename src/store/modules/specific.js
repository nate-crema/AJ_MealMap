import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETSPEC = "spec/SETSPEC";

// Action Create & Export
export const setSpec = createAction({ type: SETSPEC });

// Initial State Definition
const initState = {
    content: null
}

// Create Reducers
export default handleActions({
    [ SETSPEC ]: (state, { content }) => {
        return {
            ...state,
            content
        }
    }
}, initState);