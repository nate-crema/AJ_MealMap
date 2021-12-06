import axios from "../connection/requester";
import crypto from "crypto";

const isRegistered = async ( pn ) => {
    try {
        const { data } = await axios.get(`/user/isexist/${pn}`);
        return data;
    } catch(e) {
        if (e?.response?.data == "Authorization Not Ended") return "ANE";
        else if (e?.response?.data == "Invalid Phone Number Format") return "NPN";
        else if (e?.response?.status == 404) return false;
        else console.error(e);
    }
}

const register = async ( name, pn, email ) => {
    try {
        const { data: server_res } = await axios.post(`/user/register`, {
            name,
            pn,
            email
        });
        return server_res;
    } catch(e) {
        if (e?.response?.data == "Already Exist User") return "AEU";
        else if (e?.response?.data == "Invalid Email Type or Format") return "NEMAIL";
        else {
            console.log(e?.response?.data);
            console.error(e);
            return "ERROR";
        }
        // console.log(e?.response?.data == "Already Exist User");
    }
}

const login = async ( pn, pin, _key ) => {
    try {
        // console.log("_key", _key);
        console.log(pn, pin, _key);
        const key = `${_key}${_key}${_key}${_key}${_key}`.substr(0, 32);
        const iv = `${_key}${_key}${_key}${_key}${_key}`.substr(0, 16);
        // console.log(iv, key);

        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let pin_enc = cipher.update(pin, 'utf8', 'base64');
        pin_enc += cipher.final('base64');

        cipher = null;
        cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let pn_enc = cipher.update(pn, 'utf8', 'base64');
        pn_enc += cipher.final('base64');

        const { data: server_res } = await axios.post(`/user/login`, { pn: pn_enc, pin: pin_enc });
        return server_res;
    } catch(e) {
        if (e?.response?.data == "User Not Found") return "UNF";
        else if (e?.response?.data == "Invalid Phone Number Format") return "NPN";
        else if (e?.response?.data == "Invalid PIN") return "NPIN";
        else {
            console.log(e?.response?.data);
            console.error(e);
            return "ERROR";
        }
        // console.log(e?.response?.data == "Already Exist User");
    }
}

const authorize = async ( authorize_code, pin ) => {
    try {
        const key = `${authorize_code}${authorize_code}`.substr(0, 32);
        const iv = `${authorize_code}${authorize_code}`.substr(0, 16);
        // console.log(iv, key);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let pin_enc = cipher.update(pin, 'utf8', 'base64');
        pin_enc += cipher.final('base64');
        const { data } = await axios.post(`/mail_auth`, {
            authorize: authorize_code,
            pin_enc
        });
        return data;
    } catch(e) {
        console.error(e);
        return false;
    }
}

const isValidAuthRoute = async ( authorize_code ) => {
    try {
        const { data } = await axios.get(`/mail_auth/${authorize_code}`);
        return data;
    } catch(e) {
        return false;
    }
}

const isValidAuthToken = async () => {
    try {
        const { data } = await axios.post(`/user/token/isValid`, {});
        return data;
    } catch(e) {
        console.error(e?.response?.data || e);
        throw e;
    }
}

export default {
    isRegistered,
    register,
    login,
    authorize,
    isValidAuthRoute,
    isValidAuthToken,
    RESPONSE: {
        ANE: "ANE",
        NPN: "NPN",
        UNF: "UNF",
        NPIN: "NPIN"
    }
}
