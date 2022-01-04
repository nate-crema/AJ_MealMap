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

const findShopByLocation = async (lat, long, range) => {
    try {
        const { data: shop_list } = await axios.get(`/shop/coords/${lat}, ${long}?range=${range || 10}`);
        return shop_list.list;
    } catch(e) {
        console.error(e);
    }
}

const findShopById = async (id) => {
    try {
        const { data: shop_list } = await axios.get(`/shop/${id}`);
        return shop_list;
    } catch(e) {
        console.error(e);
    }
}

export default {
    getShopList,
    findShopList,
    findShopByLocation,
    findShopById
}