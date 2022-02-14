// Interface Declaration: service ( api )
import { RestaurantList, RestaurantCompInfo } from "../Restaurant";

// API

export type APISuccess = "SUCCEED";
export type APIError = "FAILED";
export type APIStatus = APISuccess | APIError;

export type APIStatusList = {
    SUCCEED: APIStatus,
    FAILED: APIStatus
}

export type RestaurantListAPIResult = {
    result: APISuccess,
    list: RestaurantList
} | {
    result: APIError,
    list?: any
};

export type RestaurantAPIResult = {
    result: APISuccess,
    data: RestaurantCompInfo
} | {
    result: APIError,
    data?: any
}