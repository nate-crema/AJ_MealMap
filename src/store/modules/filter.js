import { createAction, handleActions } from 'redux-actions';

// action type definition
const FILTERONOFF = 'filter/FILTERONOFF';
const ACTIVATEFILTER = 'filter/ACTIVATEFILTER';
const DEACTIVATEFILTER = 'filter/DEACTIVATEFILTER';
const CREATEFILTER = 'filter/CREATEFILTER';

// action creater
// export const loadList = () => ({ type: LOADLIST });
// export const addList = () => ({ type: ADDLIST });
export const filterONOFF = createAction({ type: FILTERONOFF });
export const activateFilter = createAction({ type: ACTIVATEFILTER });
export const deActivateFilter = createAction({ type: DEACTIVATEFILTER });
export const createFilter = createAction({ type: CREATEFILTER });

// initial State

const initState = new function() {
    const OT = this;
    this.active = false;
    this.list = {
        0: {
            filterUID: 0,
            filterName: "가성비",
            description: "가격 대비 음식의 품질이나 양",
            isSelectable: true,
            isOptionNeed: false
        },
        1: {
            filterUID: 1,
            filterName: "표시결과",
            description: "리스트에 표시할 업종",
            isSelectable: true,
            isOptionNeed: true,
            setStyle: {
                height: "150px"
            },
            optionType: "select"
        },
        2: {
            filterUID: 2,
            filterName: "거리",
            description: "현재 위치를 기준으로 떨어져있는 거리 (직선거리 기준)",
            isSelectable: true,
            isOptionNeed: true,
            optionType: "select"
        },
        3: {
            filterUID: 3,
            filterName: "메뉴분류",
            description: "메뉴에 대한 대분류 (한식, 양식, 중식 등.. )",
            isSelectable: true,
            isOptionNeed: true,
            optionType: "select"
        },
        4: {
            filterUID: 4,
            filterName: "배달",
            description: "배달 가능한 점포",
            isSelectable: true,
            isOptionNeed: false
        },
        5: {
            filterUID: 5,
            filterName: "예약",
            description: "방문 예약이 가능한 점포",
            isSelectable: true,
            isOptionNeed: false
        },
        6: {
            filterUID: 6,
            filterName: "평점",
            description: "시스템에 등록된 평점이 기준치보다 높은 점포",
            isSelectable: true,
            isOptionNeed: true,
            optionType: "text"
        },
        7: {
            filterUID: 7,
            filterName: "이벤트",
            description: "이벤트가 가능한 점포",
            isSelectable: false,
            isOptionNeed: false
        },
        8: {
            filterUID: 8,
            filterName: "가본곳",
            description: "방문 후 리뷰를 남긴적이 있는 점포",
            isSelectable: false,
            isOptionNeed: false
        },
        9: {
            filterUID: 9,
            filterName: "등록한 곳",
            description: "내가 등록한 점포",
            isSelectable: true,
            isOptionNeed: false
        },
        10: {
            filterUID: 10,
            filterName: "키워드",
            description: "특정 단어를 포함하는 점포",
            isSelectable: true,
            isOptionNeed: true,
            optionType: "select"
        },
        length: 11
    };
    this.activated = [];
    this.deActivated = [];
    for (var i = 0; i < this.list.length; i++) {
        this.deActivated.push(this.list[i]);
    }
}

// export reducer



// 
// 
// 함수변경필요
// list를 배열에서 json으로 변경함
// 
// 

export default handleActions({
    [FILTERONOFF]: (state) => {
        return {
            ...state,
            active: !state.active
        }
    },
    [ACTIVATEFILTER]: (state, { v: obj }) => {
        /* 
        
        obj frame
        
        obj: {
            filterUID: Integer,
            filterVal: Any
        }

        */

       
       let prev = state.deActivated;
       let newVal = [];
        for (var i = 0; i < prev.length; i++) {
            const v = prev[i];
            if (v.filterUID != obj.filterUID) newVal.push(v);
        }

        return {
            ...state,
            activated: [
                ...state.activated,
                state.list[obj.filterUID]
            ],
            deActivated: newVal
        }
    },
    [DEACTIVATEFILTER]: (state, { UID }) => {
        /* 
        
        UID type: Integer

        */

        let prev = state.activated;
        let activated = [];
        let deActivated = [
            ...state.deActivated
        ];
        for (var i = 0; i < prev.length; i++) {
            const v = prev[i];
            if (v.filterUID != UID) activated.push(v);
            else deActivated.push(v);
        }

        activated.sort((a, b) => a.filterUID - b.filterUID);
        deActivated.sort((a, b) => a.filterUID - b.filterUID);

        return {
            ...state,
            activated,
            deActivated
        }
    },
    [CREATEFILTER]: (state, { v: obj }) => {
        /* 
        
        obj frame
        
        obj: Integer: {
            filterUID: Integer,
            filterName: String,
            description: String,
            isSelectable: true,
            isOptionNeed: false
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