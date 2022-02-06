// Interface Declaration: Restaurant ( data )
import React from "react";

// RESTAURANT

export type RID = string;

export type RestaurantInfo = {
    rid: RID,
    name: string,
    cat: string,
    cat_list: Array<string>,
    img: Array<string>,
    duration: number,
    common_review: string,
    short_review?: string,
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
