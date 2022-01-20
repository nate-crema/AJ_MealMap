import axios from "../connection/requester";

const getNotification = async () => {
    try {
        const { data: shop_list } = await axios.get(`/notice/recent`);
        return shop_list;
    } catch(e) {
        console.error(e);
    }
}

const activeMenu = async ( menu ) => {
    try {
        const { data: res } = await axios.post(`/service/access`, {
            menu,
            // trackid: // active when build
        })
        return res;
    } catch(e) {
        console.error(e);
    }
}

export default {
    getNotification,
    activeMenu
}