import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETKW = "search/SETKW";
const SETRES = "search/SETRES";
const SETOPEN = "search/SETOPEN";

// Action Create & Export
export const setKW = createAction({ type: SETKW });
export const setRES = createAction({ type: SETRES });
export const setOPEN = createAction({ type: SETOPEN });

// Initial State Definition
const initState = {
    keyword: "",
    result: [],
    area_open: false
}

// Create Reducers
export default handleActions({
    [ SETKW ]: (state, { kw: keyword }) => {
        return {
            ...state,
            keyword
        }
    },
    [ SETRES ]: (state, { result }) => {
        return {
            ...state,
            result
        }
    },
    [ SETOPEN ]: (state, { open }) => {
        return {
            ...state,
            area_open: open
        }
    },
}, initState);