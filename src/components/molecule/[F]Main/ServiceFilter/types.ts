import { FilterFilteringModeWorktime, FilterFilteringModeMenu, FilterFilteringModePrice, FilterFilteringModeLocator, FilterFilteringModePeople, FilterFilteringModeUnset } from "./constant";


// 표시모드
export const ServiceFilterDisplayModeUnset = "FILTER/UNSET";
export const ServiceFilterDisplayModeSelection = "FILTER/SELECTION";
export const ServiceFilterDisplayModeSelectedDisplay = "FILTER/SELECT_DP";

export type ServiceFilterDisplayModeUnsetType = typeof ServiceFilterDisplayModeUnset;
export type ServiceFilterDisplayModeSelectionType = typeof ServiceFilterDisplayModeSelection;
export type ServiceFilterDisplayModeSelectedDisplayType = typeof ServiceFilterDisplayModeSelectedDisplay;

export type ServiceFilterDisplayModeTypes = ServiceFilterDisplayModeUnsetType | ServiceFilterDisplayModeSelectionType | ServiceFilterDisplayModeSelectedDisplayType;

// 필터링모드 관련
export type FilterFilteringModeUnsetType = typeof FilterFilteringModeUnset;

export type FilterFilteringModeWorktimeType = typeof FilterFilteringModeWorktime;
export type FilterFilteringModeMenuType = typeof FilterFilteringModeMenu;
export type FilterFilteringModePriceType = typeof FilterFilteringModePrice;
export type FilterFilteringModeLocatorType = typeof FilterFilteringModeLocator;
export type FilterFilteringModePeopleType = typeof FilterFilteringModePeople;

export type FilterFilteringModeTypes = FilterFilteringModeWorktimeType | FilterFilteringModeMenuType | FilterFilteringModePriceType | FilterFilteringModeLocatorType | FilterFilteringModePeopleType;


export type ServiceFilterSelectedFilterType = { [ keys in FilterFilteringModeTypes ]?: {
    theme: string,
    loc: number,
    converted: any // 추후 수정 필요
} };