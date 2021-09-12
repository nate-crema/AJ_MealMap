import axios from "axios";

const instance = axios.create({
    baseURL: `http://${process.env.REACT_APP_BACKEND_HOST || "localhost:3001"}`,
    timeout: 5000
});

export default instance;