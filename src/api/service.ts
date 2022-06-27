import axios from "@connection/request";

// interface

import { APIStatusList, StandardAPIResult } from "@interfaces/api";
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
            "3": "https://mblogthumb-phinf.pstatic.net/MjAxNjEyMDVfMjgx/MDAxNDgwOTE5MjE0Nzg1.-OTbiXhG5VUugKLwaECsq886wHk-01EgpVxiIEbI5q4g.JfOldMO7dCqzInx7cIcRbNMWuBRFcQYLmDqyBeEHXVwg.JPEG.ggg5194/KakaoTalk_20161205_125014935.jpg?type=w2"
        },
        menus: {
            "제육두루치기": {
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "뚝배기불고기": {
                price: 6500,
                is_limit: false,
                reviews: []
            },
            "차돌된장찌개": {
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "돼지김치찌개": {
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "곱창 순두부찌개": {
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "치즈 새우알밥": {
                price: 6000,
                is_limit: false,
                reviews: []
            },
            "뚝배기부대찌개": {
                price: 6500,
                is_limit: false,
                reviews: []
            },
            "알고니 뚝배기": {
                price: 8000,
                is_limit: false,
                reviews: []
            },
            "Chef 수제갈비탕": {
                price: 9500,
                is_limit: false,
                reviews: []
            },
            "Chef 수제돈까스": {
                price: 8000,
                is_limit: false,
                reviews: []
            },
            "냉묵밥": {
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
            review_cnt: 15
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
            default: "031-289-0402"
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