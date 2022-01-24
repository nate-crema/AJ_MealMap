import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// img
import shareIcon from "../../../../assets/img/Share@2x.png";
import calenderBackground from "../../../../assets/img/calender-background.png";

// css
import "../../../../css/mobile_comp/ManageMeeting.css";

function MeetingInvitation({ info, shareable, onShareStart, onShareEnd, onClick }) {
    
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
    };

    // swipe detection

    const [ eventList, setEL ] = useState({
        toUp: {},
        toDown: {},
        toLeft: {},
        toRight: {}
    });
    const [ swipe_start, setSS ] = useState([-100, -100]);

    const SWIPE_STD = 50;

    const _swipeStartHandler = (e) => {
        // let is_ignore = false;
        // e.nativeEvent.path.forEach(v => {
        //     for (var i = 0; i < v?.classList?.length || 0; i++) (v.classList[i] === "slider") && (is_ignore = true);
        // })
        // if (is_ignore) return setSS([-100, -100]);
        setSS([e.touches[0].clientX, e.touches[0].clientY]);
    }

    const _swipeOngoingHandler = (e) => {
        // console.log("end");
        // console.log();
        if (swipe_start[0] < 0 || swipe_start[1] < 0) {
            // console.log("ignored");
            return;
        }
        let mp = null;
        if (swipe_start[0] + SWIPE_STD - e.touches[0].clientX < 0) mp = "toRight";
        else if (swipe_start[0] - SWIPE_STD - e.touches[0].clientX > 0) mp = "toLeft";
        else if (swipe_start[1] + SWIPE_STD - e.touches[0].clientY < 0) mp = "toDown";
        else if (swipe_start[1] - SWIPE_STD - e.touches[0].clientY > 0) mp = "toUp";
        setSwipedPos(mp);
        // console.log(mp);
        
        // console.log(eventList[mp]);
        const t = new Date().getTime();
        
        if ( mp ) {
            // console.log("Swipe Detection");
            Object.values(eventList[mp]).forEach((fnc, i) => {
                try {
                    fnc(
                        (mp === "toRight") ? (e.touches[0].clientX - swipe_start[0]) :
                        (mp === "toLeft") ? (swipe_start[0] - e.touches[0].clientX) :
                        (mp === "toDown") ? (e.touches[0].clientY - swipe_start[1]) :
                        (mp === "toUp") ? (swipe_start[1] - e.touches[0].clientY) :
                        0
                    )
                } catch(e) {
                    console.log(`Event Listener: Error on ${i} | ${fnc.name}`);
                    console.error(e);
                }
            })
        }
        // else console.log("ignored");
    }

    const _swipeEvent = new function() {
        this.addEventListener = function(event, fnc) {
            const _new = eventList;
            _new[event][fnc.name || Object.values(eventList[event]).length] = fnc;
            setEL(_new);
            // console.log(_new);
        }
        this.removeEventListener = function(event, fnc) {
            const _new = eventList;
            delete _new[event][fnc.name];
            setEL(_new);
            // console.log(_new);
        }
        return this;
    }


    // swipe event registration

    useEffect(() => {
        _swipeEvent.addEventListener("toUp", _cardDesignHandler);
        _swipeEvent.addEventListener("toLeft", _cardDesignHandler);
        _swipeEvent.addEventListener("toRight", _cardDesignHandler);
        return () => {
            _swipeEvent.removeEventListener("toUp", _cardDesignHandler);
            _swipeEvent.removeEventListener("toLeft", _cardDesignHandler);
            _swipeEvent.removeEventListener("toRight", _cardDesignHandler);
        }
    }, [])


    // card sharing handler

    const [ bg_automize, setBGAutomize ] = useState(false);
    const [ sharing_bg, setSharingBg ] = useState(0);
    const [ maximum_bg, setMaxBg ] = useState(0);
    const [ swiped_pos, setSwipedPos ] = useState(null);
    const cardRef = useRef();

    const [ deviceorientationActive, setDeviceOrientationActive ] = useState(false);

    const _cardDesignHandler = useCallback((e) => {
        setSharingBg(e);
    }, [ shareable ])

    const _cardSwipingHandler = useCallback(() => {
        const swipe_percent = sharing_bg / maximum_bg;
        if ( swiped_pos == "toUp" ) {
            if (swipe_percent > 0.7) {
                // swiped
                setBGAutomize(true);
                setSharingBg(maximum_bg);
                startSwipeSharing();
                onShareStart();
                setTimeout(() => {
                    setSharingBg(0);
                    setTimeout(() => {
                        setBGAutomize(false);
                        onShareEnd();
                    }, 350);
                }, 1500);
            } else {
                // non-swiped
                setBGAutomize(true);
                setSharingBg(0);
                setTimeout(() => {
                    setBGAutomize(false);
                    onShareEnd();
                }, 350);
            }
        } else if ( swiped_pos in ["toLeft", "toRight"] ) {
            
        }
    }, [ sharing_bg, swiped_pos ])

    const startSwipeSharing = () => {
        setDeviceOrientationActive(true);
    }

    const orientationHandler = (e) => {
        console.log("detected: deviceorientation");
        // console.log(e);

        const {
            alpha, // ?????
            beta: device_front_tangent, // 기기 정면 기울기 (기기 y축 회전)
            gamma: device_side_tangent // 기기 측면 기울기 (기기 x축 회전)
        } = e;

        console.log( `tangented ${ device_front_tangent }deg to front, ${ device_side_tangent }deg to side)` )
    }
    
    useEffect(() => {
        // get Accelator value
        if (deviceorientationActive) window.addEventListener("deviceorientation", orientationHandler); 
        return () => {
            window.removeEventListener("deviceorientation", orientationHandler);
        }
    }, [ deviceorientationActive ])
    


    // card default actions handler

    const _clickHandler = (e) => {
        e.stopPropagation();
        if ( onClick ) onClick();
    }

    useEffect(() => {
        console.log(info);

        // calculate card height
        setMaxBg(cardRef.current.getBoundingClientRect().height * (90/85));
        
        // add card open animation
        cardRef.current.classList.add("on-open");

        setTimeout(() => {
            // remove card open animation
            cardRef.current.classList.remove("on-open");
        }, 300);
    }, [])

    return <div className={"meeting-invitation" + ( shareable ? " selected" : "" )}
        onTouchStart={_swipeStartHandler}
        onTouchMove={_swipeOngoingHandler}
        onTouchEnd={_cardSwipingHandler}
        onClick={_clickHandler}
        ref={cardRef}
        style={{
            transition: bg_automize ? "all .5s cubic-bezier(0.5, 1.9, 0.38, 0.7)" : null,
            marginTop: swiped_pos === "toUp" && `-${sharing_bg / 10}px`
        }}
    >
        <div className="share-text">
            <img src={ shareIcon }/>
            <span>{sharing_bg === 0 ? "카드를 밀어 공유" : "공유대상 확인중"}</span>
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
        <div className="sharing-swipe-background" style={{
            transition: bg_automize ? "all .35s ease" : "none",
            height: swiped_pos === "toUp" && `${sharing_bg}px`,
            opacity: sharing_bg / maximum_bg
        }}/>
    </div>
}

