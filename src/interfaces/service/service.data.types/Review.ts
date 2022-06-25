// Interface Declaration: Shop - Review ( data )
import { ShopIDType } from "@interfaces/service/service.data.types/Shop";

// Shop - REVIEW

export type ReviewID = string;
export type ReviewType = "good" | "bad" ;

export type price = "price";
export type taste = "taste";
export type amount = "amount";
export type kind = "kind";
export type interior = "interior";
export type distance = "distance";
export type enterWaiting = "enter_waiting";
export type foodWaiting = "food_waiting";
export type ReviewCategory = price | taste | amount | kind | interior | distance | enterWaiting | foodWaiting;

export type ReviewTag = {
    type: ReviewType,
    value: ReviewCategory
}

export type ShopReview = {
    review_id: ReviewID,
    shop_id: ShopIDType,
    tag_list: Array<ReviewTag>
}