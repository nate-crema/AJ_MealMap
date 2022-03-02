import axios from "@connection/request";

// interface

import { RestaurantListAPIResult, RestaurantAPIResult, APIStatusList, ReviewQuestionAPIResult } from "@interfaces/api/service";
import { RestaurantID, RestaurantList } from "@interfaces/Restaurant";
import { ReviewQuestion } from "@src/interfaces/ReviewWriter";

export const APIResult: APIStatusList = {
    SUCCEED: "SUCCEED",
    FAILED: "FAILED"
}

// dummy data

const dummy_data: RestaurantList = {
    "TEST_1": {
        restaurant_id: "TEST_1",
        name: "미스터쉐프",
        cat: "한식",
        cat_list: [ "한식", "백반" ],
        img: [
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipP6CzhHav9xakAmOoWNjKFQwvp6FPe_le5kqnO_=w172-h174-n-k-no"
        ],
        contact: "031-289-0402",
        duration: 10 * 60,
        common_review: "나쁘지 않아요",
        short_review: "가볍게 먹기 좋아요",
        reviews: [
            {
                review_id: "RID_T1",
                restaurant_id: "TEST_1",
                tag_list: [
                    {
                        type: "good",
                        value: "distance"
                    },
                    {
                        type: "good",
                        value: "kind"
                    },
                    {
                        type: "good",
                        value: "price"
                    },
                    {
                        type: "bad",
                        value: "taste"
                    },
                    {
                        type: "bad",
                        value: "enter_waiting"
                    },
                ]
            },
            {
                review_id: "RID_T2",
                restaurant_id: "TEST_1",
                tag_list: [
                    {
                        type: "good",
                        value: "kind"
                    },
                    {
                        type: "bad",
                        value: "price"
                    },
                    {
                        type: "good",
                        value: "enter_waiting"
                    },
                ]
            },
            {
                review_id: "RID_T3",
                restaurant_id: "TEST_1",
                tag_list: [
                    {
                        type: "good",
                        value: "distance"
                    },
                    {
                        type: "good",
                        value: "kind"
                    }
                ]
            },
        ],
        location: {
            lat: 37.27921955685363,
            long: 127.04266685032984,
            address: "경기도 수원시 팔달구 우만동 아주로47번길 미스터 쉐프"
        }
    },
    "TEST_2": {
        restaurant_id: "TEST_2",
        name: "만고쿠",
        cat: "일식",
        cat_list: [ "일식", "덮밥", "가라야케" ],
        img: [
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no"
        ],
        contact: "031-289-0402",
        duration: 5 * 60,
        common_review: "맛있어요",
        short_review: "덮밥이 맛있어요",
        reviews: [{
            review_id: "RID_T1",
            restaurant_id: "TEST_2",
            tag_list: [
                {
                    type: "good",
                    value: "distance"
                },
                {
                    type: "bad",
                    value: "kind"
                },
                {
                    type: "good",
                    value: "price"
                },
                {
                    type: "good",
                    value: "taste"
                },
                {
                    type: "bad",
                    value: "enter_waiting"
                },
            ]
        }],
        location: {
            lat: 37.27921955685363,
            long: 127.04266685032984,
            address: "경기도 수원시 팔달구 우만동 아주로47번길 미스터 쉐프"
        }
    },
    "TEST_3": {
        restaurant_id: "TEST_3",
        name: "떡슐랭",
        cat: "분식",
        cat_list: [ "분식", "떡볶이" ],
        img: [
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no"
        ],
        contact: "031-289-0402",
        duration: 12 * 60,
        common_review: "맛있어요",
        short_review: "세트메뉴가 맛있어요",
        reviews: [{
            review_id: "RID_T1",
            restaurant_id: "TEST_3",
            tag_list: [
                {
                    type: "good",
                    value: "distance"
                },
                {
                    type: "good",
                    value: "kind"
                },
                {
                    type: "good",
                    value: "price"
                },
                {
                    type: "bad",
                    value: "taste"
                },
                {
                    type: "bad",
                    value: "enter_waiting"
                },
            ]
        }],
        location: {
            lat: 37.27921955685363,
            long: 127.04266685032984,
            address: "경기도 수원시 팔달구 우만동 아주로47번길 미스터 쉐프"
        }
    },
}

