// Interface Declaration: service api
import React from "react";

// RESTAURANT

export type RestaurantInfo = {
    rid: string,
    name: string,
    img: Array<string>,
    duration: number,
    common_review: string,
    short_review?: string,
};

export type RestaurantCompInfo = ( RestaurantInfo & {
    loaded: true
} ) | {
    loaded: false
};

export type RestaurantList = {
    [ key: string ]: RestaurantInfo
};
