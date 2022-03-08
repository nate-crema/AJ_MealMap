import axios from "@connection/request";

// interface

import { APIStatusList, StandardAPIResult } from "@interfaces/api";
import { LoginResultsFailedNotFound, ServiceCodeValidChkAPIResult, ServiceLoginAPIResult, ServiceRegisterAPIResult } from "@src/interfaces/api/auth";
import { Location } from "@interfaces/recoil/State";

export const APIResult: APIStatusList = {
    SUCCEED: "SUCCEED",
    FAILED: "FAILED"
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

export const serviceRegister = async ( location: Location | undefined ) => {
    try {
        const { data: result }: { data: StandardAPIResult<ServiceRegisterAPIResult> } = await axios.post("/auth/register/authorize", { location });

        if ( result.status === 200 ) return result.data as ServiceRegisterAPIResult;
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

export const serviceCodeValidChk = async ( code: string ) => {
    try {
        const { data: result }: { data: StandardAPIResult<ServiceCodeValidChkAPIResult> } = await axios.post("/auth/register/codeValid", { code });

        if ( result.status === 200 ) return result.data as ServiceCodeValidChkAPIResult;
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