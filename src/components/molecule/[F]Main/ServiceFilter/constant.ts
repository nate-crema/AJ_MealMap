import { CSSProperties } from "react";
import { FilterFilteringModeTypes } from "./types";

// 필터링모드: 상수정의
export const FilterFilteringModeUnset = "unset";
export const FilterFilteringModeWorktime = "worktime";
export const FilterFilteringModeMenu = "menu";
export const FilterFilteringModePrice = "price";
export const FilterFilteringModeLocator = "locator";
export const FilterFilteringModePeople = "people";

// 필터링모드 유형
export const FILTER_TYPES: Array<{
    text: string,
    icn: string,
    id: string,
    style?: CSSProperties | { [ key in string ]: CSSProperties },
    mode: FilterFilteringModeTypes,
    themes: Array<{
        name: string,
        selections: Array<{ text: string, refs: Array<string> }>,
        keywords: Array<string | RegExp>,
        checker: ( text: string ) => boolean,
        getValue: ( text: string ) => { [ keys in string ]: any }
    }>,
    refs: {
        [ keys in string ]: {
            keywords: Array<string | RegExp>,
            checker: ( text: string ) => boolean 
        }
    }
}> = [
    { text: "시간", icn: "worktime", id: "worktime",
        style: {
            ".st0": {
                fill: "var(--theme-color-C)"
            },
            ".st1": {
                fill: "var(--theme-color-C)",
                opacity: "0.2"
            }
        },
        mode: FilterFilteringModeWorktime,
        themes: [
            {
                name: "시작 및 종료시간",
                selections: [
                    { text: "${0}에 시작하는", refs: ["$[시간]"] },
                    { text: "${0}에 끝나는", refs: ["$[시간]"] }
                ],
                keywords: [ "시작", "끝" ],
                checker(text) {
                    return (
                        this.keywords
                        .map( v => text.match( v ) ? true : false )
                        .reduce( (p, c) => p || c )
                    )
                },
                getValue(text) {
                    
                    return { "test": 0 }
                }
            },
            {
                name: "영업여부",
                selections: [
                    { text: "${0}에 영업하는", refs: [ `$[OR($[시간] | $[요일] | $[날짜] | $[기간])]` ] },
                    { text: "${0}에 열려있는", refs: [ `$[OR($[시간] | $[요일] | $[날짜] | $[기간])]` ] },
                    { text: "${0}에 갈 수 있는", refs: [ `$[OR($[시간] | $[요일] | $[날짜] | $[기간])]` ] },
                    { text: "${0}에 이용 가능한", refs: [ `$[OR($[시간] | $[요일] | $[날짜] | $[기간])]` ] }
                ],
                keywords: [ "영업", "열려", "열린", "갈 수", "이용", "방문", "들릴" ],
                checker(text) {
                    return (
                        this.keywords
                        .map( v => text.match( v ) ? true : false )
                        .reduce( (p, c) => p || c )
                    )
                },
                getValue(text) {
                    return { "test": 0 }
                }
            },
        ],
        refs: {
            "$[시간]": {
                keywords: [
                    /\d:\d/g,
                    /오전.\d{0,}시/g, /오후.\d{0,}시/g, /낮.\d{0,}시/g, /밤.\d{0,}시/g,
                    /\d{0,}시/g, /\d{0,}시.\d{0,}분/g,
                    /아침/g, /점심/g, /저녁/g
                ],
                checker(text) {
                    return (
                        this.keywords
                        .map( v => text.match( v ) ? true : false )
                        .reduce( (p, c) => p || c )
                    )
                } 
            },
        }
    },
    {
        text: "메뉴", icn: "menu", id: "menu", mode: FilterFilteringModeMenu,
        themes: [],
        refs: {}
    },
    {
        text: "가격", icn: "price", id: "price", mode: FilterFilteringModePrice,
        themes: [],
        refs: {}
    },
    {
        text: "위치", icn: "locator", id: "locator", mode: FilterFilteringModeLocator,
        themes: [],
        refs: {}
    },
    {
        text: "사람", icn: "people", id: "people", mode: FilterFilteringModePeople,
        themes: [],
        refs: {}
    }
];

export const SEARCHTEXT_SPLIT_FILTERS = /는|한|(가-힣{0,})하고/g;