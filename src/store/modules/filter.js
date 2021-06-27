import { createAction, handleActions } from 'redux-actions';

// action type definition
const ACTIVATEFILTER = 'filter/ACTIVATEFILTER';
const DEACTIVATEFILTER = 'filter/DEACTIVATEFILTER';
const CREATEFILTER = 'filter/CREATEFILTER';

// action creater
// export const loadList = () => ({ type: LOADLIST });
// export const addList = () => ({ type: ADDLIST });
export const activateFIlter = createAction({ type: ACTIVATEFILTER });
export const deActivateFIlter = createAction({ type: DEACTIVATEFILTER });
export const createFilter = createAction({ type: CREATEFILTER });

// initial State

const initState = {
    list: [{
        filterUID: 0,
        filterName: "가성비",
        description: "가격 대비 음식의 품질이나 양"
    }],
    activated: []
}

// export reducer

export default handleActions({
    [ACTIVATEFILTER]: (state, { v: obj }) => {
        /* 
        
        obj frame
        
        obj: {
            filterUID: Integer,
            filterVal: Any
        }

        */
        return {
            ...state,
            activated: [
                ...state.activated,
                obj
            ]
        }
    },
    [DEACTIVATEFILTER]: (state, { UID }) => {
        /* 
        
        UID type: Integer

        */

        let prev = state.activated;
        prev.forEach((v, i) => {
            if (v.filterUID == UID) {
                prev.splice(i, 1);
                break;
            }
        })

        return {
            ...state,
            activated: prev
        }
    },
    [CREATEFILTER]: (state, { v: obj }) => {
        /* 
        
        obj frame
        
        obj: {
            filterUID: Integer,
            filterName: String,
            description: String
        }

        */
        return {
            ...state,
            list: [
                ...state.list,
                obj
            ]
        }
    }
}, initState);