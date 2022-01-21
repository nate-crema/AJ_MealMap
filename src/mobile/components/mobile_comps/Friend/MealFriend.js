import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// api
import { service } from '../../../../apis';

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

function MealFriend({ swipeEvent, bottomCompHandler = () => {},
    swipe_state: [ swipe_active, setSwipeActive ],
    menuBack
}) {

    const { user: { uinfo }, mobile: { mealfriend, meet_time }, socket: { socket } } = useSelector(state => state);
    const dispatch = useDispatch();

    // DOM API references
    const mealFriendRef = useRef();

    // friend list states
    const [ friend_list, setFriendList ] = useState([]); // 친구목록
    const [ friend_list_loaded, setFriendListLoaded ] = useState(false); // 친구목록 로드여부

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
    const [ msg, setMsg ] = useState("몇시에 만날까요?"); // 약속 생성 메세지
    const [ rand_color, setRC ] = useState([(Math.random()*1000), (Math.random()*1000), (Math.random()*1000)]); // 프로필 랜덤 색상
    
        // menu css control

        useEffect(() => {
            if (meeting_stat === 1) {
                swipeEvent.addEventListener("toRight", _movePrev);
                return () => {
                    swipeEvent.removeEventListener("toRight", _movePrev);
                }
            }
        }, [ meeting_stat ]);

        // menu control: 0

        // menu0: go to menu1 (select friend from list)
        const _openSelectList = () => {
            // document.querySelector(".mealfriend").classList.toggle("sliding-r");
            mealFriendRef.current.classList.toggle("sliding-l");
            setSwipeActive(false);
            setTimeout(() => {
                setMeetingStat(1);
            }, 300);
        }

        // menu0: go to menu2 (select time)
        const _timeSelection = () => {
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

        // menu1: return to menu0
        const _movePrev = () => {
            // if (meeting_stat !== 1) return;
            setSwipeActive(true);
            document.querySelectorAll(".add-user").forEach((v, i) => v.classList.toggle("sliding-r"));
            document.querySelectorAll(".add-user").forEach((v, i) => v.classList.toggle("sliding-l"));
            setTimeout(() => {
                setMeetingStat(0);
            }, 300);
        }

        // menu1: select handler
        const _selectHandler = (id) => {
            const i = mealfriend.list.indexOf(id);
            if (i === -1) dispatch({ type: "mobile/SETMFRIEND", friends: [ ...mealfriend.list, id ] });
            else {
                mealfriend.list.splice(i, 1);
                dispatch({ type: "mobile/SETMFRIEND", friends: mealfriend.list });
            }
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

    // test
    useEffect(() => {
        setTimeout(() => {
            // setMenu(true);
            setFriendList([
                {
                    _id: "uid_0",
                    info: {
                        name: "방재훈",
                        pn: "01012345678",
                        college: "정보통신대학",
                        major: "국방디지털융합학과",
                        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_1",
                    info: {
                        name: "박상현",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_2",
                    info: {
                        name: "김건모",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_3",
                    info: {
                        name: "길멃",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_4",
                    info: {
                        name: "Ritta Siruang",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_5",
                    info: {
                        name: "ㄱㄱㄱ",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_6",
                    info: {
                        name: "ㄱㄱㄱ",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                }
            ])
            setFriendListLoaded(true);
            // setTimeout(() => {
            //     setMenu(false);
            // }, 1000);
        }, 1000);
    }, []);

    return <>
        {
            (meeting_stat === 0) && <>
                <div className="mealfriend" ref={ mealFriendRef }>
                    <div className="friends-list">
                        { (mealfriend.list.length > 0)
                        ? ( friend_list_loaded )
                            ? mealfriend.list.map((id, i) => {
                                
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
                        width: (!(mealfriend.list.length > 0)) && "100%"
                    }}/>
                    { (mealfriend.list.length > 0) && <MobileBtn text="시간 정하기" className="set-time-btn" type="0" action={_timeSelection}/> }
                    <MobileBtn text="모임 취소" className="break-meeting-btn" type="1" action={_breakMeeting}/>
                </div>
            </>
        }
        {
            (meeting_stat === 1) && <>
                    <div className="select-list add-user sliding-l">
                        { friend_list.map(({ _id, info: uinfo }, i) => 
                            <div className="userlist-block" key={_id} onClick={() => _selectHandler(_id)}>
                                <div className="profile-wrap" style={{
                                    backgroundColor: `rgba(${((rand_color[0]+(i/friend_list.length*10))%255)},${((rand_color[1]+(i/friend_list.length*10))%255)},${((rand_color[2]+(i/friend_list.length*10))%255)},${(i/friend_list.length)+0.1})`
                                }}>
                                    <img src={uinfo.img || person}/>
                                </div>
                                <span className="user-name">{ uinfo.name }</span>
                                <div className="major-info">
                                    <p className="user-subschool">{ uinfo.college.length > 6 ? uinfo.college.substr(0, 5) + "..." : uinfo.college }</p>
                                    <p className="user-major">{ uinfo.major.length > 6 ? uinfo.major.substr(0, 5) + "..." : uinfo.major }</p>
                                </div>
                                <div className="checkbox" style={{
                                    backgroundColor: mealfriend.list.includes(_id) && "var(--theme-color-C)"
                                }}></div>
                            </div>
                        ) }
                    </div>
                    <MobileBtn text="추가 완료" className="add-friend-complete-btn add-user sliding-l" type="0" action={_movePrev}/>
            </>
        }
        {
            (meeting_stat === 2) && <>
                <div className="time-selection sliding-l">
                    <span className="msg">{ msg }</span>
                    <TimePicker className="meet-time-picker" bottomCompHandler={(mode_id) => bottomCompHandler(mode_id < 0 ? sizes.oh_default : sizes.maximize)}/>
                    <MobileBtn text="알림 발송" className="send-noti-btn sliding-l" type="0"/>
                </div>
            </>
        }
    </>;
}

export default MealFriend;