const dummy_question: { [ key in RestaurantID ]: Array<ReviewQuestion> } = {
    "TEST_1": [
        {
            qid: "QID_RESTAURANT_QUESTION",
            ment: "어디를 다녀오셨나요?",
            size: "LARGE",
            answer: { type: "selection-restaurant" }
        },
        {
            qid: "QID_1",
            ment: "위치가 어디쯤인가요?",
            size: "LARGE",
            answer: { type: "selection-location" }
        }, // when newplace
        {
            qid: "QID_2",
            ment: "이중에 알고있는 정보가 있나요?",
            size: "LARGE",
            answer: {
                type: "base-info",
                selection: [
                    {
                        qid: "QID_BASE_INFO",
                        aid: "QID_Restaurant_Number",
                        selectionText: "연락처",
                        subQuestion: {
                            qid: "QID_Restaurant_Number",
                            ment: "이 식당의 연락처가 어떻게 되나요?",
                            size: "MEDIUM",
                            answer: { type: "writing-multiple", placeholders: [ { text: "기본 연락처", width: "90px", necessary: true }, { text: "기타 연락처", width: "90px", necessary: false } ] }
                        }                     
                    },
                    {
                        qid: "QID_BASE_INFO",
                        aid: "QID_Restaurant_Menu",
                        selectionText: "메뉴",
                        subQuestion: {
                            qid: "QID_Restaurant_Menu",
                            ment: "이 식당의 메뉴들을 아시는만큼 알려주세요",
                            size: "MEDIUM",
                            answer: { type: "writing-multiple", placeholders: [{ text: "메뉴명", width: "60px", necessary: false } ] }
                        }                     
                    },
                    {
                        qid: "QID_BASE_INFO",
                        aid: "QID_Restaurant_Worktime",
                        selectionText: "영업시간",
                        subQuestion: {
                            qid: "QID_Restaurant_Worktime",
                            ment: "이 식당의 영업시간을 알려주세요",
                            size: "MEDIUM",
                            answer: { type: "selection-worktime" }
                        }                     
                    },
                ]
            }
        }, // when newplace
        {
            qid: "QID_3",
            ment: "언제 다녀오셨나요?",
            size: "LARGE",
            answer: {
                type: "selection-time"
            }
        },
        {
            qid: "QID_4",
            ment: "가격은 어떤가요?",
            size: "HALF_MEDIUM",
            answer: {
                type: "selection",
                selection: [
                    {
                        qid: "QID_4",
                        aid: "AID_1",
                        selectionText: "비싸요",
                        value: 2
                    },
                    {
                        qid: "QID_4",
                        aid: "AID_2",
                        selectionText: "적당해요",
                        value: 1
                    },
                    {
                        qid: "QID_4",
                        aid: "AID_3",
                        selectionText: "가성비에요",
                        value: 0
                    },
                ]
            }
        }, // price
        {
            qid: "QID_5",
            ment: "맛은 어때요?",
            size: "HALF_MEDIUM",
            answer: {
                type: "selection",
                selection: [
                    {
                        qid: "QID_5",
                        aid: "AID_1",
                        selectionText: "진짜 맛있었어요",
                        value: 3
                    },
                    {
                        qid: "QID_5",
                        aid: "AID_2",
                        selectionText: "먹을만 했어요",
                        value: 2
                    },
                    {
                        qid: "QID_5",
                        aid: "AID_3",
                        selectionText: "그럭저럭이었어요",
                        value: 1
                    },
                    {
                        qid: "QID_5",
                        aid: "AID_4",
                        selectionText: "별로였어요",
                        value: 0
                    },
                ]
            }
        }, // taste
        {
            qid: "QID_6",
            ment: "음식양은 어떤가요?",
            size: "HALF_MEDIUM",
            answer: {
                type: "selection",
                selection: [
                    {
                        qid: "QID_6",
                        aid: "AID_1",
                        selectionText: "무한리필이에요",
                        value: 2
                    },
                    {
                        qid: "QID_6",
                        aid: "AID_2",
                        selectionText: "양이 많아요",
                        value: 1
                    },
                    {
                        qid: "QID_6",
                        aid: "AID_3",
                        selectionText: "적당해요",
                        value: 0
                    },
                    {
                        qid: "QID_6",
                        aid: "AID_4",
                        selectionText: "조금 적어요",
                        value: -1
                    },
                    {
                        qid: "QID_6",
                        aid: "AID_5",
                        selectionText: "부족해요",
                        value: -2
                    },
                ]
            }
        }, // amount
        {
            qid: "QID_7",
            ment: "친절했나요?",
            size: "HALF_MEDIUM",
            answer: {
                type: "selection",
                selection: [
                    {
                        qid: "QID_7",
                        aid: "AID_1",
                        selectionText: "친절해요",
                        value: 3
                    },
                    {
                        qid: "QID_7",
                        aid: "AID_2",
                        selectionText: "그럭저럭이에요",
                        value: 2
                    },
                    {
                        qid: "QID_7",
                        aid: "AID_3",
                        selectionText: "불친절해요",
                        value: -1
                    },
                    {
                        qid: "QID_7",
                        aid: "AID_4",
                        selectionText: "잘 모르겠어요",
                        value: 0
                    },
                ]
            }
        }, // kind
        // {
        //     qid: "QID_8",
        //     ment: "학교에서 가기에 어떤가요?",
        //     size: "LARGE",
        //     answer: {
        //         type: "selection",
        //         selection: []
        //     }
        // }, // distance
        // {
        //     qid: "QID_9",
        //     ment: "들어가는데 오래 걸렸나요?",
        //     size: "LARGE",
        //     answer: {
        //         type: "selection",
        //         selection: []
        //     }
        // }, // enter_waiting
        // {
        //     qid: "QID_10",
        //     ment: "음식이 나오는 시간은요?",
        //     size: "LARGE",
        //     answer: {
        //         type: "selection",
        //         selection: []
        //     }
        // }, // food_waiting
    ],
    "TEST_2": [
        {
            qid: "QID_RESTAURANT_QUESTION",
            ment: "어디를 다녀오셨나요?",
            size: "LARGE",
            answer: { type: "selection-restaurant" }
        },
        {
            qid: "QID_1",
            ment: "위치가 어디쯤인가요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // when newplace
        {
            qid: "QID_2",
            ment: "이중에 알고있는 정보가 있나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // when newplace
        {
            qid: "QID_3",
            ment: "언제 다녀오셨나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        },
        {
            qid: "QID_4",
            ment: "가격은 어떤가요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // price
        {
            qid: "QID_5",
            ment: "맛은 어때요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // taste
        {
            qid: "QID_6",
            ment: "음식양은 많이 주나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // amount
        {
            qid: "QID_7",
            ment: "친절했나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // kind
        {
            qid: "QID_8",
            ment: "학교에서 가기에 어떤가요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // distance
        {
            qid: "QID_9",
            ment: "들어가는데 오래 걸렸나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // enter_waiting
        {
            qid: "QID_10",
            ment: "음식이 나오는 시간은요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // food_waiting
    ],
    "TEST_3": [
        {
            qid: "QID_RESTAURANT_QUESTION",
            ment: "어디를 다녀오셨나요?",
            size: "LARGE",
            answer: {
                type: "selection-restaurant"
            }
        },
        {
            qid: "QID_1",
            ment: "위치가 어디쯤인가요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // when newplace
        {
            qid: "QID_2",
            ment: "이중에 알고있는 정보가 있나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // when newplace
        {
            qid: "QID_3",
            ment: "언제 다녀오셨나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        },
        {
            qid: "QID_4",
            ment: "가격은 어떤가요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // price
        {
            qid: "QID_5",
            ment: "맛은 어때요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // taste
        {
            qid: "QID_6",
            ment: "음식양은 많이 주나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // amount
        {
            qid: "QID_7",
            ment: "친절했나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // kind
        {
            qid: "QID_8",
            ment: "학교에서 가기에 어떤가요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // distance
        {
            qid: "QID_9",
            ment: "들어가는데 오래 걸렸나요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // enter_waiting
        {
            qid: "QID_10",
            ment: "음식이 나오는 시간은요?",
            size: "LARGE",
            answer: {
                type: "selection",
                selection: []
            }
        }, // food_waiting
    ],
}

const dummy_response: { 
    getRestaurantList: RestaurantListAPIResult,
    getRestaurant: { [ key: string ]: RestaurantAPIResult },
    getReviewQuestion: { [ key: RestaurantID ]: ReviewQuestionAPIResult }
} = {
    getRestaurantList: {
        result: APIResult.SUCCEED,
        list: dummy_data
    },
    getRestaurant: {
        "TEST_1": {
            result: APIResult.SUCCEED,
            data: {
                loaded: true,
                ...dummy_data["TEST_1"]
            }
        },
        "TEST_2": {
            result: APIResult.SUCCEED,
            data: {
                loaded: true,
                ...dummy_data["TEST_2"]
            }
        },
        "TEST_3": {
            result: APIResult.SUCCEED,
            data: {
                loaded: true,
                ...dummy_data["TEST_3"]
            }
        },
    },
    getReviewQuestion: {
        "TEST_1": {
            result: APIResult.SUCCEED,
            data: dummy_question[ "TEST_1" ]
        },
        "TEST_2": {
            result: APIResult.SUCCEED,
            data: dummy_question[ "TEST_2" ]
        },
        "TEST_3": {
            result: APIResult.SUCCEED,
            data: dummy_question[ "TEST_3" ]
        }
    }
}

export const getRestaurantList = async ( lat: number, long: number ): Promise<RestaurantListAPIResult> => {
    // try {
    //     const { data: result }: { data: RestaurantListAPIResult } = await axios.post("/restaurant/list", { location: { lat, long } });
    //     return resul37.27921955685363;
    // } catch( e: any )37.27921955685363{
    //     console.error(e);
    //     return { result: APIResult.SUCCEED;
    // }
    return dummy_response[ "getRestaurantList" ];
}

export const getRestaurant = async ( id: string ): Promise<RestaurantAPIResult> => {
    // try {
    //     const { data: result }: { data: RestaurantAPIResult } = await axios.post("/restaurant/list", { id });
    //     return result;
    // } catch( e: any ) {
    //     console.error(e);
    //     return { result: APIResult.SUCCEED;
    // }
    return dummy_response["getRestaurant"][ id ];
}

export const getReviewQuestion = async ( restaurant_id: RestaurantID ): Promise<ReviewQuestionAPIResult> => {
    // try {
    //     const { data: result }: { data: ReviewQuestionAPIResult } = await axios.get(`/review/questions?rid=${ restaurant_id }`);
    //     return result;
    // } catch( e: any ) {
    //     console.error(e);
    //     return { result: APIResult.SUCCEED;
    // }
    return dummy_response["getReviewQuestion"][ restaurant_id ];
}