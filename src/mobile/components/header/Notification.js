import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/Notification.css";

// api
import { service } from "../../../apis/index";

function NotificationInnerBtn({ style, children, onClick }) {
    return <div className="noti-inner-btn"
        style={{ ...style }}
        onClick={ onClick || (() => {}) }
    >
        <span>{ children }</span>
    </div>;
}

function NotificationBlock({ 
    content, 
    blockOpenState: [ isOpen, setIsOpen ],
    deleteNotification
}) {

    const dispatch = useDispatch();

    // notification open state
    const isOpenRef = useRef();

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [ isOpen ]);

    // long touch control
    const isOnTouch = useRef(false);
    const [ isOnTouchState, setIsOnTouchState ] = useState(false);
    
    useEffect(() => {
        isOnTouch.current = isOnTouchState;
    }, [ isOnTouchState ]);

    const _touchStartHandler = (e) => {
        if ( isOpen ) return;
        setIsOnTouchState(true);
        setTimeout(() => {
            _afterTouchStartHandler(e);
        }, 750);
    }

    const _touchEndHandler = (e) => {
        setIsOnTouchState(false);
    }

    const _afterTouchStartHandler = (e) => {
        if ( !isOnTouch.current ) return;
        setIsOpen(true);
    }


    // notification block disable control
    const [ disable, setDisable ] = useState(false);

    const closeNotification = ( delay ) => {
        setIsOpen(false);
        setTimeout(() => {
            setDisable(true);
            deleteNotification();
        }, delay === false ? 0 : 200);
    }


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
    const [ swiped_pos, setSwipedPos ] = useState(null);
    const swiped_pos_ref = useRef(null);
    const [ swiped_degree, setSwipeDegree ] = useState(0);

    useEffect(() => {
        if ( !isOpen ) {
            _swipeEvent.addEventListener("toLeft", _notiBtnDisplayHandler);
            _swipeEvent.addEventListener("toRight", _notiBtnDisplayHandler);
        }
        return () => {
            _swipeEvent.removeEventListener("toLeft", _notiBtnDisplayHandler);
            _swipeEvent.removeEventListener("toRight", _notiBtnDisplayHandler);
        }
    }, [ isOpen ])

    useEffect(() => {
        swiped_pos_ref.current = swiped_pos;
        if ( swiped_pos ) setIsOnTouchState( false );
    }, [ swiped_pos ]);


    // notification button display control

    const _notiBtnDisplayHandler = (e, isEndHandler) => {
        console.log(swiped_pos_ref.current, e);

        if ( isOpenRef.current ) return;
        if ( isEndHandler ) {
            if ( swiped_pos_ref.current === "toLeft" && e/2 > 120 ) {
                closeNotification(false);
                setSwipeDegree(450);
            }
            else if ( swiped_pos_ref.current === "toLeft" && e/2 > 40 ) setSwipeDegree(100);
            else setSwipeDegree(0);
        } else {
            if ( swiped_pos_ref.current === "toLeft" && e/2 > 120 ) setSwipeDegree(300);
            else if ( swiped_pos_ref.current === "toLeft" && e/2 > 40 ) setSwipeDegree( 100 + ( ( e - 80 ) / 2 ) );
            else if ( swiped_pos_ref.current === "toRight" && e/2 > 40 ) setSwipeDegree(0);
            else setSwipeDegree(e/2);
        }
    }

    const _swipeEndHandler = useCallback((e) => {
        _notiBtnDisplayHandler(swiped_degree, true);
    }, [ swiped_degree ]);

    
    // notification buttons control

    const _notiDeleteBtnHandler = (e) => {
        dispatch({ type: "mobile/SETALERT", alert_object: {
            type: "selectable",
            title: "공지를 메인화면에서 지울까요?",
            ment: `지워진 공지는 전체메뉴의 '공지'에서 언제든지 다시볼 수 있어요. (다음부터 바로 지우고 싶다면 왼쪽으로 끝까지 밀어주세요!)`,
            style: {
                alerter_height: "330px",
                titleColor: "#aa2200",
                mentColor: "black",
            },
            selection: [
                { text: "취소", style: { color: "black", backgroundColor: "white" }, focus: true, onClick: () => {} },
                { text: "확인", style: { color: "#aa2200", backgroundColor: "white" }, focus: true, onClick: () => closeNotification(false) },
            ],
            onBackgroundClick: ( close_session ) => close_session()
        } })
    }


    return <div className="uni-noti-wrap" style={{
        height: isOpen ? "70vh" : disable ? "0" : null
    }}
        onTouchStart={ _swipeStartHandler }
        onTouchMove={ _swipeOngoingHandler }
        onTouchEnd={ _swipeEndHandler }
    >
        <div className={ "noti-block service_noti"  + (( isOnTouchState ) ? " onTouching" : "") }
            onTouchStart={ _touchStartHandler }
            onTouchEnd={ _touchEndHandler }
            onContextMenu={(e) => e.preventDefault()}
            style={{
                width: isOpen && "99%",
                height: isOpen && "99%",
                left: `calc( 50% - ${ Math.floor(swiped_degree) }px )`
            }}
        >
            <div className="inner-content" style={{
                top: isOpen && "20px",
                transform: isOpen && "translate(-50%)",
            }}>
                <svg version="1.1" id="Layer_1" x="0px" y="0px"
                    viewBox="0 0 500 500" style={{
                        enableBackground: "new 0 0 500 500"
                    }}> 
                    <g>
                        <path class="st0" style={{
                            fill: "none",
                            stroke: "#235DAB",
                            strokeWidth: "15",
                            strokeMiterlimit: "10"
                        }} d="M110.17,110.46L110.17,110.46c-37.1,37.1-57.95,87.43-57.95,139.9v0c0,52.47,20.85,102.8,57.95,139.9l0,0
                            c37.1,37.1,87.43,57.95,139.9,57.95h0c52.47,0,102.8-20.85,139.9-57.95l0,0c37.1-37.1,57.95-87.43,57.95-139.9v0
                            c0-52.47-20.85-102.8-57.95-139.9l0,0c-37.1-37.1-87.43-57.95-139.9-57.95h0C197.6,52.51,147.27,73.36,110.17,110.46z"/>
                        <g>
                            <path class="st1" style={{
                                fill: "#235DAB",
                            }} d="M263.44,181.01c0.24,7.37-5.16,13.26-13.75,13.26c-7.6,0-13-5.9-13-13.26c0-7.61,5.65-13.5,13.5-13.5
                                C258.29,167.51,263.44,173.41,263.44,181.01z M239.39,327.37V220.26c0-3.23,2.62-5.85,5.85-5.85h9.89c3.23,0,5.85,2.62,5.85,5.85
                                v107.11c0,3.23-2.62,5.85-5.85,5.85h-9.89C242.01,333.22,239.39,330.6,239.39,327.37z"/>
                        </g>
                    </g>
                </svg>
                <p className="noti-title">{ 
                    ( !isOpen ) ?
                        ( content.title.length > 18 ) ? 
                            content.title.substr(0, 17) + "..."
                            : content.title
                    : content.title
                }</p>
            </div>
            {
                ( isOpen ) &&  
                <>
                    <div className="noti-splitbar"></div>
                    <div className="noti-content-wrap">
                        <span className="noti-content">{
                            content.content.split("\n").map(v => <p style={{
                                height: ( v.length === 0 ) && "21px"
                            }}>
                                { v }
                            </p>)
                        }</span>
                    </div>
                    <div className="noti-buttons">
                        <NotificationInnerBtn style={{
                            color: `var(--theme-color-C)`,
                        }}>자세히</NotificationInnerBtn>
                        <NotificationInnerBtn style={{
                            backgroundColor: `white`,
                            color: `black`,
                        }} onClick={ () => closeNotification() }>그만보기</NotificationInnerBtn>
                        <NotificationInnerBtn style={{
                            backgroundColor: `var(--theme-color-C)`,
                            color: `white`,
                            gridColumn: '1 / 3'
                        }} onClick={ () => setIsOpen(false) }>확인</NotificationInnerBtn>
                    </div>
                </>
            }
        </div>
        <div className="noti-btns" style={{
            width: `${ swiped_degree }px`,
            gridTemplateColumns: 
                ( swiped_degree >= 300 ) ?
                    `0px ${ swiped_degree }px`
                    : null
        }}>
            <div className="noti-btn noti-info" onClick={ () => {
                setSwipeDegree(0);
                setIsOpen(true);
            } }>
                <svg id="info_1_" data-name="info (1)" width="15.214" height="15.214" viewBox="0 0 15.214 15.214">
                    <g id="Group_100" data-name="Group 100">
                        <g id="Group_99" data-name="Group 99">
                        <path id="Path_34" data-name="Path 34" d="M7.607,0a7.607,7.607,0,1,0,7.607,7.607A7.6,7.6,0,0,0,7.607,0Zm0,14.153a6.546,6.546,0,1,1,6.546-6.546A6.553,6.553,0,0,1,7.607,14.153Z" fill="#fff"/>
                        </g>
                    </g>
                    <g id="Group_102" data-name="Group 102" transform="translate(7.076 6.05)">
                        <g id="Group_101" data-name="Group 101">
                        <path id="Path_35" data-name="Path 35" d="M238.671,203.609a.531.531,0,0,0-.531.531v4.352a.531.531,0,1,0,1.061,0V204.14A.531.531,0,0,0,238.671,203.609Z" transform="translate(-238.14 -203.609)" fill="#fff"/>
                        </g>
                    </g>
                    <g id="Group_104" data-name="Group 104" transform="translate(7.076 3.751)">
                        <g id="Group_103" data-name="Group 103">
                        <path id="Path_36" data-name="Path 36" d="M238.671,126.214a.531.531,0,0,0-.531.531v.637a.531.531,0,0,0,1.061,0v-.637A.531.531,0,0,0,238.671,126.214Z" transform="translate(-238.14 -126.214)" fill="#fff"/>
                        </g>
                    </g>
                </svg>
            </div>
            <div className="noti-btn noti-trash" onClick={ _notiDeleteBtnHandler } >
                <svg id="delete" width="12.619" height="15.538" viewBox="0 0 12.619 15.538">
                    <path id="Path_30" data-name="Path 30" d="M222.762,154.7a.364.364,0,0,0-.364.364v6.877a.364.364,0,0,0,.728,0v-6.877A.364.364,0,0,0,222.762,154.7Zm0,0" transform="translate(-214.306 -149.074)" fill="#f5f5f5"/>
                    <path id="Path_31" data-name="Path 31" d="M104.762,154.7a.364.364,0,0,0-.364.364v6.877a.364.364,0,0,0,.728,0v-6.877A.364.364,0,0,0,104.762,154.7Zm0,0" transform="translate(-100.599 -149.074)" fill="#f5f5f5"/>
                    <path id="Path_32" data-name="Path 32" d="M1.03,4.624V13.59a2.008,2.008,0,0,0,.534,1.385,1.792,1.792,0,0,0,1.3.562H9.749a1.791,1.791,0,0,0,1.3-.562,2.008,2.008,0,0,0,.534-1.385V4.624a1.39,1.39,0,0,0-.357-2.734H9.363V1.436A1.429,1.429,0,0,0,7.922,0H4.691A1.429,1.429,0,0,0,3.25,1.436v.455H1.387A1.39,1.39,0,0,0,1.03,4.624ZM9.749,14.809H2.864A1.152,1.152,0,0,1,1.758,13.59V4.656h9.1V13.59A1.152,1.152,0,0,1,9.749,14.809ZM3.978,1.436a.7.7,0,0,1,.713-.71H7.922a.7.7,0,0,1,.713.71v.455H3.978ZM1.387,2.619h9.839a.655.655,0,0,1,0,1.31H1.387a.655.655,0,1,1,0-1.31Zm0,0" transform="translate(0.003 0.001)" fill="#f5f5f5"/>
                    <path id="Path_33" data-name="Path 33" d="M163.762,154.7a.364.364,0,0,0-.364.364v6.877a.364.364,0,0,0,.728,0v-6.877A.364.364,0,0,0,163.762,154.7Zm0,0" transform="translate(-157.453 -149.074)" fill="#f5f5f5"/>
                </svg>
            </div>
        </div>
    </div>
}

