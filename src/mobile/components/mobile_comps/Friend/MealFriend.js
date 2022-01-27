import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// api
import { meeting, service } from '../../../../apis';

// css
import "../../../../css/mobile_comp/Friend.css";
import "../../../../css/mobile_comp/Menu_common.css";

// img
import friend from "../../../../assets/img/friend.svg";
import friend_edit from "../../../../assets/img/friend_edit.svg";
import near from "../../../../assets/img/near.svg";
import person from "../../../../assets/img/person.svg";

// component
import MobileBtn from "../MobileBtn";
import TimePicker from '../../TimePicker';
import DateSelector from '../../../../components/DateSelector';
import FriendList from '../../../../components/FriendList';

function MealFriend({ swipeEvent, bottomCompHandler = () => {},
    swipe_state: [ swipe_active, setSwipeActive ],
    menuBack,
    history
}) {

    const { user: { uinfo }, mobile: { mealfriend: { list: mealfriend, meet_time } }, socket: { socket } } = useSelector(state => state);
    const dispatch = useDispatch();

    // DOM API references
    const mealFriendRef = useRef();

    // friend list states
    const [ friend_list, setFriendList ] = useState([]); // 친구목록
    const [ friend_list_loaded, setFriendListLoaded ] = useState(false); // 친구목록 로드여부
    const [ friend_list_receiving, setFriendListReceiving ] = useState(false); // 친구목록 실시간 수신 활성상태
    const [ selected, setSelected ] = useState([]); // 선택한 친구

    // security states
    const [ auth_requested, setAuthRequested ] = useState(false); // 보안메뉴 접근허가 요청여부
    const [ authId, setAuthId ] = useState(""); // 보안메뉴 세션id
    const [ authKey, setAuthKey ] = useState(""); // 보안메뉴 세션키
    
    // menu control
    const sizes = { // bcomp open size
        maximize: "600px",
        sub_maximize: "530px",
        oh_default: "470px",
        default: "400px",
        half_default: "250px",
        quarter_default: "150px",
        minimize: "110px"
    };
    const [ meeting_stat, setMeetingStat ] = useState(0); // 약속 생성메뉴 단계
    const [ msg, setMsg ] = useState("언제 만날까요?"); // 약속 생성 메세지
    const [ rand_color, setRC ] = useState([(Math.random()*1000), (Math.random()*1000), (Math.random()*1000)]); // 프로필 랜덤 색상
    
        // menu css control

        useEffect(() => {
            if ([ 1, 2, 3 ].includes(meeting_stat)) {
                swipeEvent.addEventListener("toRight", _movePrev);
                return () => {
                    swipeEvent.removeEventListener("toRight", _movePrev);
                }
            }
        }, [ meeting_stat ]);

    // menu control: 0

        // menu0: go to menu1 (select friend from list)
        const _openSelectList = () => {
            document.querySelector(".mealfriend").classList.toggle("sliding-r");
            mealFriendRef.current.classList.toggle("sliding-l");
            setSwipeActive(false);
            setTimeout(() => {
                setMeetingStat(1);
            }, 300);
        }

        // menu0: go to menu2 (select date)
        const _dateSelection = () => {
            document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-r"));
            document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-l"));
            mealFriendRef.current.classList.toggle("sliding-l");
            setSwipeActive(false);
            setTimeout(() => {
                setMeetingStat(2);
            }, 300);
        }

        // menu0: break meeting
        const _breakMeeting = () => {
            menuBack();
        }
    
    // menu control: 1

        // menu1: return to menu0
        const _movePrev = () => {
            // if (meeting_stat !== 1) return;
            setSwipeActive(true);
            setTimeout(() => {
                document.querySelectorAll(".add-user").forEach((v, i) => v.classList.toggle("sliding-r"));
                document.querySelectorAll(".add-user").forEach((v, i) => v.classList.toggle("sliding-l"));
                document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-r"));
                document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-l"));
                document.querySelectorAll(".time-selection").forEach((v, i) => v.classList.toggle("sliding-r"));
                document.querySelectorAll(".time-selection").forEach((v, i) => v.classList.toggle("sliding-l"));
                setTimeout(() => {
                    setMeetingStat( p => ( p === 2 ) ? 0 : ( p-1 ) );
                }, 200);
            }, 200);
        }

        // menu1: select handler
        useEffect(() => {
            dispatch({ type: "mobile/SETMFRIEND", friends: selected });
        }, [ selected ]);

    // menu control: 1

        // menu2: go to menu3 (select time)
        const _timeSelection = () => {
            document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-r"));
            document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-l"));
            document.querySelector(".dateselector-wrap").classList.toggle("sliding-l");
            setSwipeActive(false);
            setMsg("몇시에 만날까요?");
            setTimeout(() => {
                setMeetingStat(3);
            }, 300);
        }
    

    // socket authentication control
    const requestSocketActivation = async () => {
        const { sid, key, ov } = await service.activeMenu("mealfriend");
        socket.emit("menu/active", { sid, key, ov: uinfo[ov], access_point: "mealfriend" })
    }

    const responseSocketActivation = ( response ) => {
        const { result, reason, session } = response;
        if ( result ) {
            // console.log(session);
            setAuthId( session.key );
            setAuthKey( session.authToken );
        } else {
            console.error(reason);
        }
    }

    useEffect(() => {
        if (!auth_requested) {
            requestSocketActivation();
            setAuthRequested(true);
            socket.on("menu/active[res]", responseSocketActivation);
        }
    }, [ auth_requested ]);

    // send friend list request
    useEffect(() => {
        if ( !friend_list_loaded && authId && authKey ) {
            socket.emit("friend/getList", { authorize: { authId, authKey } });
            setFriendListReceiving(true);
        }
    }, [ authId, authKey ]);

    // get friend list updates
    const updateFriendList = ( response ) => {
        const { result, reason, data } = response;
        console.log( result, reason, data );
        if ( [ "closed", "failed" ].includes( result ) ) {
            setFriendListReceiving( false );
            dispatch({
                type: "mobile/SETALERT",
                alert_object: {
                    type: "selectable",
                    title: "실시간 친구목록을 불러올 수 없어요",
                    ment: "보안인증이 정상적으로 이루어지지 않아 실시간으로 친구목록을 불러올 수 없어요. 다시 시도하려면 앱을 다시 실행해주세요.",
                    style: {
                        alerter_height: "350px",
                        titleColor: "var(--theme-color-C)"
                    },
                    selection: [
                        { text: "확인", style: { color: "white", backgroundColor: "var(--theme-color-C)" }, focus: true, onClick: () => { window.location.reload() } },
                    ]
                }
            })
        }
        else if ( [ "updated", "created" ].includes( result ) ) {
            setFriendList( data );
            if ( result === "created" ) setFriendListLoaded( true );
        }
    }
    
    useEffect(() => {
        socket.on("friend/getList[res]", updateFriendList);
    }, []);
    
    


    // Create Meeting
    const isDateValid = useCallback(() => {
        // check is meeting date valid
        if ( new Date(`${ new Date().getFullYear() }-${ meet_time.month }-${ meet_time.day }`).getDate() !== meet_time.day ) {
            dispatch({ type: "mobile/SETALERT", alert_object: {
                type: "selectable",
                title: "올바르지 않은 날짜에요",
                ment: `'${ new Date().getFullYear() }년 ${ meet_time.month }월 ${ meet_time.day }일'은 존재하지 않는 날짜인 것 같아요. 올바른 날짜를 선택해주세요.`,
                style: {
                    alerter_height: "320px",
                    titleColor: "var(--theme-color-C)"
                },
                selection: [
                    { text: "다시선택", style: { color: "var(--theme-color-C)" }, focus: true, onClick: () => {
                        setMeetingStat(2);
                    } },
                ]
            } });
        } else _timeSelection();
    }, [ meet_time ]);

    const checkMeetingAvailable = useCallback(() => {
        // check is meeting day passed
        if ( 
            ( meet_time.month, meet_time.day, meet_time.hour, meet_time.ampm, meet_time.minute )
            &&
            new Date(`${ new Date().getFullYear() }-${ meet_time.month }-${ meet_time.day } ${ meet_time.hour + ( meet_time.ampm ? 12 : 0 ) }:${ meet_time.minute }:00`).getTime() < new Date().getTime() 
        ) 
            dispatch({ type: "mobile/SETALERT", alert_object: {
                type: "selectable",
                title: "약속날짜가 올해에는 지났어요",
                ment: "이미 지난 날짜로 약속을 설정하면 다음년도로 약속이 잡혀요. 계속 진행할까요?",
                style: {
                    alerter_height: "320px",
                    titleColor: "var(--theme-color-C)"
                },
                selection: [
                    { text: "다시선택", style: { color: "var(--theme-color-C)" }, focus: true, onClick: () => {} },
                    { text: "계속진행", style: { color: "white", backgroundColor: "var(--theme-color-C)" }, focus: true, onClick: () => {
                        createMeeting();
                        return true;
                    } },
                ]
            } });
        else createMeeting();

    }, [ meet_time ]);

    const createMeeting = useCallback( async () => {
        let meetTimeObj;
        if ( new Date(`${ new Date().getFullYear() }-${ meet_time.month }-${ meet_time.day }`).getTime() > new Date().getTime() ) meetTimeObj = new Date(`${ new Date().getFullYear()+1 }-${ meet_time.month }-${ meet_time.day } ${ meet_time.hour + ( ( meet_time.ampm - 1 ) ? 12 : 0 ) }:${ meet_time.minute }:00`);
        else meetTimeObj = new Date(`${ new Date().getFullYear() }-${ meet_time.month }-${ meet_time.day } ${ meet_time.hour + ( ( meet_time.ampm - 1 ) ? 12 : 0 ) }:${ meet_time.minute }:00`);

        const { result, reason, infos } = await meeting.createMeeting( mealfriend, meetTimeObj )

        if ( result ) {
            bottomCompHandler(sizes.default);
            setMeetingStat(4);
            setMsg("선택한 친구들에게 밥약속 요청을 보냈어요! ‘밥약속 관리’에서 참석여부를 확인하세요");
        } else {
            if ( reason === "Some user blocked invited participant" ) dispatch({ type: "mobile/SETALERT", alert_object: {
                type: "selectable",
                title: "약속을 만들지 못했어요",
                ment: "선택된 참여자들로 약속을 만들 수 없어요. 다시 시도해주세요.",
                style: {
                    alerter_height: "280px",
                    titleColor: "#aa2200"
                },
                selection: [
                    { text: "확인", style: { color: "black", backgroundColor: "white" }, focus: true, onClick: () => {} },
                ],
                onBackgroundClick: ( closeAlert ) => closeAlert() 
            } })
            else dispatch({ type: "mobile/SETALERT", alert_object: {
                type: "selectable",
                title: "약속을 만들지 못했어요",
                ment: "약속을 만들던 중 일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
                style: {
                    alerter_height: "280px",
                    titleColor: "#aa2200"
                },
                selection: [
                    { text: "확인", style: { color: "black", backgroundColor: "white" }, focus: true, onClick: () => {} },
                ],
                onBackgroundClick: ( closeAlert ) => closeAlert() 
            } })
        }
        console.log(result, infos);
        
    }, [ mealfriend, meet_time ] );

    return <>
        {
            (meeting_stat === 0) && <>
                <div className="mealfriend sliding-l" ref={ mealFriendRef }>
                    <div className="friends-list">
                        { (mealfriend.length > 0)
                        ? ( friend_list_loaded )
                            ? mealfriend.map((id, i) => {
                                
                                const uinfos = friend_list.find(v => v._id === id);
                                const { info: uinfo } = uinfos;

                                return <div className="friend-block" key={i}>
                                    <div className="profile-wrap" style={{
                                        backgroundColor: `rgba(${((rand_color[0]+(i/friend_list.length*10))%255)},${((rand_color[1]+(i/friend_list.length*10))%255)},${((rand_color[2]+(i/friend_list.length*10))%255)},${(i/friend_list.length)+0.1})`
                                    }}>
                                        <img src={uinfo.img || person}/>
                                    </div>
                                    <span className="user-name">{ uinfo.name }</span>
                                </div>
                            })
                            : <span className="non-selected">친구목록을 불러오고 있어요...</span>

                        : <span className="non-selected">아직 모은 사람이 없어요</span> }
                    </div>
                    <MobileBtn text="친구 추가" className="add-friend-btn" type="0" action={_openSelectList} style={{
                        width: (!(mealfriend.length > 0)) && "100%"
                    }}/>
                    { (mealfriend.length > 0) && <MobileBtn text="날짜 정하기" className="set-time-btn" type="0" action={ _dateSelection }/> }
                    <MobileBtn text="모임 취소" className="break-meeting-btn" type="1" action={_breakMeeting}/>
                </div>
            </>
        }
        {
            (meeting_stat === 1) && <>
                    <div className="select-list add-user sliding-l">
                        <FriendList
                            friend_list={ friend_list }
                            list_mode={ "selection" }
                            select_state={ [ selected, setSelected ] }
                        />
                    </div>
                    <MobileBtn text="추가 완료" className="add-friend-complete-btn add-user sliding-l" type="0" action={_movePrev}/>
            </>
        }
        {
            ( [ 2, 3, 4 ].includes( meeting_stat ) ) && <>
                <div className="time-selection sliding-l">
                    <span className="msg">{ msg }</span>
                    {/* <TimePicker className="meet-time-picker" bottomCompHandler={(mode_id) => bottomCompHandler(mode_id < 0 ? sizes.oh_default : sizes.maximize)}/> */}
                    {
                        ( meeting_stat === 2 ) ? <>
                            <div className="dateselector-wrap">
                                <DateSelector
                                    className="meet-time-picker"
                                    inputValue={[ "date" ]}
                                    button={false}
                                    onValueSucceed={ ( { month, day } ) => dispatch({ type: "mobile/SETMTIME", month, day }) }
                                    displayKO={true}
                                    init={{
                                        month: new Date().getMonth()+1,
                                        day: new Date().getDate(),
                                    }}
                                    init_assign={true}
                                />
                            </div>
                            <MobileBtn text="시간 선택" className="send-noti-btn sliding-l" type="0" action={ isDateValid }/>
                        </> :
                        ( meeting_stat === 3 ) ? <>
                            <div className="timeselector-wrap">
                                <DateSelector
                                    className="meet-time-picker"
                                    inputValue={[ "am/pm", "time" ]}
                                    button={false}
                                    onValueSucceed={ ( { hour, minute, ampm } ) => dispatch({ type: "mobile/SETMTIME", hour, minute, ampm }) }
                                    displayKO={true}
                                    init={{
                                        hour: ( ( Math.floor(new Date().getMinutes() / 10) + 1 ) === 6 ) ? ( ( new Date().getHours() % 12 ) || 12 ) + 1 : ( new Date().getHours() % 12 ) || 12,
                                        minute: ( ( Math.floor(new Date().getMinutes() / 10) + 1 ) % 6 ) * 10,
                                        ampm: ( Math.floor( new Date().getHours() / 12 ) > 0 ) ? 2 : 1
                                    }}
                                    init_assign={true}
                                />
                            </div>
                            <MobileBtn text="알림 발송" className="send-noti-btn sliding-l" type="0" action={ checkMeetingAvailable }/>
                        </> :
                        ( meeting_stat === 4 ) ? <>
                            <MobileBtn text="밥약속 관리" className="send-noti-btn add-user sliding-l" type="0" action={ () => history.push("/manage/meeting") }/>
                        </> : <></>
                    }
                </div>
            </>
        }
    </>;
}

export default MealFriend;