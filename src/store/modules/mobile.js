import { createAction, handleActions } from 'redux-actions';

// Action Definition
const SETCOMP = "mobile/SETCOMP";
const SETMFRIEND = "mobile/SETMFRIEND";
const SETMSTAGE = "mobile/SETMSTAGE";
const SETMTIME = "mobile/SETMTIME";

// Action Create & Export
export const setComp = createAction({ type: SETCOMP });
export const setMFriend = createAction({ type: SETMFRIEND });
export const setMStage = createAction({ type: SETMSTAGE });
export const setMTime = createAction({ type: SETMTIME });

// Initial State Definition
const initState = {
    bottom_comp: null,
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
}, initState);