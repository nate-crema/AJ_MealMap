// Interface Declaration: service api
import { RestaurantList, RestaurantCompInfo } from "../Restaurant";

// API

export type APISuccess = "SUCCESS";
export type APIError = "FAILED";
export type APIStatus = APISuccess | APIError;

export type APIStatusList = {
    SUCCESS: APIStatus,
    FAILED: APIStatus
}

export type RestaurantListAPIResult = {
    result: APISuccess,
    list: RestaurantList
} | {
    result: APIError
};

export type RestaurantAPIResult = {
    result: APISuccess,
    data: RestaurantCompInfo
} | {
    result: APIError
}