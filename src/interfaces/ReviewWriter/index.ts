// Interface Declaration: ReviewWriter ( comp )
import React, { CSSProperties } from "react";
import { Type } from "typescript";
import { RestaurantID } from "../Restaurant";
import { ComponentOpenState } from "../Subdisplay";

export type QuestionID = string;
export type AnswerID = string;
export const RestaurantWhereQuestionID: QuestionID = "QID_RESTAURANT_QUESTION";
export const BaseInfoQuestionID: QuestionID = "QID_BASE_INFO";

export type ReviewAnswerFormat = {
    qid: QuestionID
    aid: AnswerID
}

export type ReviewSelectionFormat = ReviewAnswerFormat & {
    selectionText: string
    value: number
    style?: CSSProperties
}

export type BaseInfoSelectionFormat = ReviewAnswerFormat & {
    qid: "QID_BASE_INFO"
    aid: QuestionID
    icn?: HTMLOrSVGElement
    selectionText: string
    style?: CSSProperties
    subQuestion: ReviewQuestion
}

export type RestaurantSelectionFormat = ReviewAnswerFormat & {
    selectionText: string
    value: RestaurantID
    style?: CSSProperties
}

export type ReviewPresetAnswerSelection = "selection";
export type ReviewPresetAnswerSelectionRestaurant = "selection-restaurant";
export type ReviewPresetAnswerSingleWriting = "writing-single";
export type ReviewPresetAnswerMultipleWriting = "writing-multiple";
export type ReviewPresetAnswerSelectionDate = "selection-date";
export type ReviewPresetAnswerSelectionTime = "selection-time";
export type ReviewPresetAnswerSelectionWorkTime = "selection-worktime";
export type ReviewPresetAnswerSelectionLocation = "selection-location";
export type ReviewPresetAnswerBaseInfo = "base-info";
export type ReviewPresetAnswerTypes = (
    ReviewPresetAnswerSelection |
    ReviewPresetAnswerSelectionRestaurant |
    ReviewPresetAnswerSingleWriting |
    ReviewPresetAnswerMultipleWriting |
    ReviewPresetAnswerSelectionDate |
    ReviewPresetAnswerSelectionTime |
    ReviewPresetAnswerSelectionWorkTime |
    ReviewPresetAnswerSelectionLocation |
    ReviewPresetAnswerBaseInfo
);

export type ReviewQuestion = {
    qid: QuestionID
    ment: string
    size: ComponentOpenState
    answer: {
        type: ReviewPresetAnswerSelection
        selection: Array<ReviewSelectionFormat>
        inputMents?: null
    } | {
        type: ReviewPresetAnswerSelectionRestaurant
        selection?: null
        inputMents?: null
    } | {
        type: ReviewPresetAnswerBaseInfo
        selection: Array<BaseInfoSelectionFormat>
    } | {
        type: ReviewPresetAnswerSingleWriting | ReviewPresetAnswerSelectionLocation
        selection?: null
        inputMents?: null
    } | {
        type: ReviewPresetAnswerMultipleWriting
        selection?: null
        inputMents?: null
        placeholders?: Array<{
            text: string,
            width: string,
            necessary: boolean
        }>
        maxInput?: number
    } | {
        type: ReviewPresetAnswerSelectionDate | ReviewPresetAnswerSelectionTime
        selection?: null 
        inputMents?: Array<string>
        maxInput?: number
    } | {
        type: ReviewPresetAnswerSelectionWorkTime
        selection?: null 
        inputMents?: null
        maxInput?: null
    }
    
}


export type AnswerCommonTypeWriting = Array<string> | string | null;
export type AnswerCommonTypeSelecting = number;
export type AnswerTypes = AnswerCommonTypeWriting | AnswerCommonTypeSelecting

export type ReviewAnswer = {
    qid: QuestionID
    aid?: AnswerID | null
    answer?: AnswerCommonTypeWriting
    subAnswers?: { [ key in QuestionID ]: AnswerTypes }
}