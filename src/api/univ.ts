import axios from "@connection/request";

// interface

import { APIStatusList, StandardAPIResult } from "@interfaces/api";
import { DepartedUserInfo, UnivMajorSelectionListAPIResult, UserDepartAPIResult } from "@src/interfaces/api/univ";

export const APIResult: APIStatusList = {
    SUCCEED: "SUCCEED",
    FAILED: "FAILED"
}


export const getUnivMajorSelectionList = async ( mode: "college" | "department", college?: number | undefined ): Promise<UnivMajorSelectionListAPIResult> => {
    try {
        const { data: result }: { data: StandardAPIResult<UnivMajorSelectionListAPIResult> } = await axios.get(`/univ/list/${ mode }${ ( college !== undefined && college !== null ) ? `/${ college }` : '' }`);

        if ( result.status === 200 ) return result.data as UnivMajorSelectionListAPIResult;
        else throw new Error("Internal Server Error");

    } catch( e: any ){
        console.error(e.message);
        return {
            result: APIResult.FAILED,
            reason: e.message
        }
    }
}

export const checkUserDepart = async ( college: number, department: number ): Promise<UserDepartAPIResult> => {
    try {
        const { data: result }: { data: StandardAPIResult<UserDepartAPIResult> } = await axios.post(`/univ/auth/student`, { college, department } );

        if ( result.status === 200 ) return result.data as UserDepartAPIResult;
        else throw new Error( result.error.reason || "Internal Server Error" );

    } catch( e: any ){
        console.error(e.message);
        return {
            result: APIResult.FAILED,
            reason: e.message
        }
    }
}