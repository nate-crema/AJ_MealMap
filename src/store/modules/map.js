import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETLIST = "map/SETLIST";
const SETDISPLAY = "map/SETDISPLAY";
const SETMAPLOC = "map/SETMAPLOC";
const SETMCLICK = "map/SETMCLICK";
const SETMCPO = "map/SETMCPO";

// Action Create & Export
export const setList = createAction({ type: SETLIST });
export const setDisplay = createAction({ type: SETDISPLAY });
export const setMapLoc = createAction({ type: SETMAPLOC });
export const setMClick = createAction({ type: SETMCLICK });
export const setMCPo = createAction({ type: SETMCPO });

// Initial State Definition
const initState = {
    updated: null,
    mapto: [], // map custom movepoint; lat, long
    raw: [], // original list; server-side data
    display: [], // displaying list; client-side data
    customClick: false, // map click action activation
    customClickedPo: [] // map clicked position [Lat, Lng]
}

// Create Reducers
export default handleActions({
    [ SETLIST ]: (state, { list }) => {
        return {
            ...state,
            updated: new Date().getTime(),
            raw: list,
            // display: []
        }
    },
    [ SETDISPLAY ]: (state, { display }) => {
        return {
            ...state,
            display
        }
    },
    [ SETMAPLOC ]: (state, { loc }) => {
        return {
            ...state,
            mapto: loc
        }
    },
    [ SETMCLICK ]: (state, { active }) => {
        return {
            ...state,
            customClick: active
        }
    },
    [ SETMCPO ]: (state, { lat, lng }) => {
        return {
            ...state,
            customClickedPo: [ lat, lng ]
        }
    },
}, initState);