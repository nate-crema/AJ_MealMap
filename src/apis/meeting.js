import axios from "../connection/requester";

const getInfo = async ( dId, state ) => {
    try {
        // const { result: review_list } = await axios.post(`/meeting/isValid`, {
        //     dId,
        //     state
        // });
        // return review_list;
        return {
            date: new Date("2022-1-1 18:20:00"), // 기록시간
            organizer: {
                name: "ㅁㅁㅁ",
                pn: "01012345678",
                email: "testuser@ajoumeal.com",
                role: 2, // 0: admin | 2: user
                college: "첨단소프트웨어대학",
                major: "사이버보안학과",
                img: { type: String },
            }, // 주최자
            meet_time: new Date("2022-02-01 10:20:00"), // 약속시간
            participants: [ // 참가인원
                {
                    user: {
                        _id: "7548320ncjsonvosme",
                        name: "ㄱㄱㄱ",
                        pn: "01012345678",
                        email: "testuser@ajoumeal.com",
                        role: 2, // 0: admin | 2: user
                        college: "첨단소프트웨어대학",
                        major: "사이버보안학과",
                        img: null,
                    },
                    confirmed: 0
                },
                {
                    user: {
                        _id: "7548320ncjsonvosmc",
                        name: "ㄴㄴㄴ",
                        pn: "01012345678",
                        email: "testuser@ajoumeal.com",
                        role: 2, // 0: admin | 2: user
                        college: "첨단소프트웨어대학",
                        major: "사이버보안학과",
                        img: null,
                    },
                    confirmed: 1
                },
                {
                    user: {
                        _id: "7548320ncjsonvosmq",
                        name: "ㄷㄷㄷ",
                        pn: "01012345678",
                        email: "testuser@ajoumeal.com",
                        role: 2, // 0: admin | 2: user
                        college: "첨단소프트웨어대학",
                        major: "사이버보안학과",
                        img: null,
                    },
                    confirmed: 2
                }
            ],
            filter: [ // 적용 필터
                {
                    cat: "alergic",
                    filterInfo: {
                        _id: "fid_0",
                        type: "crap",
                        name: "갑각류"
                    },
                    assign_count: 1, // 해당 필터 사용자 수
                    disable_count: 0, // 필터해제 동의 사용자 수
                    auth: true
                },
                {
                    cat: "alergic",
                    filterInfo: {
                        _id: "fid_1",
                        type: "milk",
                        name: "우유"
                    },
                    assign_count: 3,
                    disable_count: 0,
                    auth: false
                },
                {
                    cat: "alergic",
                    filterInfo: {
                        _id: "fid_3",
                        type: "bread",
                        name: "빵류"
                    },
                    assign_count: 2,
                    disable_count: 0,
                    auth: true
                },
                {
                    cat: "alergic",
                    filterInfo: {
                        _id: "fid_4",
                        type: "peanut",
                        name: "견과류"
                    },
                    assign_count: 2,
                    disable_count: 1,
                    auth: true
                },
            ],
            request: []
        };
    } catch(e) {
        console.error(e);
    }
}

const getParticipantLimit = async ( timestamp ) => {
    try {
        // const { limit } = await axios.get(`/meeting/participant_limit?timestamp=${ timestamp }`);
        // return limit;
        return 4;
    } catch (e) {
        console.error(e);
    }
}

const createMeeting = async ( participants, meet_time ) => {
    try {
        const result = await axios.post(`/meeting`, {
            participants,
            meet_time
        });
        return result.data;
    } catch (e) {
        console.error(e);
    }
}

const registerRequest = async ( meeting_id, type, value_object ) => {
    return true;
}

export default {
    getInfo,
    getParticipantLimit,
    createMeeting,
    registerRequest
}