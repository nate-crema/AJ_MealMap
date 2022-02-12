// Interface Declaration: Restaurant ( data )
import React from "react";
import { RestaurantReview } from "./Review";

// RESTAURANT

export type RestaurantID = string;

export type RestaurantInfo = {
    restaurant_id: RestaurantID,
    name: string,
    cat: string,
    cat_list: Array<string>,
    img: Array<string>,
    contact?: string,
    duration: number,
    common_review: string,
    short_review?: string,
    reviews: Array<RestaurantReview>,
    location: {
        lat: number,
        long: number,
        address: string
    }
};

export type RestaurantCompInfo = ( RestaurantInfo & {
    loaded: true
} ) | {
    loaded: false
};

export type RestaurantList = {
    [ key: string ]: RestaurantInfo
};
