import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/Friend.css";
import "../../../css/mobile_comp/Menu_common.css";

// img
import friend from "../../../assets/img/friend.svg";
import friend_edit from "../../../assets/img/friend_edit.svg";
import near from "../../../assets/img/near.svg";
import person from "../../../assets/img/person.svg";

// menu component
import MealFriend from './Friend/MealFriend';
import FriendManage from './Friend/FriendManage';

function Friend({ swipeEvent, bottomCompHandler = () => {} }) {

    const { mealfriend, meet_time } = useSelector(state => state.mobile);
    const dispatch = useDispatch();

    const [ is_open, setIsOpen ] = useState(true);
    const [ is_maximize, setIsMaximize ] = useState(false);
    const [ progressing_stat, setPS ] = useState(false);
    const [ swipe_active, setSwipeActive ] = useState(true);

    const titleImgRef = useRef(<></>);
    const titleRef = useRef(<></>);

    // swipe events

    const sizes = {
        maximize: "600px",
        sub_maximize: "530px",
        oh_default: "470px",
        default: "400px",
        half_default: "250px",
        quarter_default: "150px",
        minimize: "110px"
    }

    const _swipeUpHandler = (direct_mode) => setIsOpen(prev => {
        setPS(ps => {
            if (ps || direct_mode === "max") {
                // maximize menu
                bottomCompHandler(sizes.maximize);
                setIsMaximize(true);
            } else if (!prev || direct_mode === "default") {
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
            console.log(`ps`, ps);
            if (ps || direct_mode === "min") {
                // minimize menu
                bottomCompHandler(sizes.minimize);
                setIsOpen(false);
                return ps;
            } else if (!ps && (!prev || direct_mode === "close")) {
                // close menu
                dispatch({ type: "mobile/SETCOMP", comp: { mode: null } });
                return false;
            } else if (prev || direct_mode === "default") {
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
        if (swipe_active) {
            swipeEvent.addEventListener("toUp", _swipeUpHandler);
            swipeEvent.addEventListener("toDown", _swipeDownHandler);
        }
        return () => {
            swipeEvent.removeEventListener("toUp", _swipeUpHandler);
            swipeEvent.removeEventListener("toDown", _swipeDownHandler);
        }
    }, [ swipe_active ]);

    // menu control

    const [ menu_title, setMT ] = useState("친구");

    // menu auto-continuation
    useEffect(() => {
        // const watchID = navigator.geolocation.watchPosition((cb) => {
        //         console.log(`-----------------------`);
        //         console.log("accuracy", cb.coords.accuracy);
        //         console.log("altitude", cb.coords.altitude);
        //         console.log("altitudeAccuracy", cb.coords.altitudeAccuracy);
        //         console.log("heading", cb.coords.heading);
        //         console.log("latitude", cb.coords.latitude);
        //         console.log("longitude", cb.coords.longitude);
        //         console.log("speed", cb.coords.speed);
        //   }, null, { enableHighAccuracy: true });
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
            switch(menu_id) {
                case 2:
                    bottomCompHandler(sizes.sub_maximize);
                    break;

                case 1.7:
                    // bottomCompHandler(sizes.default);
                    break;
                case 1:
                default:
                    _swipeUpHandler("max");
                    break;
            }
        } else  {
            titleRef.current.style.left = null;
        }
    }

    const menus = [
        { img: friend, title: "밥친구 모으기", onClick: () => setMenu(1)},
        { img: near, title: "주변친구", onClick: () => setMenu(2)},
        { img: friend_edit, title: "친구관리", onClick: () => setMenu(3)}
    ]

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
            ( progressing_stat === 1 ) && <>
                <MealFriend 
                    swipeEvent={ swipeEvent }
                    bottomCompHandler={ bottomCompHandler }
                    swipe_state={ [ swipe_active, setSwipeActive ] }
                    menuBack={() => {
                        dispatch({ type: "mobile/SETMFRIEND", friends: [] });
                        setMenu(false);
                        titleImgRef.current.src = "";
                        setMT("친구");
                        _swipeUpHandler("default");
                    }}
                />
            </>
        }

        {
            (progressing_stat === 2) && <>
                <span className="nearfriend">아직은 지원하지 않아요 ㅠㅠ<br/>아쉽지만 곧 만나요!</span>
            </>
        }

        {
            (progressing_stat === 3) && <>
                <FriendManage swipe_state={ [ swipe_active, setSwipeActive ] }/>
            </>
        }
    </div>;
}

export default Friend;