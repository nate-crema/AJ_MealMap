import axios from "../connection/requester";

const getNotification = async () => {
    try {
        const { data: shop_list } = await axios.get(`/notice/recent`);
        return shop_list;
    } catch(e) {
        console.error(e);
    }
}

export default {
    getNotification
}