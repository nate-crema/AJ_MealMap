import axios from "@connection/request";

// interface

import { RestaurantListAPIResult, RestaurantAPIResult } from "@interfaces/api/service";
import { RestaurantList } from "@interfaces/Restaurant";


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

const dummy_response: { getRestaurantList: RestaurantListAPIResult, getRestaurant: { [ key: string ]: RestaurantAPIResult } } = {
    getRestaurantList: {
        result: "SUCCESS",
        list: dummy_data
    },
    getRestaurant: {
        "TEST_1": {
            result: "SUCCESS",
            data: {
                loaded: true,
                ...dummy_data["TEST_1"]
            }
        },
        "TEST_2": {
            result: "SUCCESS",
            data: {
                loaded: true,
                ...dummy_data["TEST_2"]
            }
        },
        "TEST_3": {
            result: "SUCCESS",
            data: {
                loaded: true,
                ...dummy_data["TEST_3"]
            }
        },
    }
}

export const getRestaurantList = async ( lat: number, long: number ): Promise<RestaurantListAPIResult> => {
    // try {
    //     const { data: result }: { data: RestaurantListAPIResult } = await axios.post("/restaurant/list", { location: { lat, long } });
    //     return resul37.27921955685363;
    // } catch( e: any )37.27921955685363{
    //     console.error(e);
    //     return { result: "FAILED" };
    // }
    return dummy_response[ "getRestaurantList" ];
}

export const getRestaurant = async ( id: string ): Promise<RestaurantAPIResult> => {
    // try {
    //     const { data: result }: { data: RestaurantAPIResult } = await axios.post("/restaurant/list", { id });
    //     return result;
    // } catch( e: any ) {
    //     console.error(e);
    //     return { result: "FAILED" };
    // }
    return dummy_response["getRestaurant"][ id ];
}