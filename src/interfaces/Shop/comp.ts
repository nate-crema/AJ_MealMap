// Interface Declaration: Shop ( comp )
import React from "react";

// Shop

export const ShopCompDisplay  = "display";
export const ShopCompReview  = "review";

export type ShopCompDisplayType = typeof ShopCompDisplay;
export type ShopCompReviewType = typeof ShopCompReview;
export type ShopCompType = ShopCompDisplayType | ShopCompReviewType;
