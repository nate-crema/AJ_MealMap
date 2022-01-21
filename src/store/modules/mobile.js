import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETCOMP = "mobile/SETCOMP";
const SETMFRIEND = "mobile/SETMFRIEND";
const ADDMFRIEND = "mobile/ADDMFRIEND";
const REMOVEMFRIEND = "mobile/REMOVEMFRIEND";
const SETMSTAGE = "mobile/SETMSTAGE";
const SETMTIME = "mobile/SETMTIME";
const SETALERT = "mobile/SETALERT";

// Action Create & Export
export const setComp = createAction({ type: SETCOMP });
export const setMFriend = createAction({ type: SETMFRIEND });
export const addMFriend = createAction({ type: ADDMFRIEND });
export const removeMFriend = createAction({ type: REMOVEMFRIEND });
export const setMStage = createAction({ type: SETMSTAGE });
export const setMTime = createAction({ type: SETMTIME });
export const setAlert = createAction({ type: SETALERT });

// Initial State Definition
const initState = {
    bottom_comp: { mode: null },
    alert_object: null,
    mealfriend: {
        stage: 0,
        accepted: [],
        meet_time: {
            h: 0,
            m: 0
        },
        list: []
    }
}

// Create Reducers
export default handleActions({
    [ SETCOMP ]: (state, { comp }) => {
        return {
            ...state,
            bottom_comp: comp
        }
    },
    [ SETMFRIEND ]: (state, { friends: list }) => {
        return {
            ...state,
            mealfriend: {
                ...state.mealfriend,
                list 
            }
        }
    },
    [ ADDMFRIEND ]: (state, { friends: add }) => {
        let list = [ ...state.mealfriend.list ];
        add.map(nid => state.mealfriend.list.indexOf(nid) === -1 && ( list.push(nid) ));
        return {
            ...state,
            mealfriend: {
                ...state.mealfriend,
                list
            }
        }
    },
    [ REMOVEMFRIEND ]: (state, { friends: remove }) => {
        let list = [ ...state.mealfriend.list ];
        remove.map(eid => {
            const idx = state.mealfriend.list.indexOf(eid);
            if (idx > -1) list.splice(idx, 1);
        });
        return {
            ...state,
            mealfriend: {
                ...state.mealfriend,
                list 
            }
        }
    },
    [ SETMSTAGE ]: (state, { stage }) => {
        return {
            ...state,
            mealfriend: {
                ...state.mealfriend,
                stage
            }
        }
    },
    [ SETMTIME ]: (state, { h, m }) => {
    return {
            ...state,
            mealfriend: {
                ...state.mealfriend,
                meet_time: {
                    h, 
                    m
                }
            }
        }
    },
    [ SETALERT ]: (state, { alert_object }) => {
        return {
            ...state,
            alert_object
        }
    },
}, initState);