import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_BACKEND_HOST || "http://localhost:3001",
    withCredentials: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Access-Client-Version": process.env.REACT_APP_CLIENT_VERSION,
        "X-Access-From": process.env.REACT_APP_ACCESSPOINT_CONSTANT
    },
    timeout: 5000
})