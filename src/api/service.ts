import axios from "@connection/request";

// interface

import { RestaurantListAPIResult, RestaurantAPIResult } from "@interfaces/api/service";
import { RestaurantList } from "@src/interfaces/Restaurant";


// dummy data

const dummy_data: RestaurantList = {
    "TEST_1": {
        rid: "TEST_1",
        name: "미스터쉐프",
        img: [
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipP6CzhHav9xakAmOoWNjKFQwvp6FPe_le5kqnO_=w172-h174-n-k-no"
        ],
        duration: 10 * 60,
        common_review: "나쁘지 않아요",
        short_review: "가볍게 먹기 좋아요",
    },
    "TEST_2": {
        rid: "TEST_2",
        name: "만고쿠",
        img: [
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no"
        ],
        duration: 5 * 60,
        common_review: "맛있어요",
        short_review: "덮밥이 맛있어요",
    },
    "TEST_3": {
        rid: "TEST_3",
        name: "떡슐랭",
        img: [
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipOECAv1jlX-XO4jyfhmSoic218AvbKi1g0o11qd=w520-h350-n-k-no",
            "https://lh5.googleusercontent.com/p/AF1QipPWWPcgqW6dHqzUG8Q--QX6gA0tkfNzmM46lrzs=w260-h174-n-k-no"
        ],
        duration: 12 * 60,
        common_review: "맛있어요",
        short_review: "세트메뉴가 맛있어요",
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
    //     return result;
    // } catch( e: any ) {
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