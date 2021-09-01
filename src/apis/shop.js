import axios from "../connection/requester";

const getShopList = async () => {
    try {
        const { data: shop_list } = await axios.get(`/shop/list`);
        return shop_list.list;
    } catch(e) {
        console.error(e);
    }
}

const regShopPref = async ( name, point, loc, extra ) => {
    try {
        console.log(name, point, loc, extra);
        const { data: reg_res } = await axios.post(`/review/register/quick`, {
            name,
            cat: 0,
            point,
            loc,
            register: "611a304652a9dd4557880e06"
        })
        console.log(reg_res);
        return reg_res;

    } catch(e) {
        console.error(e);
    }
}

export default {
    getShopList,
    regShopPref
}