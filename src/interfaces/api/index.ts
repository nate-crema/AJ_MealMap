// Interface Declaration: API Global ( api )

// API

export type APISuccess = "SUCCEED";
export type APIError = "FAILED";
export type APIStatus = APISuccess | APIError;

export type APIStatusList = {
    SUCCEED: APISuccess
    FAILED: APIError
}

export type StandardAPIResult<S> = {
    client_version: string
} & ( {
    api_version: string
    result: APISuccess
    status: 200
    data: S
    error?: null
} | {
    api_version?: null
    result: APIError
    status: number
    data?: null
    error: any
} )

export type StandardAPIUpdateResult<REQ, RES> = StandardAPIResult<{
    received: REQ,
    action: "OVERWRITED" | "ADDED" | "REMOVED" | "REPLACED" | "IGNORED" | "REJECTED",
    reason?: string,
    result: RES
}>

export type AssetAPIResult<S> = {
    api_version: string
    client_version: string
} & ( {
    result: APISuccess
    status: 200
    data: S
    error?: null
} | {
    result: APIError
    status: number
    data: null
    error: any
} )