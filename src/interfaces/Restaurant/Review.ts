// Interface Declaration: Restaurant - Review ( data )
import { RestaurantID } from ".";

// RESTAURANT - REVIEW

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

export type RestaurantReview = {
    review_id: ReviewID,
    restaurant_id: RestaurantID,
    tag_list: Array<ReviewTag>
}