import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_BACKEND_HOST || "http://localhost:3001",
    timeout: 5000
})