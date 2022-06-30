import axios from "@connection/request";
import AssetAxios from "@connection/asset";

// interface

import { APIStatusList, AssetAPIResult, StandardAPIResult } from "@interfaces/api";
import { ReviewQuestion } from "@src/interfaces/ReviewWriter";
import { ServiceCoordinateType, ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import {
    ShopMainCategoryRestaurant,
    ShopRestaurantSubCategoryJapan,
    ShopRestaurantSubCategoryKorean,
    ShopRestaurantSubCategorySnack
} from "@constant/service/Shop";

export const APIResult: APIStatusList = {
    SUCCEED: "SUCCEED",
    FAILED: "FAILED"
}

// dummy data

const dummy_data: Array<ShopServiceType> = [
    {
        shopID: "TEST_1",
        name: "미스터쉐프",
        category: { main: ShopMainCategoryRestaurant, sub: ShopRestaurantSubCategoryKorean },
        loc: {
            address: "경기도 수원시 팔달구 우만동 아주로47번길 미스터 쉐프",
            lat: 37.27921955685363,
            long: 127.04266685032984
        },
        contact: {
            default: "031-289-0402"
        },
        imgs: {
            default: "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjQ1/MDAxNDgwOTE5MjE2Mzgw.LyzRt6AJabprWIuLZtt-NFYqlTtgLmwMCsHEIuPnDgQg.BkIGa9cwfPCvYDU8lBn1hjsazXZV7qpGVKgH95Lt6Xwg.JPEG.ggg5194/KakaoTalk_20161205_125013806.jpg?type=w2",
            "1": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMTk5/MDAxNDgwOTE5MjE2MTU2.mn9LOjXXNd8KjloV_DJa72jA6gyrscHwF6wHxCIP4XAg.ohLvPOtUfYpglFnQ_SH8oKWDyjdwwJ-TqmjW-nm9QS4g.JPEG.ggg5194/KakaoTalk_20161205_125014066.jpg?type=w2",
            "2": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfODQg/MDAxNDgwOTE5MjE1MjU2.0fpRCwcJeK1WvFIsE5cePL8ixbwNDypN1tyH7c4Y-3og.2DxPm0I6Wbqrcmeaj5kZj6mXvpf0wG04lB0DB7E40e8g.JPEG.ggg5194/KakaoTalk_20161205_125011021.jpg?type=w2",
            "3": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "4": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "5": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "6": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "7": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "8": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "9": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2",
            "10": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2"
        },
        menus: {
            "제육두루치기": {
                img: "data:image/jpeg;base64,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",
                cat: 0,
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "뚝배기불고기": {
                cat: 0,
                price: 6500,
                is_limit: false,
                reviews: []
            },
            "차돌된장찌개": {
                cat: 0,
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "돼지김치찌개": {
                cat: 0,
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "곱창 순두부찌개": {
                cat: 0,
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "치즈 새우알밥": {
                cat: 0,
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "뚝배기부대찌개": {
                cat: 0,
                price: 6500,
                is_limit: false,
                reviews: []
            },
            "알고니 뚝배기": {
                cat: 0,
                price: 8000,
                is_limit: false,
                reviews: []
            },
            "Chef 수제갈비탕": {
                cat: 1,
                price: 9500,
                is_limit: false,
                reviews: []
            },
            "Chef 수제돈까스": {
                cat: 1,
                price: 8000,
                is_limit: false,
                reviews: []
            },
            "냉묵밥": {
                cat: 0,
                price: 6000,
                is_limit: true,
                reviews: []
            }
        },
        events: {
            "AJOU_CHONG": {
                eventer: "담아",
                logo_img: "https://ajouchong.com/logo.svg",
                logo_color: "#E2665B",
                content: {
                    eventType: 1,
                    text: "[재학생] 10% 할인",
                    condition: { "AND": [ "재학생" ] },
                    discountPriceCalc: ( prevPrice: number ) => {
                        return prevPrice * 90 / 100;
                    } // 할인금액 계산함수
                }
            }
        },
        reviews: {
            score: 9.5,
            review_cnt: 15,
            categorized: {
                taste: {
                    name: "맛(염도)",
                    score: 9.5,
                    cnt: 8,
                    spec_score: {
                        good: {
                            name: "짜요",
                            value: 6
                        },
                        bad: {
                            name: "싱거워요",
                            value: 2
                        }
                    }
                },
                distance: {
                    name: "거리(학교)",
                    score: 9.5,
                    midcnt: 2,
                    cnt: 9,
                    spec_score: {
                        good: {
                            name: "가까워요",
                            value: 6
                        },
                        bad: {
                            name: "멀어요",
                            value: 1
                        }
                    }
                },
                price: {
                    name: "가격",
                    score: 9.5,
                    cnt: 5,
                    spec_score: {
                        good: {
                            name: "가성비에요",
                            value: 0
                        },
                        bad: {
                            name: "비싸요",
                            value: 5
                        }
                    }
                },
            }
        },
        workTime: {
            start_time: {
                "Default": [ 9, 0 ],
                "Monday": [ 9, 0 ],
                "Tuesday": [ 8, 0 ],
                "Wednesday": [ 4, 0 ],
                "Saturday": [ 11, 0 ],
                "Sunday": [ 13, 0 ],
            },
            end_time: {
                "Default": [ 1, 0 ],
                "Monday": [ 11, 0 ],
                "Tuesday": [ 12, 0 ],
                "Wednesday": [ 1, 0 ],
                "Saturday": [ 23, 0 ],
                "Sunday": [ 5, 0 ],
            }
        }
    },
    {
        shopID: "TEST_2",
        name: "만고쿠",
        category: { main: ShopMainCategoryRestaurant, sub: ShopRestaurantSubCategoryJapan },
        loc: {
            address: "경기도 수원시 팔달구 우만동 아주로47번길 미스터 쉐프",
            lat: 37.27921955685363,
            long: 127.04266685032984
        },
        contact: {
            default: "031-289-0402"
        },
        imgs: {},
        menus: {},
        reviews: {
            review_cnt: 0
        }
    },
    {
        shopID: "TEST_3",
        name: "떡슐랭",
        category: { main: ShopMainCategoryRestaurant, sub: ShopRestaurantSubCategorySnack },
        loc: {
            address: "경기도 수원시 팔달구 우만동 아주로47번길 미스터 쉐프",
            lat: 37.27921955685363,
            long: 127.04266685032984
        },
        contact: {
            default: "031-289-0402",
            add1: "010-0000-1234",
            add2: "010-0000-1234",
            add3: "010-0000-1234",
            add4: "010-0000-1234",
            add5: "010-0000-1234",
        },
        imgs: {},
        menus: {},
        reviews: {
            review_cnt: 0
        }
    }
]

const dummy_question: { [ key in ShopIDType ]: Array<ReviewQuestion> } = {
    "TEST_1": [
        {
            qid: "QID_Shop_QUESTION",
            ment: "어디를 다녀오셨나요?",
            size: "LARGE",
            answer: { type: "selection-Shop" }
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
                        aid: "QID_Shop_Number",
                        selectionText: "연락처",
                        subQuestion: {
                            qid: "QID_Shop_Number",
                            ment: "이 식당의 연락처가 어떻게 되나요?",
                            size: "MEDIUM",
                            answer: { type: "writing-multiple", placeholders: [ { text: "기본 연락처", width: "90px", necessary: true }, { text: "기타 연락처", width: "90px", necessary: false } ] }
                        }                     
                    },
                    {
                        qid: "QID_BASE_INFO",
                        aid: "QID_Shop_Menu",
                        selectionText: "메뉴",
                        subQuestion: {
                            qid: "QID_Shop_Menu",
                            ment: "이 식당의 메뉴들을 아시는만큼 알려주세요",
                            size: "MEDIUM",
                            answer: { type: "writing-multiple", placeholders: [{ text: "메뉴명", width: "60px", necessary: false } ] }
                        }                     
                    },
                    {
                        qid: "QID_BASE_INFO",
                        aid: "QID_Shop_Worktime",
                        selectionText: "영업시간",
                        subQuestion: {
                            qid: "QID_Shop_Worktime",
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
            qid: "QID_Shop_QUESTION",
            ment: "어디를 다녀오셨나요?",
            size: "LARGE",
            answer: { type: "selection-Shop" }
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
            qid: "QID_Shop_QUESTION",
            ment: "어디를 다녀오셨나요?",
            size: "LARGE",
            answer: {
                type: "selection-Shop"
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
    getShopList: StandardAPIResult<Array<ShopServiceType>>,
    getShop: { [ key: string ]: StandardAPIResult<ShopServiceType> },
    getReviewQuestion: { [ key: ShopIDType ]: StandardAPIResult<Array<ReviewQuestion>> }
} = {
    getShopList: {
        api_version: "v.0.0.3.alpha",
        client_version: "v.0.0.3.1",
        result: APIResult.SUCCEED,
        status: 200,
        data: dummy_data
    },
    getShop: {
        "TEST_1": {
            api_version: "v.0.0.3.alpha",
            client_version: "v.0.0.3.1",
            result: APIResult.SUCCEED,
            status: 200,
            data: dummy_data.filter( v => v.shopID === "TEST_1" )[0]
        },
        "TEST_2": {
            api_version: "v.0.0.3.alpha",
            client_version: "v.0.0.3.1",
            result: APIResult.SUCCEED,
            status: 200,
            data: dummy_data.filter( v => v.shopID === "TEST_2" )[0]
        },
        "TEST_3": {
            api_version: "v.0.0.3.alpha",
            client_version: "v.0.0.3.1",
            result: APIResult.SUCCEED,
            status: 200,
            data: dummy_data.filter( v => v.shopID === "TEST_3" )[0]
        },
    },
    getReviewQuestion: {
        "TEST_1": {
            api_version: "v.0.0.3.alpha",
            client_version: "v.0.0.3.1",
            result: APIResult.SUCCEED,
            status: 200, 
            data: dummy_question[ "TEST_1" ]
        },
        "TEST_2": {
            api_version: "v.0.0.3.alpha",
            client_version: "v.0.0.3.1",
            result: APIResult.SUCCEED,
            status: 200, 
            data: dummy_question[ "TEST_2" ]
        },
        "TEST_3": {
            api_version: "v.0.0.3.alpha",
            client_version: "v.0.0.3.1",
            result: APIResult.SUCCEED,
            status: 200, 
            data: dummy_question[ "TEST_3" ]
        }
    }
}

// CLIENT_SIDE
export const getShopListByCoordinate = async ( coord: ServiceCoordinateType ): Promise<Array<ShopServiceType>> => {
    const { lat, long } = coord;
    const shop_list: StandardAPIResult<Array<ShopServiceType>> = await getShopList( lat, long );
    if ( shop_list.result === "FAILED" ) return [];
    return shop_list.data;
}

export const getShopInfoByShopID = async ( id: ShopIDType ): Promise<ShopServiceType | null> => {
    const shop: StandardAPIResult<ShopServiceType> = await getShop( id );
    if (shop.result === APIResult.FAILED) return null;
    return shop.data;
}

// API_SIDE

export const getShopList = async ( lat: number, long: number ): Promise<StandardAPIResult<Array<ShopServiceType>>> => {
    // try {
    //     const { data: result }: { data: ShopListAPIResult } = await axios.post("/Shop/list", { location: { lat, long } });
    //     return resul37.27921955685363;
    // } catch( e: any )37.27921955685363{
    //     console.error(e);
    //     return { result: APIResult.SUCCEED;
    // }
    return dummy_response[ "getShopList" ];
}

export const getShop = async ( id: string ): Promise<StandardAPIResult<ShopServiceType>> => {
    // try {
    //     const { data: result }: { data: ShopAPIResult } = await axios.post("/Shop/list", { id });
    //     return result;
    // } catch( e: any ) {
    //     console.error(e);
    //     return { result: APIResult.SUCCEED;
    // }
    return dummy_response["getShop"][ id ];
}

export const getReviewQuestion = async ( Shop_id: ShopIDType ): Promise<StandardAPIResult<Array<ReviewQuestion>>> => {
    // try {
    //     const { data: result }: { data: ReviewQuestionAPIResult } = await axios.get(`/review/questions?rid=${ Shop_id }`);
    //     return result;
    // } catch( e: any ) {
    //     console.error(e);
    //     return { result: APIResult.SUCCEED;
    // }
    return dummy_response["getReviewQuestion"][ Shop_id ];
}

// export const getDurationToShop = async ( id: string, coord: ServiceCoordinateType ): Promise<DurationToShopAPIResult> => {

// }


export const getSvgImage = async ( svg_type: string ): Promise<{ result: APIStatusList["SUCCEED"], data: string } | { result: APIStatusList["FAILED"] }> => {
    try {
        const { data: code_result }: { data: AssetAPIResult<string> } = await AssetAxios.get(`/api/host/getCode?key=${ svg_type }`);
        const { data: code } = code_result;
        
        const { data }: { data: string } = await AssetAxios.get(`/api/host/icn/${ code }`);
        
        return {
            result: APIResult.SUCCEED,
            data
        };
    } catch( e: any ) {
        console.error(e);
        return { result: APIResult.FAILED };
    }
}