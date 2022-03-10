// Interface Declaration: auth ( api )

import { ServiceLanguage, ServiceLanguageEnglish, ServiceLanguageKorean } from "../Service";

// API

export type APISuccess = "SUCCEED";
export type APIError = "FAILED";
export type APIStatus = APISuccess | APIError;

export type APIStatusList = {
    SUCCEED: APISuccess
    FAILED: APIError
}

export type UnivMajorSelectionList = Array<{
    text: {
        ko: string
        en: string
    }
    value: number
}>

export type UnivMajorSelectionListAPIResult = {
    result: APISuccess
    list: UnivMajorSelectionList
} | {
    result: APIError
    reason?: any
}

export type StandardUnivTextInfoType = {
    id: string
    [ ServiceLanguageKorean ]: string
    [ ServiceLanguageEnglish ]: string
}

export type DepartedUserInfo = {
    college: StandardUnivTextInfoType,
    department: StandardUnivTextInfoType,
    major: StandardUnivTextInfoType
}

export type UserDepartAPIResult = {
    result: APISuccess
    userinfo: DepartedUserInfo
} | {
    result: APIError
    reason?: any
}