function Notification({ props }) {

    const { socket: { socket }, mobile: { bottom_comp: { mode: bcomp_mode } } } = useSelector( state => state );

    // notification content control
    const [ common_notice, setCommonNotice ] = useState(null); 

    useEffect(() => {
        if ( bcomp_mode === null ) {
            ( async function() {
                const notice = await service.getNotification();
                console.log(notice);
                if ( notice?.result ) setCommonNotice( notice?.data );
            }() )
        } else {
            closeNotice("common");
        }
    }, [ bcomp_mode ]);

    useEffect(() => {
        console.log(common_notice);
    }, [ common_notice ])

    // notification background control
    const [ isNoticeBlockOpen, setIsNoticeBlockOpen ] = useState(false);

    // notice close control
    const closeNotice = ( type ) => {
        if ( type === "common" ) setCommonNotice(null);

        // request notice permanent-disable
    }


    return <>
        <div className="mobile-notis" style={{
            zIndex: isNoticeBlockOpen && "5000"
        }}>
                {
                    ( common_notice ) && <NotificationBlock
                        content={ common_notice }
                        blockOpenState={[ isNoticeBlockOpen, setIsNoticeBlockOpen ]}
                        deleteNotification={ () => {
                            setTimeout(() => {
                                closeNotice("common");
                            }, 500);
                        } }
                    />
                }
            {/* <div className="noti-block request_noti">

            </div> */}
        </div>
        <div className="mobile-notis-background" style={{
            display: isNoticeBlockOpen ? "initial" : "none",
            zIndex: isNoticeBlockOpen && "4500"
        }} onClick={(e) => setIsNoticeBlockOpen(false)}
        ></div>
    </>;
}

export default Notification;