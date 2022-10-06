// Types: DateSeletor

// service common relate types
export const DatetimeSelectorHandleValueHour = "hour";
export const DatetimeSelectorHandleValueMinute = "minute";
export const DatetimeSelectorHandleValueMonth = "month";
export const DatetimeSelectorHandleValueDay = "day";
export const DatetimeSelectorHandleValueAmpm = "ampm";

export type DatetimeSelectorHandleValueHourType = typeof DatetimeSelectorHandleValueHour;
export type DatetimeSelectorHandleValueMinuteType = typeof DatetimeSelectorHandleValueMinute;
export type DatetimeSelectorHandleValueMonthType = typeof DatetimeSelectorHandleValueMonth;
export type DatetimeSelectorHandleValueDayType = typeof DatetimeSelectorHandleValueDay;
export type DatetimeSelectorHandleValueAmpmType = typeof DatetimeSelectorHandleValueAmpm;

export type DatetimeSelectorHandleValueTypes = DatetimeSelectorHandleValueHourType | DatetimeSelectorHandleValueMinuteType | DatetimeSelectorHandleValueMonthType | DatetimeSelectorHandleValueDayType | DatetimeSelectorHandleValueAmpmType;


// inputValue: relate types
export const DatetimeSelectorInputCategoryTime = "time";
export const DatetimeSelectorInputCategoryAmpm = "am/pm";
export const DatetimeSelectorInputCategoryDate = "date";

export type DatetimeSelectorInputCategoryTimeType = typeof DatetimeSelectorInputCategoryTime;
export type DatetimeSelectorInputCategoryAmpmType = typeof DatetimeSelectorInputCategoryAmpm;
export type DatetimeSelectorInputCategoryDateType = typeof DatetimeSelectorInputCategoryDate;

export type DatetimeSelectorInputCategoryTypes = DatetimeSelectorInputCategoryTimeType | DatetimeSelectorInputCategoryAmpmType | DatetimeSelectorInputCategoryDateType;


// onValueSucceed: relate types
export type DatetimeSelectorSelectedValueType = {
    [ keys in DatetimeSelectorHandleValueTypes ]?: number
};


// lang: relate types
export const DatetimeSelectorDisplayLanguageKorean = "ko";
export const DatetimeSelectorDisplayLanguageEnglish = "en";

export type DatetimeSelectorDisplayLanguageKoreanType = typeof DatetimeSelectorDisplayLanguageKorean;
export type DatetimeSelectorDisplayLanguageEnglishType = typeof DatetimeSelectorDisplayLanguageEnglish;


export type DatetimeSelectorDisplayLanguageTypes = DatetimeSelectorDisplayLanguageKoreanType | DatetimeSelectorDisplayLanguageEnglishType;