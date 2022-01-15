import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// img
import shareIcon from "../../../../assets/img/Share@2x.png";
import calenderBackground from "../../../../assets/img/calender-background.png";

// css
import "../../../../css/mobile_comp/ManageMeeting.css";

function MeetingInvitation({ info }) {
    
    const meeting_created = {
        year: info.date.getFullYear(),
        month: info.date.getMonth()+1,
        date: info.date.getDate(),
        hour: info.date.getHours(),
        minute: info.date.getMinutes(),
        second: info.date.getSeconds(),
    }, meeting_time = {
        year: info.meet_time.getFullYear(),
        month: info.meet_time.getMonth()+1,
        date: info.meet_time.getDate(),
        hour: info.meet_time.getHours(),
        minute: info.meet_time.getMinutes(),
        second: info.meet_time.getSeconds(),
    }, filterImgList = {
        "[_id]": ""
    }

    useEffect(() => console.log(info), []);

    return <div className="meeting-invitation">
        <div className="share-text">
            <img src={ shareIcon }/>
            <span>카드를 밀어 공유</span>
        </div>
        <div className="meeting-content">
            <p className="meeting-title">{ meeting_created.month }월 { meeting_created.date }일에 초대된 약속</p>
            <p className="meeting-organizer">{ info.organizer.name }님이 초대한 약속</p>
            <div className="meeting-info">
                <span className='cat'>약속에 포함된 사람</span>
                <span>주최자 외 { info.participants.length }명</span>
                <span className='cat'>약속시간</span>
                <span>
                    {`${ meeting_time.year }년 ${ meeting_time.month }월 ${ meeting_time.date }일
                    ${ meeting_time.hour > 12 ? "오후" : meeting_time.hour < 12 ? "오전" : "낮" }
                    ${ meeting_time.hour }시 ${ meeting_time.minute < 10 ? ('0' + meeting_time.minute) : meeting_time.minute }분`}
                </span>
                <span className='cat'>수락상태</span>
                <span>{ info.participants.filter(v => v.confirmed === 1).length+1 } / { info.participants.length+1 }</span>
            </div>
        </div>
        <img className="background-style-img" src={ calenderBackground }/>
    </div>
}

function ManageMeeting({ props }) {

    const dispatch = useDispatch();

    const [ meetings, setMeetings ] = useState([]);

    useEffect(() => {
        // set bottom_comp
        dispatch({ type: "mobile/SETCOMP", comp: { mode: "[sub].manage.meeting" } });
        
        // get meeting lsit
        setTimeout(() => {
            setMeetings([
                {
                    date: new Date(), // 기록시간
                    organizer: {
                        name: "ㅁㅁㅁ",
                        pn: "01012345678",
                        email: "testuser@ajoumeal.com",
                        role: 2, // 0: admin | 2: user
                        college: "첨단소프트웨어대학",
                        major: "사이버보안학과",
                        img: { type: String },
                    }, // 주최자
                    meet_time: new Date("2022-02-01"), // 약속시간
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
                                img: { type: String },
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
                                img: { type: String },
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
                                img: { type: String },
                            },
                            confirmed: 2
                        }
                    ],
                    filter: [ // 적용 필터
                        {
                            filterInfo: {
                                _id: "fid_0",
                                name: "갑각류"
                            },
                            assign_count: 1,
                            auth: true
                        },
                        {
                            filterInfo: {
                                _id: "fid_1",
                                name: "우유"
                            },
                            assign_count: 3,
                            auth: true
                        }
                    ],
                    request: []
                }
            ])
        }, 300);
    }, [])

    // 아래로 내리기: 메뉴 나가기
    // 위로 올리기: 초대장 공유하기 (만료되지 않은 초대장일 경우) | 초대장 삭제하기 (만료된 초대장일 경우)
    // 좌우 스와이프: 초대장 넘기기
    // 터치: 초대장 내용 상세보기
    // 
    return <div className="meetingcard-list-handler">
        <div className="meeting-invitations-wrapper">
            { meetings.map(v => <MeetingInvitation info={ v } />) }
        </div>
    </div>;
}

export default ManageMeeting;