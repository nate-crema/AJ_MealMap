import axios from "../connection/requester";

const getReviews = async (id) => {
    try {
        const { data: review_list } = await axios.get(`/review/shop/${id}`);
        return review_list;
    } catch(e) {
        console.error(e);
    }
}

export default {
    getReviews
}