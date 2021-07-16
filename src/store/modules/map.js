import { createAction, handleActions } from 'redux-actions';

// action type definition
const LOADLIST = 'map/LOADLIST';
const ADDLIST = 'map/ADDLIST';
const SETLIST = 'map/SETLIST';

// action creater
// export const loadList = () => ({ type: LOADLIST });
// export const addList = () => ({ type: ADDLIST });
export const loadList = createAction({ type: LOADLIST });
export const addList = createAction({ type: ADDLIST });
export const setList = createAction({ type: SETLIST });

// initial State

const initState = {
    list: [
        // ...state.list,
        // {
        //     name: "ABC", // 상호명 (필수)
        //     cat: 0, // 업종 | 0: 음식점 | 1: 주점 | 2: 카페 | 3: 편의점
        //     loc: [], // 위치 (필수)
        //     firstRegister: "UN_admin", // 최초등록자 (필수)
        //     cfmCnt: 5, // 일반공개 승인 카운트 (기준: 5이상 일반공개) (필수, 기본값 0)
        //     workTime: { // 영업시간 (필수)
        //         default: [[0,0], [21,0], [[[12, 0], [13, 0]], [[14, 0], [16, 0]]]], // 영업시간 - 기본 [시작, 끝, 쉬는시간] (필수)
        //         weekly: [[0,0], [21,0], [[[12, 0], [13, 0]], [[14, 0], [16, 0]]]], // 영업시간 - 주중 [시작, 끝, 쉬는시간]
        //         weekend: [[0,0], [21,0]], // 영업시간 - 주말 [시작, 끝, 쉬는시간],
        //         DOW: {
        //             0: { // 월요일
        //                 default: [[0,0], [21,0]],
        //                 1: [[9,0], [21,0]], // 매달 첫째주 월요일에는 9시~21시까지 영업
        //                 3: [], // 매달 셋째주 월요일은 휴무
        //             }
        //         }, // Day of Week, 월요일부터 0, 화요일 1, ... 형식으로 날짜별 영업시간 등록 가능. 특정주만 해당될 경우 주수 입력, 아니라면 default (주수는 0 입력 불가). 형식 상동
        //         12: [[0,0], [21,0]], // 매월 특정일별 영업시간. 형식 상동
        //         holiday: true, // 공휴일 휴무여부. true이면 공휴일에도 영업함
        //         holidayException: [ // 공휴일중 특정일은 반대일 경우 입력. holiday가 true일 경우, 해당 배열에 입력되는 날짜는 false로 간주
        //             [1, 1, 0, [[0,0], [21,0]]], // 음력 1월 1일, 영업시간 (다를경우만 입력, 형식 상동)
        //             [1, 1, 1, [[0,0], [21,0]]], // 양력 1월 1일, 영업시간 (다를경우만 입력, 형식 상동)
        //         ]
        //     },
        //     deliver: true, // 배달가능여부 (필수, 기본값 false)
        //     number: { // 전화번호
        //         default: "010-2134-1234",
        //         phone: "010-1234-1234",
        //         store: "031-532-1234"
        //     },
        //     review: [ // 리뷰 (필수)
        //         {
        //             gpa: 10, // 평점 (0~10)
        //             assesser: "UN_admin", // 평가자
        //             likeTag: [0, 3, 4], // 이런점이 좋아요
        //             dislikeTag: [1] // 이런걸 고쳤으면 좋겠어요
        //         }
        //     ],
        //     registerable: false, // 예약가능여부 (필수, 기본값 false)
        //     registerSystem: ["배달의 민족", "요기요", "카카오예약"] // registeable이 true일 경우에만 필수
        // }
    ],
    // tagList: [
    //     {
    //         tagUID: 0,
    //         tagName: "가성비",
    //         description: "가격 대비 음식의 품질이나 양"
    //     }   
    // ]
}

// export reducer

export default handleActions({
    [LOADLIST]: (state, { list }) => {
        return {
            ...state,
            list
        }
    },
    [ADDLIST]: (state, action) => {
        // return 
    },
    [SETLIST]: (state, { list }) => {
        return {
            ...state,
            list
        }
    }
}, initState);