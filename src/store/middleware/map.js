import axios from "axios"

const getList = store => next => async action => {
    if (action.type == "map/LOADLIST") {
        const host = 'http://' + process.env.REACT_APP_DB_HOST.split(":")[0] + ":3001" || `http://localhost:3001`
        const res = await axios.get(`${host}/api/shopList`);
        console.log(res);
        action.list = res.data.list;
        console.log(action);
        return next(action);
    } else return next(action);
}

export default getList;