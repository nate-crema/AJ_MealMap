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
        const { data: question_info } = await axios.get(`/review/questions?shopId=${id}`);
        return {
            result: true,
            data: question_info
        }
    } catch(e) {
        if (e?.message === "User's shop review already registered in 24-hour") return {
            result: false,
            reason: "UAR", // User Already Reviewed
            data: null
        }
        console.error(e);
    }
}

const saveAnswer = async ( reviewId, questionId, answer ) => {
    try {
        const { data: answer_result } = await axios.post(`/review`, {
            reviewId,
            questionId,
            answer
        });
        return answer_result;
    } catch(e) {
        console.error(e);
    }
}

const endReview = async ( reviewId ) => {
    try {
        const { data: review_stateinfo } = await axios.post(`/review/close`, {
            reviewId
        });
        return {
            result: true,
            data: review_stateinfo
        };
    } catch(e) {
        console.error(e);
    }
}

export default {
    getReviews,
    getQuestions,
    saveAnswer,
    endReview
}