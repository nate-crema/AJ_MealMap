import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ASSET_HOST || "http://localhost:3001",
    withCredentials: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Access-Client-Version": process.env.REACT_APP_CLIENT_VERSION || "[INVALID_CLIENT]",
        "X-Access-From": process.env.REACT_APP_ACCESSPOINT_CONSTANT || "[INVALID_CLIENT]"
    },
    timeout: 5000
})