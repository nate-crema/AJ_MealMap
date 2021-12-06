import { Cookies } from "react-cookie";

const cookie = new Cookies();

export const setCookie = async ( name, value, option ) => {
    try {
        await cookie.set( name, value, {
            // httpOnly: option?.httpOnly || true,
            secure: option?.secure || true,
            // domain: option?.domain
        } );
        const robj = JSON.parse(JSON.stringify(option));
        robj[name] = value;
        robj.succeed = true;
        return robj;
    } catch(e) {
        throw e;
    }
}

export const getCookie = ( name ) => {
    console.log(`Load Cookie: ${name}`, cookie.get(name), cookie);
    return cookie.get(name);
}