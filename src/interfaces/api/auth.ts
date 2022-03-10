// Interface Declaration: auth ( api )

// API

export type APISuccess = "SUCCEED";
export type APIError = "FAILED";
export type APIStatus = APISuccess | APIError;

export type APIStatusList = {
    SUCCEED: APISuccess
    FAILED: APIError
}

const LoginResultLogined = "Logined" as const;
const LoginResultPending = "Pending" as const;
const LoginResultFailed = "Failed" as const;
export const LoginResultConstants = {
    LOGINED: LoginResultLogined,
    PENDING: LoginResultPending,
    FAILED: LoginResultFailed
};

export type LoginResultsSucceed = typeof LoginResultLogined;
export type LoginResultsPending = typeof LoginResultPending;
export type LoginResultsFailed = typeof LoginResultFailed;
export type LoginResultTypes = LoginResultsSucceed | LoginResultsPending | LoginResultsFailed;

export const LoginResultsFailedNotFound = "User Not Found";
export const LoginResultFailedReasons = {
    NOT_FOUND: LoginResultsFailedNotFound
};
export type LoginResultsFailedNotFoundType = typeof LoginResultsFailedNotFound;

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
} | {
    result: LoginResultsFailed
    reason: LoginResultsFailedTypes | string
}

export type ServiceRegisterMailAPIResult = {
    result: APISuccess
} | {
    result: APIError
}

export type ServiceRegiserUserAPIResult = {
    result: APISuccess
} | {
    result: APIError,
    reason?: string
}