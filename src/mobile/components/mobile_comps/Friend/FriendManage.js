import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// api
import { service, user } from '../../../../apis';

// css
import "../../../../css/mobile_comp/FriendManage.css";

// component
import FriendList from '../../../../components/FriendList';

function FriendManage({ 
    /* eslint-disable-next-line */
    swipe_state: [ swipe_active, setSwipeActive ] // swipe action 활성화여부
}) {

    const { user: { uinfo }, socket: { socket } } = useSelector(state => state);
    const dispatch = useDispatch();

    const [ friend_list, setFriendList ] = useState( uinfo?.friend || [] ); // 친구목록
    const [ friend_category, setFriendCategory ] = useState( {} ); // 친구분류 (검색속도 향상을 위한 단과대/학과별 전처리)
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
    const [ optionAnimationActive, setOptionAnimationActive ] = useState(false);


    // option control
    const [ openOption, setOpenOption ] = useState(false);
    
    const setMenu = ( state ) => {
        if ( state ) {
            setOptionAnimationActive(true);
            setListMode("selection");
            setTimeout(() => {
                setOpenOption(true);
            }, 300);
        } else {
            setOptionAnimationActive(false);
            setListMode("search");
            setTimeout(() => {
                setOpenOption(false);
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

    
    // friend-option handler
    const addtoMealFriend = ( friends ) => {
        dispatch({ type: "mobile/ADDMFRIEND", friends })
    }

    const setLocationShareState = ( friends ) => {

        const displayConfirm = () => {
            try {

                if ( !authId || !authKey ) throw new Error("Socket Authentication Not Confirmed");

                dispatch({ type: "mobile/SETALERT", alert_object: {
                    type: "selectable",
                    title: "설정 완료!",
                    ment: `위치공유 설정을 정상적으로 적용했어요! 지금부터 설정이 친구들 목록에 바로 반영돼요.`,
                    style: {
                        alerter_height: "300px",
                        titleColor: "var(--theme-color-C)"
                    },
                    selection: [
                        { text: "확인", style: { color: "white", backgroundColor: "var(--theme-color-C)" }, focus: true, onClick: () => {} },
                    ],
                    onBackgroundClick: ( close_session ) => close_session()
                } })
            } catch(e) {
                console.error(e);      
                dispatch({ type: "mobile/SETALERT", alert_object: {
                    type: "selectable",
                    title: "설정 실패",
                    ment: `위치공유 설정을 적용하던 중 오류가 발생했어요. 잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의하세요`,
                    style: {
                        alerter_height: "300px",
                        titleColor: "#aa2200"
                    },
                    selection: [
                        { text: "확인", style: { color: "black" }, focus: true, onClick: () => {} },
                    ],
                    onBackgroundClick: ( close_session ) => close_session()
                } })
            }

            // set default action disable
            return false;
        }

        dispatch({ type: "mobile/SETALERT", alert_object: {
            type: "selectable",
            title: "위치공유를 어떻게 설정할까요?",
            ment: `이 설정은 선택된 ${ friends.length }명의 친구들에게 모두 공통적으로 적용돼요.`,
            style: {
                alerter_height: "280px",
                titleColor: "var(--theme-color-C)"
            },
            selection: [
                { text: "공유 허용", style: { color: "white", backgroundColor: "var(--theme-color-C)" }, focus: true, onClick: displayConfirm },
                { text: "공유 차단", style: { color: "var(--theme-color-C)" }, focus: true, onClick: displayConfirm },
            ],
            onBackgroundClick: ( close_session ) => close_session()
        } })
    }

    const setFriendBlock = ( friends ) => {
        const displayConfirm = () => {
            try {

                if ( !authId || !authKey ) throw new Error("Socket Authentication Not Confirmed");

                dispatch({ type: "mobile/SETALERT", alert_object: {
                    type: "selectable",
                    title: "차단 완료",
                    ment: `선택된 친구${ friends.length > 1 ? "들이 모두" : "가" } 차단되었어요. 이 설정은 즉시 적용돼요.`,
                    style: {
                        alerter_height: "280px",
                        titleColor: "var(--theme-color-C)"
                    },
                    selection: [
                        { text: "확인", style: { color: "white", backgroundColor: "var(--theme-color-C)" }, focus: true, onClick: () => {} },
                    ],
                    onBackgroundClick: ( close_session ) => close_session()
                } })
            } catch(e) {
                console.error(e);      
                dispatch({ type: "mobile/SETALERT", alert_object: {
                    type: "selectable",
                    title: "설정 실패",
                    ment: `차단설정을 적용하던 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.`,
                    style: {
                        alerter_height: "300px",
                        titleColor: "#aa2200"
                    },
                    selection: [
                        { text: "확인", style: { color: "black" }, focus: true, onClick: () => {} },
                    ],
                    onBackgroundClick: ( close_session ) => close_session()
                } })
            }

            // set default action disable
            return false;
        }

        dispatch({ type: "mobile/SETALERT", alert_object: {
            type: "selectable",
            title: `선택한 ${ friends.length }명의 친구${ friends.length > 1 ? "들을" : "를" } 차단할까요?`,
            ment: `한번 차단한 친구는 해제할 수 없고, 친구관련 모든 서비스를 이용할 수 없어요. 신중히 선택해주세요.`,
            style: {
                alerter_height: "350px",
                titleColor: "#aa2200"
            },
            selection: [
                { text: "취소", style: { color: "black" }, focus: true, onClick: () => {} },
                { text: "차단", style: { color: "white", backgroundColor: "#aa2200" }, focus: true, onClick: displayConfirm },
            ],
            onBackgroundClick: ( close_session ) => close_session()
        } })
    }

    const removeFriend = ( friends ) => {
        const displayConfirm = () => {
            try {

                if ( !authId || !authKey ) throw new Error("Socket Authentication Not Confirmed");

                dispatch({ type: "mobile/SETALERT", alert_object: {
                    type: "selectable",
                    title: "삭제 완료",
                    ment: `선택된 친구${ friends.length > 1 ? "들이 모두" : "가" } 삭제되었어요. 이 설정은 즉시 적용돼요.`,
                    style: {
                        alerter_height: "280px",
                        titleColor: "var(--theme-color-C)"
                    },
                    selection: [
                        { text: "확인", style: { color: "white", backgroundColor: "var(--theme-color-C)" }, focus: true, onClick: () => {} },
                    ],
                    onBackgroundClick: ( close_session ) => close_session()
                } })
            } catch(e) {
                console.error(e);      
                dispatch({ type: "mobile/SETALERT", alert_object: {
                    type: "selectable",
                    title: "설정 실패",
                    ment: `친구를 삭제하던 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.`,
                    style: {
                        alerter_height: "300px",
                        titleColor: "#aa2200"
                    },
                    selection: [
                        { text: "확인", style: { color: "black" }, focus: true, onClick: () => {} },
                    ],
                    onBackgroundClick: ( close_session ) => close_session()
                } })
            }

            // set default action disable
            return false;
        }

        dispatch({ type: "mobile/SETALERT", alert_object: {
            type: "selectable",
            title: `선택한 ${ friends.length }명의 친구${ friends.length > 1 ? "들을" : "를" } 삭제할까요?`,
            ment: `삭제한 친구${ friends.length > 1 ? "들은" : "는" } 회원님 목록에서만 사라져요. 단, 삭제한 친구${ friends.length > 1 ? "들" : "" }의 '주변친구' 목록에는 표시되지 않아요.`,
            style: {
                alerter_height: "350px",
                titleColor: "#aa2200"
            },
            selection: [
                { text: "취소", style: { color: "black" }, focus: true, onClick: () => {} },
                { text: "삭제", style: { color: "white", backgroundColor: "#aa2200" }, focus: true, onClick: displayConfirm },
            ],
            onBackgroundClick: ( close_session ) => close_session()
        } })
    }


    // search functions handler
    const autoComplete = (keyword, friend_category) => {
        let calc_result = { type: "?", selected: [] };
        ["department", "major", "name"].forEach( filter => {
            let result = false;
            Object.keys(friend_category[filter]).forEach(v => (v.includes(keyword) && (result = v)));
            if (result) calc_result = { type: filter, selected: friend_category[filter][result] };
        } )
        return calc_result;
    }

    useEffect(() => { // update search result by using input text
        
        if (search_keyword.length > 0) {
            let search_result;
        
            const keywords = search_keyword.split("/");
            keywords.forEach( kw => { 
                const res = autoComplete( kw, friend_category );
                if (res) search_result = res;
            } ); 
            setFriendListDisplay( search_result.selected );

        } else setFriendListDisplay( friend_list );
        
    }, [ search_keyword, friend_list, friend_category ]);
    
    useEffect(() => {
        // update latest user list
        setFriendListDisplay(friend_list);

        // seach pre-processing
        const cat = { department: {}, major: {}, name: {} };
        friend_list.forEach(friend => {
            const { _id, info: { name, college, major } } = friend;
            if ( cat.department[ college ] ) cat.department[ college ].push( friend );
            else cat.department[ college ] = [ friend ];

            if ( cat.major[ major ] ) cat.major[ major ].push( friend );
            else cat.major[ major ] = [ friend ];

            if ( cat.name[ name ] ) cat.name[ name ].push( friend );
            else cat.name[ name ] = [ friend ];
        });
        setFriendCategory(cat);

    }, [ friend_list ]);


    // swipe state control
    
    const _swipeStateHandler = (e) => {
        if ( e.currentTarget.scrollTop === 0 ) setSwipeActive(true);
        else setSwipeActive(false);
    }

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


    return <div className="friend-manage">
        { openOption ? <>
            <div className={ "friend-option" + ( optionAnimationActive ? " menu-open" : " menu-close" ) }>
                <span className="menutext menu-function text-addto-meeting" onClick={ () => addtoMealFriend( selected ) }>밥친구에 추가</span>
                <span className="menutext menu-function text-addto-loc-sharing" onClick={ () => setLocationShareState( selected ) }>위치공유</span>
                <span className=""></span>
                <span className="menutext menu-block text-block" onClick={ () => setFriendBlock( selected ) }>차단</span>
                <span className="menutext menu-erase text-delete" onClick={ () => removeFriend( selected ) }>삭제</span>
            </div>
        </> : <>
            <div className={ "friend-search" + ( !optionAnimationActive ? " menu-open" : " menu-close" ) }>
                <span className="placeholder" style={{
                    opacity: placeholder_display ? "1" : "0"
                }}>단과대, 학과, 이름 검색 (구분: '/')</span>
                <input type="text"
                    value={ search_keyword }
                    onChange={(e) => setSearchKeyword( e.target.value )}
                    onFocus={() => setPlaceholderDisplay(false)}
                    onBlur={() => (search_keyword.length === 0 && setPlaceholderDisplay(true))}
                />
            </div>
        </> }
        <FriendList style={{
                height: openOption ? `calc(100% - 50px)` : `calc(100% - 60px)`
            }} onTouchStart={ _swipeStateHandler }
            friend_list={ friend_list_display }
            list_mode={ list_mode }
            select_state={ [ selected, setSelected ] }
        />
    </div>;
}

export default FriendManage;