import axios from "../connection/requester";

const getShopList = async () => {
    try {
        const { data: shop_list } = await axios.get(`/shop/list`);
        return shop_list.list;
    } catch(e) {
        console.error(e);
    }
}

const findShopList = async (keyword) => {
    try {
        const { data: shop_list } = await axios.get(`/shop/find?query=${encodeURI(keyword)}`);
        return shop_list.list;
    } catch(e) {
        console.error(e);
    }
}

const regShopPref = async ( name, point, loc, extra ) => {
    try {
        console.log(name, point, loc, extra);
        const token = window.localStorage.getItem('linfo');
        if (!token) throw new Error("");
        const { data: reg_res } = await axios.post(`/review/register/quick`, {
            name,
            cat: 0,
            point,
            loc
        }, { headers: {
            "x-access-meal-jwt": token
        } })
        console.log(reg_res);
        return reg_res;

    } catch(e) {
        console.error(e);
    }
}

export default {
    getShopList,
    findShopList,
    regShopPref
}