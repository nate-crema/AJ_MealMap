// Interface Declaration: auth ( api )

// API

export type APISuccess = "SUCCEED";
export type APIError = "FAILED";
export type APIStatus = APISuccess | APIError;

export type APIStatusList = {
    SUCCEED: APISuccess
    FAILED: APIError
}


export type LoginResultsSucceed = "Logined";
export type LoginResultsNonSucceed = "Pending" | "Failed";
export type LoginResults = LoginResultsSucceed | LoginResultsNonSucceed;

export type ServiceUserInfo = {
    name: string
    pn?: string
    college: string
    departmnet: string
    major: string
}

export type ServiceLoginAPIResult = {
    result: LoginResultsSucceed,
    userinfo: ServiceUserInfo
    expires: string
} | {
    result: LoginResultsNonSucceed
    userinfo: undefined | null
    expires: undefined | null
}