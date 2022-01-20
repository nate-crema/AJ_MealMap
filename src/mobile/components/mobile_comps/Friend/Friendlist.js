import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// api
import { service } from '../../../../apis';

// css
import "../../../../css/mobile_comp/FriendList.css";

function FriendBlock({ profile: { info, connected, start }, mode, delay, onClick, checked }) {
    
    useEffect(() => {
        console.log(info);
    }, [])

    return <div className="friend-block" style={{
        animationDelay: delay
    }} onClick={ onClick }>
        <div className="profile-img" style={{
            backgroundImage: `url(${ info?.img || "" })`
        }}></div>
        <span className="user-name">{ ( info.name.split(" ")[0].length > 3 ? info.name.split(" ")[0].substr(0, 2) + "..." : info.name.split(" ")[0] ) }</span>
        <div className="department">
            <span className="college" style={{
                opacity: ( mode === "selection" ) ? "0" : "1"
            }}>{ ( info.college.length > 6 ? info.college.substr(0, 5) + "..." : info.college ) }</span>
            <span className="major" style={{
                top: ( mode === "selection" ) && "50%",
                transform: ( mode === "selection" ) && "translateY(-50%)",
                bottom: ( mode === "selection" ) && "unset"
            }}>{ 
                ( mode === "selection" ) ? 
                ( info.major.length > 3 ? info.major.substr(0, 2) + "..." : info.major )
                :
                ( info.major.length > 6 ? info.major.substr(0, 5) + "..." : info.major )
            }</span>
        </div>
        <div className={ "checkbox" + ( checked ? " check" : " uncheck" )} style={{
                opacity: ( mode === "selection" ) ? "1" : "0"
            }}>
            <svg viewBox="0 0 19.867 20.275"  className={( checked ? " check" : " uncheck" )}>
                <path id="Path_223" data-name="Path 223" d="M267.611,562.049l6.253,10.312,10.867-17.9" transform="translate(-266.238 -553.087)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
            </svg>
        </div>
    </div>
}

function Friendlist({  }) {

    const { user: { uinfo }, socket: { socket } } = useSelector(state => state);
    const [ friend_list, setFriendList ] = useState( uinfo?.friend || [] ); // 친구목록
    const [ friend_list_display, setFriendListDisplay ] = useState( [] ); // 표시되는 친구목록
    const [ selected, setSelected ] = useState([]);
    const [ list_mode, setListMode ] = useState("search");

    // searcher states
    const [ search_keyword, setSearchKeyword ] = useState(""); // 입력된 검색어
    const [ placeholder_display, setPlaceholderDisplay ] = useState(true); // placeholder 표시여부

    // security states
    const [ auth_requested, setAuthRequested ] = useState(false); // 보안메뉴 접근허가 요청여부
    const [ authId, setAuthId ] = useState(""); // 보안메뉴 세션id
    const [ authKey, setAuthKey ] = useState(""); // 보안메뉴 세션키


    // animation control
    const [  menuAnimationActive, setMenuAnimationActive ] = useState(false);


    // menu control
    const [ openMenu, setOpenMenu ] = useState(false);
    
    const setMenu = ( state ) => {
        if ( state ) {
            setMenuAnimationActive(true);
            setListMode("selection");
            setTimeout(() => {
                setOpenMenu(true);
            }, 300);
        } else {
            setMenuAnimationActive(false);
            setListMode("search");
            setTimeout(() => {
                setOpenMenu(false);
            }, 300);
        }
    }

    useEffect(() => {
        if ( selected.length > 0 ) {setMenu(true);}
        else {setMenu(false);}
    }, [ selected ]);


    // socket authentication control
    const requestSocketActivation = async () => {
        const { sid, key, ov } = await service.activeMenu("friendList");
        socket.emit("menu/active", { sid, key, ov: uinfo[ov], access_point: "friendList" })
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

    // friend-block click handler
    const _friendBlockClickHandler = (id) => {
        setSelected(p => {
            let arr = [ ...p ];
            const idx = arr.indexOf(id);
            if (idx === -1) {
                arr.push(id);
                return arr;
            } else {
                arr.splice(idx, 1);
                return arr;
            }
        })
    }

    // search functions handler
    

    useEffect(() => {
        setFriendListDisplay(friend_list);
    }, [ friend_list ]);

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
            // setTimeout(() => {
            //     setMenu(false);
            // }, 1000);
        }, 1000);
    }, []);


    return <div className="friend-list">
        { openMenu ? <>
            <div className={ "friend-menu" + ( menuAnimationActive ? " menu-open" : " menu-close" ) }>
                <span className="menutext menu-function text-addto-meeting">밥친구에 추가</span>
                <span className="menutext menu-function text-addto-loc-sharing">위치공유</span>
                <span className=""></span>
                <span className="menutext menu-block text-block">차단</span>
                <span className="menutext menu-erase text-delete">삭제</span>
            </div>
        </> : <>
            <div className={ "friend-search" + ( !menuAnimationActive ? " menu-open" : " menu-close" ) }>
                <span className="placeholder" style={{
                    opacity: placeholder_display ? "1" : "0"
                }}>학과나 이름, '학과/이름'으로 검색</span>
                <input type="text"
                    value={ search_keyword }
                    onChange={(e) => setSearchKeyword( e.target.value )}
                    onFocus={() => setPlaceholderDisplay(false)}
                    onBlur={() => (search_keyword.length === 0 && setPlaceholderDisplay(true))}
                />
            </div>
        </> }
        <div className="friend-blocks" style={{
            height: openMenu ? `calc(100% - 50px)` : `calc(100% - 60px)`
        }}>
            { friend_list_display.map( ( friend, i ) => 
                <FriendBlock
                    profile={ friend }
                    delay={ `${ i * 0.01 }s` }
                    onClick={ () => _friendBlockClickHandler(friend._id) }
                    mode={ list_mode }
                    checked={ selected.includes( friend._id ) }
                />
            ) }
        </div>
    </div>;
}

export default Friendlist;