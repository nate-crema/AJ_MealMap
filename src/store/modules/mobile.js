import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETCOMP = "mobile/SETCOMP";
const SETMFRIEND = "mobile/SETMFRIEND";
const SETMSTAGE = "mobile/SETMSTAGE";
const SETMTIME = "mobile/SETMTIME";
const SETALERT = "mobile/SETALERT";

// Action Create & Export
export const setComp = createAction({ type: SETCOMP });
export const setMFriend = createAction({ type: SETMFRIEND });
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