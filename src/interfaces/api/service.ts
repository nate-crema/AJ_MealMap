// Interface Declaration: service ( api )
import { APISuccess, APIError } from "@interfaces/api";
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { ReviewQuestion } from "../ReviewWriter";

// API

export type ShopAPIResult = {
    result: APISuccess
    data: ShopServiceType
} | {
    result: APIError
    reason: string
}