// Interface Declaration: service ( api )
import { APISuccess, APIError } from "@interfaces/api";
import { RestaurantList, RestaurantCompInfo } from "../Restaurant";
import { ReviewQuestion } from "../ReviewWriter";

// API

export type RestaurantListAPIResult = {
    result: APISuccess
    list: RestaurantList
} | {
    result: APIError
    list?: any
};

export type RestaurantAPIResult = {
    result: APISuccess
    data: RestaurantCompInfo
} | {
    result: APIError
    data?: any
}

export type ReviewQuestionAPIResult = {
    result: APISuccess
    data: Array<ReviewQuestion>
} | {
    result: APIError
    reason: string
}