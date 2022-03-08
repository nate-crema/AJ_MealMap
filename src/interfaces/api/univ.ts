// Interface Declaration: auth ( api )

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