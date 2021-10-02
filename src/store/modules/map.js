import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETLIST = "map/SETLIST";
const SETDISPLAY = "map/SETDISPLAY";

// Action Create & Export
export const setList = createAction({ type: SETLIST });
export const setDisplay = createAction({ type: SETDISPLAY });

// Initial State Definition
const initState = {
    list: {
        updated: null,
        raw: [], // original list; server-side data
        display: [] // displaying list; client-side data
    }
}

// Create Reducers
export default handleActions({
    [ SETLIST ]: (state, { list }) => {
        return {
            ...state,
            list: {
                updated: new Date().getTime(),
                raw: list,
                display: []
            }
        }
    },
    [ SETDISPLAY ]: (state, { display }) => {
        return {
            ...state,
            list: {
                ...state.list,
                display
            }
        }
    }
}, initState);