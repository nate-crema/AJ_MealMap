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
    api_version: string
    client_version: string
} & ( {
    status: 200
    data: S
    error: null
} | {
    status: number
    data: null
    error: any
} )