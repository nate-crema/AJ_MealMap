import axios from "../connection/requester";

const getReviews = async (id) => {
    try {
        const { data: review_list } = await axios.get(`/review/shop/${id}`);
        return review_list;
    } catch(e) {
        console.error(e);
    }
}

const getQuestions = async (id) => {
    try {
        const { data: question_list } = await axios.get(`/review/questions?shopId=${id}`);
        return question_list;
    } catch(e) {
        
    }
}

export default {
    getReviews,
    getQuestions
}