function ManageMeeting({ history }) {

    const { stat } = useSelector(state => state.map);
    const dispatch = useDispatch();

    const [ meetings, setMeetings ] = useState([]);
    const [ is_sharing_onprocess, setIsSharingOnprocess ] = useState(false);

    useEffect(() => {

        if (stat) {
            // set bottom_comp
            dispatch({ type: "mobile/SETCOMP", comp: { mode: "[sub].manage.meeting" } });
            
            // get meeting lsit
            setTimeout(() => {
                const meetings_result = [
                    {
                        _id: "test_meeting_1",
                        dId: "usr_meeting_a", // display id: 가변 약속 id; 요청시점에 따라 변경 & 단위시간마다 갱신
                        sess: "[abcdefg]", // dId와 sess를 통해 약속 특정이 가능해야 함
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
                    },
                    {
                        _id: "test_meeting_2",
                        dId: "usr_meeting_b",
                        sess: "[abcdefg]",
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
                ];
                setMeetings(meetings_result);
                if (meetings.length > 0) setSelected(meetings[0]._id);
            }, 300);
        }

    }, [ stat ])

    // invitation scrolling-select handle functions

    const lscrolled = useRef();
    const swipeRef = useRef();
    const auto_scroll = useRef(false);
    const [ selected, setSelected ] = useState(null);

    const _scrollHandler = ( e ) => {
        // setScrolling(true);

        // disable upscaled size
        setSelected(null);
        const timestamp = new Date().getTime();
        lscrolled.current = timestamp;
        return setTimeout(() => {
            _invitationSelector(timestamp, e) ;
        }, 100);
    }
    
    const _invitationSelector = ( timestamp, e ) => {
        // check is scroll action ends
        if ( lscrolled.current !== timestamp || auto_scroll.current ) return;

        // get scroll position
        const px_per_vw = window.innerWidth / 100;
        const selection_area_size = px_per_vw * ( 75 + 5 );
        let scroll_position = Math.round(e.target.scrollLeft/selection_area_size);
        // console.log(scroll_position, meetings);
        if ( meetings.length < (scroll_position + 1) ) scroll_position = meetings[meetings.length-1].value-1;
        // console.log(scroll_position, swipeRef.current.scrollLeft);
        console.log(`selected: ${meetings[scroll_position]._id}`);
        
        // update current selected state
        setSelected(meetings[scroll_position]._id);

        // adjust scroll position
        auto_scroll.current = true;
        swipeRef.current.scrollLeft = scroll_position * selection_area_size - 12;
        auto_scroll.current = false;
        
    }

    const setMeetingInfo = ( info ) => {
        // console.log(history, history.push, info);
        history.push(`/manage/meeting?meetingId=${ info.dId }`, info.sess);
    }
    

    // 아래로 내리기: 메뉴 나가기
    // 위로 올리기: 초대장 공유하기 (만료되지 않은 초대장일 경우) | 초대장 삭제하기 (만료된 초대장일 경우)
    // 좌우 스와이프: 초대장 넘기기
    // 터치: 초대장 내용 상세보기

    return <div className="meetingcard-list-handler" onClick={() => dispatch({ type: "mobile/SETCOMP", comp: { mode: null } })}>
        <div className="meeting-invitations-wrapper" ref={swipeRef} onScroll={_scrollHandler} style={{
            overflowX: ( is_sharing_onprocess ) ? "hidden" : "scroll"
        }}>
            <div className="meeting-invitations-scroller" style={{
                width: `calc( 95vw * ${ meetings.length })`
            }}>
                { meetings.map(v => <MeetingInvitation
                    key={ v._id }
                    info={ v } 
                    shareable={ v._id === selected }
                    onShareStart={ () => setIsSharingOnprocess(true) }
                    onShareEnd={ () => setIsSharingOnprocess(false) }
                    onClick={ () => setMeetingInfo(v) }
                />) }
            </div>
        </div>
    </div>;
}

export default ManageMeeting;