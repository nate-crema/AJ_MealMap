import axios from "@connection/request";

// interface

import { APIStatusList, StandardAPIResult } from "@interfaces/api";
import { ServiceLoginAPIResult } from "@src/interfaces/api/auth";

export const APIResult: APIStatusList = {
    SUCCEED: "SUCCEED",
    FAILED: "FAILED"
}


export const serviceLogin = async ( email: string, name: string ): Promise<ServiceLoginAPIResult> => {
    try {
        console.log( email, name );
        const { data: result }: { data: StandardAPIResult<ServiceLoginAPIResult> } = await axios.post("/auth/login", { email, name });

        if ( result.status === 200 ) return result.data as ServiceLoginAPIResult;
        else throw new Error("Internal Server Error");
    } catch( e: any ){
        console.error(e.message);
        return {
            result: "Failed",
            userinfo: null,
            expires: null
        }
    }
}