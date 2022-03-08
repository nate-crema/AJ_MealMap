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
export type LoginResultsPending = "Pending";
export type LoginResultsFailed = "Failed";
export type LoginResults = LoginResultsSucceed | LoginResultsPending | LoginResultsFailed;

export const LoginResultsFailedNotFound = "User Not Found";
export type LoginResultsFailedNotFoundType = "User Not Found";

export type LoginResultsFailedTypes = LoginResultsFailedNotFoundType;

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
    result: LoginResultsPending
    userinfo: undefined | null
    expires: undefined | null
} | {
    result: LoginResultsFailed
    reason: LoginResultsFailedTypes | string
}

export type ServiceRegisterAPIResult = {
    result: boolean
}

export type ServiceCodeValidChkAPIResult = {
    result: boolean
}