import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../css/mobile_comp/Friend.css";
import "../../css/mobile_comp/Menu_common.css";

// img
import friend from "../../assets/img/friend.svg";
import friend_edit from "../../assets/img/friend_edit.svg";
import near from "../../assets/img/near.svg";
import person from "../../assets/img/person.svg";

// component
import MobileBtn from "./MobileBtn";
import TimePicker from '../TimePicker';

function Friend({ swipeEvent, bottomCompHandler = () => {} }) {

    const { mealfriend, meet_time } = useSelector(state => state.mobile);
    const dispatch = useDispatch();

    const [ is_open, setIsOpen ] = useState(true);
    const [ is_maximize, setIsMaximize ] = useState(false);
    const [ progressing_stat, setPS ] = useState(false);

    const titleImgRef = useRef(<></>);
    const titleRef = useRef(<></>);

    // swipe events

    const sizes = {
        maximize: "10%",
        default: "40%",
        minimize: "75%"
    }

    const _swipeUpHandler = (direct_mode) => setIsOpen(prev => {
        setPS(ps => {
            if (ps || direct_mode == "max" || ps) {
                // maximize menu
                bottomCompHandler(sizes.maximize);
                setIsMaximize(true);
            } else if (!prev || direct_mode == "default") {
                // defaultize menu
                bottomCompHandler(sizes.default);
                setIsMaximize(false);
            }
            return ps;
        })
        return true;
    })
    
    const _swipeDownHandler = (direct_mode) => setIsMaximize(prev => {
        setPS(ps => {
            if (ps || direct_mode == "min") {
                // minimize menu
                bottomCompHandler(sizes.minimize);
                setIsOpen(false);
                return true;
            } else if (!ps && (!prev || direct_mode == "close")) {
                // close menu
                dispatch({ type: "mobile/SETCOMP", comp: null });
                return false;
            } else if (prev || direct_mode == "default") {
                // defaultize menu
                bottomCompHandler(sizes.default);
                setIsOpen(true);
            } 
            return ps;
        })
        return false;
    })
    

    // swipe events: registration
    useEffect(() => {
        swipeEvent.addEventListener("toUp", _swipeUpHandler);
        swipeEvent.addEventListener("toDown", _swipeDownHandler);

        return () => {
            swipeEvent.removeEventListener("toUp", _swipeUpHandler);
            swipeEvent.removeEventListener("toDown", _swipeDownHandler);
        }
    }, []);

    // menu control

    const [ menu_title, setMT ] = useState("친구");
    const [ msg, setMsg ] = useState("몇시에 만날까요?");
    const [ rand_color, setRC ] = useState([(Math.random()*1000), (Math.random()*1000), (Math.random()*1000)]);

    // menu auto-continuation
    useEffect(() => {
        const watchID = navigator.geolocation.watchPosition((cb) => {
                console.log(`-----------------------`);
                console.log("accuracy", cb.coords.accuracy);
                console.log("altitude", cb.coords.altitude);
                console.log("altitudeAccuracy", cb.coords.altitudeAccuracy);
                console.log("heading", cb.coords.heading);
                console.log("latitude", cb.coords.latitude);
                console.log("longitude", cb.coords.longitude);
                console.log("speed", cb.coords.speed);
          }, null, { enableHighAccuracy: true });
        if (mealfriend.list.length > 0) {
            setMenu(1);
        }
    }, []);

    const setMenu = (menu_id) => {
        setPS(menu_id);
        if (menu_id !== false) {
            titleRef.current.style.left = "50px";
            titleImgRef.current.src = menus[Math.floor(menu_id-1)].img;
            setMT(menus[Math.floor(menu_id-1)].title);
            _swipeUpHandler("max");
        } else  {
            titleRef.current.style.left = null;
        }

        if (menu_id === 1.5) {
            swipeEvent.addEventListener("toRight", _movePrev);
            return () => {
                swipeEvent.removeEventListener("toRight", _movePrev);
            }
        }
    }

    const menus = [
        { img: friend, title: "밥친구 모으기", onClick: () => setMenu(1)},
        { img: near, title: "주변친구", onClick: () => setMenu(2)},
        { img: friend_edit, title: "친구관리", onClick: () => setMenu(3)}
    ]

    // menu1: go to menu1.5 (select friend from list)
    const _openSelectList = () => {
        // document.querySelector(".mealfriend").classList.toggle("sliding-r");
        document.querySelector(".mealfriend").classList.toggle("sliding-l");
        swipeEvent.removeEventListener("toUp", _swipeUpHandler);
        swipeEvent.removeEventListener("toDown", _swipeDownHandler);
        setTimeout(() => {
            setMenu(1.5);
        }, 300);
    }

    // menu1: go to menu1.7 (select time)
    const _timeSelection = () => {
        document.querySelector(".mealfriend").classList.toggle("sliding-l");
        swipeEvent.removeEventListener("toUp", _swipeUpHandler);
        swipeEvent.removeEventListener("toDown", _swipeDownHandler);
        setTimeout(() => {
            setMenu(1.7);
        }, 300);
    }

    // menu1: break meeting
    const _breakMeeting = () => {
        dispatch({ type: "mobile/SETMFRIEND", friends: [] });
        setMenu(false);
        titleImgRef.current.src = "";
        setMT("친구");
        _swipeUpHandler("default");
    }

    // menu1.5: return to menu1
    const _movePrev = () => {
        if (progressing_stat !== 1.5) return;
        swipeEvent.addEventListener("toUp", _swipeUpHandler);
        swipeEvent.addEventListener("toDown", _swipeDownHandler);
        document.querySelectorAll(".add-user").forEach((v, i) => v.classList.toggle("sliding-r"));
        document.querySelectorAll(".add-user").forEach((v, i) => v.classList.toggle("sliding-l"));
        setTimeout(() => {
            setMenu(1);
            // document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-r"));
            // document.querySelectorAll(".mealfriend").forEach((v, i) => v.classList.toggle("sliding-l"));
        }, 300);
    }

    // menu1.5: select handler
    const _selectHandler = (id) => {
        const i = mealfriend.list.indexOf(id);
        if (i === -1) dispatch({ type: "mobile/SETMFRIEND", friends: [ ...mealfriend.list, id ] });
        else {
            mealfriend.list.splice(i, 1);
            dispatch({ type: "mobile/SETMFRIEND", friends: mealfriend.list });
        }
    }

    // test information
    const userinfo = {
        friend: [
            {
                _id: "1",
                name: "김아주",
                subschool: "정보통신대학",
                major: "전자과",
                img: null
            },
            {
                _id: "2",
                name: "이아주",
                subschool: "인문대학",
                major: "경제학과",
                img: null
            },
            {
                _id: "3",
                name: "박아주",
                subschool: "공과대학",
                major: "물리학과",
                img: null
            },
            {
                _id: "4",
                name: "국아주",
                subschool: "융합디지털보안대학",
                major: "사이버보안학과",
                img: null
            },
            {
                _id: "5",
                name: "윤아주",
                subschool: "정보통신대학",
                major: "소프트웨어학과",
                img: null
            },
        ]
    }

    return <div className="friend-menu">
        <div className="title-area">
            <img ref={titleImgRef}/>
            <span className="menu_title" ref={titleRef}>{ menu_title }</span>
        </div>
        {
            !progressing_stat && <div className="menu-blocks">
                { menus.map((v, i) => <div className="menu-block" key={i} onClick={v.onClick}>
                    <img src={v.img}/>
                    <span>{ v.title.split(" ").length > 1 ? v.title.split(" ")[0] + "..." : v.title }</span>
                </div>) }
            </div>
        }
        {
            (progressing_stat == 1) && <>
                <div className="mealfriend">
                    <div className="friends-list">
                        { (mealfriend.list.length > 0) ? mealfriend.list.map((id, i) => {
                            
                            const uinfo = userinfo.friend.find(v => v._id === id);

                            return <div className="friend-block" key={i}>
                                <div className="profile-wrap" style={{
                                    backgroundColor: `rgba(${((rand_color[0]+(i/userinfo.friend.length*10))%255)},${((rand_color[1]+(i/userinfo.friend.length*10))%255)},${((rand_color[2]+(i/userinfo.friend.length*10))%255)},${(i/userinfo.friend.length)+0.1})`
                                }}>
                                    <img src={uinfo.img || person}/>
                                </div>
                                <span className="user-name">{ uinfo.name }</span>
                            </div>
                        }) : <span className="non-selected">아직 모은 사람이 없어요</span> }
                    </div>
                    <MobileBtn text="친구 추가" className="add-friend-btn" type="0" action={_openSelectList} style={{
                        width: (!(mealfriend.list.length > 0)) && "100%"
                    }}/>
                    { (mealfriend.list.length > 0) && <MobileBtn text="시간 정하기" className="send-noti-btn" type="0" action={_timeSelection}/> }
                    <MobileBtn text="모임 취소" className="break-meeting-btn" type="1" action={_breakMeeting}/>
                </div>
            </>
        }
        {
            (progressing_stat == 1.5) && <>
                    <div className="select-list add-user sliding-l">
                        { userinfo.friend.map((uinfo, i) => 
                        <div className="userlist-block" key={uinfo._id} onClick={() => _selectHandler(uinfo._id)}>
                            <div className="profile-wrap" style={{
                                backgroundColor: `rgba(${((rand_color[0]+(i/userinfo.friend.length*10))%255)},${((rand_color[1]+(i/userinfo.friend.length*10))%255)},${((rand_color[2]+(i/userinfo.friend.length*10))%255)},${(i/userinfo.friend.length)+0.1})`
                            }}>
                                <img src={uinfo.img || person}/>
                            </div>
                            <span className="user-name">{ uinfo.name }</span>
                            <div className="major-info">
                                <p className="user-subschool">{ uinfo.subschool.length > 6 ? uinfo.subschool.substr(0, 5) + "..." : uinfo.subschool }</p>
                                <p className="user-major">{ uinfo.major.length > 6 ? uinfo.major.substr(0, 5) + "..." : uinfo.major }</p>
                            </div>
                            <div className="checkbox" style={{
                                backgroundColor: mealfriend.list.includes(uinfo._id) && "var(--theme-color-C)"
                            }}></div>
                        </div>
                        ) }
                    </div>
                    <MobileBtn text="추가 완료" className="add-friend-complete-btn add-user sliding-l" type="0" action={_movePrev}/>
            </>
        }
        {
            (progressing_stat == 1.7) && <>
                <div className="time-selection sliding-l">
                    <span className="msg">{ msg }</span>
                    <TimePicker className="meet-time-picker"/>
                </div>
            </>
        }
    </div>;
}

export default Friend;