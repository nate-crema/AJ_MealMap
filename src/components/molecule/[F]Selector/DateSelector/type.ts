// Types: DateSeletor

// service common relate types
export const DateSelectorHandleValueHour = "hour";
export const DateSelectorHandleValueMinute = "minute";
export const DateSelectorHandleValueMonth = "month";
export const DateSelectorHandleValueDay = "day";
export const DateSelectorHandleValueAmpm = "ampm";

export type DateSelectorHandleValueHourType = typeof DateSelectorHandleValueHour;
export type DateSelectorHandleValueMinuteType = typeof DateSelectorHandleValueMinute;
export type DateSelectorHandleValueMonthType = typeof DateSelectorHandleValueMonth;
export type DateSelectorHandleValueDayType = typeof DateSelectorHandleValueDay;
export type DateSelectorHandleValueAmpmType = typeof DateSelectorHandleValueAmpm;

export type DateSelectorHandleValueTypes = DateSelectorHandleValueHourType | DateSelectorHandleValueMinuteType | DateSelectorHandleValueMonthType | DateSelectorHandleValueDayType | DateSelectorHandleValueAmpmType;


// inputValue: relate types
export const DateSelectorInputCategoryTime = "time";
export const DateSelectorInputCategoryAmpm = "am/pm";
export const DateSelectorInputCategoryDate = "date";

export type DateSelectorInputCategoryTimeType = typeof DateSelectorInputCategoryTime;
export type DateSelectorInputCategoryAmpmType = typeof DateSelectorInputCategoryAmpm;
export type DateSelectorInputCategoryDateType = typeof DateSelectorInputCategoryDate;

export type DateSelectorInputCategoryTypes = DateSelectorInputCategoryTimeType | DateSelectorInputCategoryAmpmType | DateSelectorInputCategoryDateType;


// onValueSucceed: relate types
export type SelectedValueType = {
    [ keys in DateSelectorHandleValueTypes ]?: number
};


// lang: relate types
export const DateSelectorDisplayLanguageKorean = "ko";
export const DateSelectorDisplayLanguageEnglish = "en";

export type DateSelectorDisplayLanguageKoreanType = typeof DateSelectorDisplayLanguageKorean;
export type DateSelectorDisplayLanguageEnglishType = typeof DateSelectorDisplayLanguageEnglish;


export type DateSelectorDisplayLanguageTypes = DateSelectorDisplayLanguageKoreanType | DateSelectorDisplayLanguageEnglishType;