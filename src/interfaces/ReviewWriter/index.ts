// Interface Declaration: ReviewWriter ( comp )
import React from "react";
import { Type } from "typescript";
import { RestaurantID } from "../Restaurant";
import { ComponentOpenState } from "../Subdisplay";

export type QuestionID = string;
export type AnswerID = string;
export const RestaurantWhereQuestionID: QuestionID = "QID_RESTAURANT_QUESTION";

export type ReviewAnswerFormat = {
    qid: QuestionID
    aid: AnswerID
}

export type ReviewSelectionFormat = ReviewAnswerFormat & {
    selectionText: string
    value: number
    style?: CSSStyleSheet
}

export type RestaurantSelectionFormat = ReviewAnswerFormat & {
    selectionText: string
    value: RestaurantID
    style?: CSSStyleSheet
}

export type ReviewQuestionPreAnswerSelection = "selection";
export type ReviewQuestionPreAnswerSelectionRestaurant = "selection-restaurant";
export type ReviewQuestionPreAnswerWriting = "writing";
export type ReviewQuestionPreAnswerSelectionDate = "selection-date";
export type ReviewQuestionPreAnswerSelectionLocation = "selection-location";
export type ReviewQuestionPreAnswerTypes = (
    ReviewQuestionPreAnswerSelection |
    ReviewQuestionPreAnswerSelectionRestaurant |
    ReviewQuestionPreAnswerWriting |
    ReviewQuestionPreAnswerSelectionDate |
    ReviewQuestionPreAnswerSelectionLocation
);

export type ReviewQuestion = {
    qid: QuestionID
    ment: string
    size: ComponentOpenState
    answer: {
        type: ReviewQuestionPreAnswerSelection
        selection: Array<ReviewSelectionFormat>
    } | {
        type: ReviewQuestionPreAnswerSelectionRestaurant
        selection?: null
    } | {
        type: ReviewQuestionPreAnswerWriting | ReviewQuestionPreAnswerSelectionDate | ReviewQuestionPreAnswerSelectionLocation
        selection?: null
    }
}


export type AnswerCommonTypeWriting = string | null;
export type AnswerCommonTypeSelecting = number;
export type AnswerTypes = AnswerCommonTypeWriting | AnswerCommonTypeSelecting

export type ReviewAnswer = {
    qid: QuestionID
    aid?: AnswerID | null
    answer?: AnswerCommonTypeWriting
}