import axios from "axios";

const instance = axios.create({
    baseURL: `http://${process.env.REACT_APP_BACKEND_HOST}`,
    timeout: 1500
});

export default instance;