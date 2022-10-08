import axios from "@connection/request";

// interface

import { APIStatusList, StandardAPIResult } from "@interfaces/api";
import { LoginResultsFailedNotFound, ServiceLoginAPIResult, ServiceRegiserUserAPIResult, ServiceRegisterMailAPIResult } from "@interfaces/api/auth";
import { Location } from "@recoil/types";

export const APIResult: APIStatusList = {
    SUCCEED: "SUCCEED",
    FAILED: "FAILED"
}

export const STATUS = {
    ERR: {
        DVF: "Depart Validation Failed"
    }
}


export const serviceLogin = async ( email: string, name: string ): Promise<ServiceLoginAPIResult> => {
    try {
        console.log( email, name );
        const { data: result }: { data: StandardAPIResult<ServiceLoginAPIResult> } = await axios.post("/auth/login", { email, name });

        if ( result.status === 200 ) return result.data as ServiceLoginAPIResult;
        else if ( result.status === 404 ) throw new Error( LoginResultsFailedNotFound );
        else throw new Error("Internal Server Error");
    } catch( e: any ){
        console.error(e.message);
        return {
            result: "Failed",
            reason: e.message
        }
    }
}

export const serviceRegisteringMail = async ( location: Location | undefined ): Promise<ServiceRegisterMailAPIResult> => {
    try {
        const { data: result }: { data: StandardAPIResult<ServiceRegisterMailAPIResult> } = await axios.post("/auth/register/authorize", { location });

        if ( result.status === 200 ) return result.data as ServiceRegisterMailAPIResult;
        else if ( result.status === 400 ) throw new Error( result.error.reason );
        else if ( result.status === 404 ) throw new Error( LoginResultsFailedNotFound );
        else throw new Error("Internal Server Error");

    } catch( e: any ){
        console.error(e.message);
        return {
            result: APIResult.FAILED,
            // reason: e.message as string
        }
    }
}

export const serviceRegisterUser = async ( email: string, name: string, code: string ): Promise<ServiceRegiserUserAPIResult> => {
    try {
        const { data: result }: { data: StandardAPIResult<ServiceRegiserUserAPIResult> } = await axios.post("/auth/register", { email, name, code });

        if ( result.status === 200 ) return result.data as ServiceRegiserUserAPIResult;
        else throw new Error("Internal Server Error");
    } catch( e: any ){
        console.error(e.message);
        return {
            result: APIResult.FAILED,
            reason: e.message
        }
    }
}