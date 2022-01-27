import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, withRouter, useHistory } from "react-router-dom"


// css
import "../../../css/mobile_comp/footer/BottomRender.css";

import Search from "../mobile_comps/Search";
import SMobileKeyboarearch from "../mobile_comps/Search";
import SearchNear from "../mobile_comps/SearchNear";
import Specific from "../mobile_comps/Specific";
import Friend from '../mobile_comps/Friend';
import Login from '../mobile_comps/Login';
import Review from '../mobile_comps/Review';
import BottomManageMeeting from '../mobile_comps/Sub.Manage.Meeting';

export const BottomRender = function({
    width, height,
    mBottomRef,
    history,
    // security keyboard
    setKO,
    MKBState: [ m_kboard, setMK ],
    MITState: [ m_itype, setMIT ],
}) {

    const { user: { uinfo }, map: { stat }, mobile: { bottom_comp: Bcomp, mealfriend } } = useSelector(state => state);
    const dispatch = useDispatch();

    const [ isBcompOpen, setBO ] = useState(false);
    const [ eventList, setEL ] = useState({
        toUp: {},
        toDown: {},
        toLeft: {},
        toRight: {}
    });
    const [ eventTimeA, setETA ] = useState(0);
    const [ eventTimeB, setETB ] = useState(0);
    const [ swipe_start, setSS ] = useState([-100, -100]);
    const [ mobile_init, setMobileInit ] = useState(false);

    const mbCompRef = useRef(<></>);
    const bgRef = useRef(<></>);
    const dropdownBarRef = useRef(<></>);
    const compDisplayerRef = useRef(<></>);

    // remove supporter footer

    useEffect(() => {
        if (width < 600) document.getElementById("footer-support").style.display = "none";
    }, [ width, height ]);

    // bottom component control

    const isMobile = () => {
        return (width < height) || ( width < 600 );
    }

    const _bgClickHandler = () => {
        mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "var(--theme-color-C)");
        mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "var(--theme-color-C)");
        dispatch({ type: "map/SETLIST", list: [] }); // remove map pointers
        // dispatch({ type: "mobile/SETCOMP", comp: { mode: null } }); // remove bottom_component content
        console.log(history);
        history.push("/"); // move to home
        if (isMobile() && stat) { // when map is loaded & display size is mobile
            dispatch({ type: "map/SETMCLICK", active: true }); // active map click
        }
    }

    // swipe detection

        const SWIPE_STD = 30;

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
            
            // console.log(mp);
            // console.log(eventList[mp]);
            const t = new Date().getTime();
            setETA({ mp, e, time: t });
            setTimeout(() => {
                setETB({ mp, e, time: t });
            }, 50);
            // else console.log("ignored");
        }

        useEffect(() => {
            const { time: eA } = eventTimeA;
            const { time: eB, mp, e } = eventTimeB;
            if ((eA == eB) && eventList[mp] && !(swipe_start[0] < 0) && !(swipe_start[1] < 0)) {
                console.log("Swipe Detection");
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
        }, [ eventTimeB ]);

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

    // bottom upper component handler

    const sizes = {
        maximize: "600px",
        sub_maximize: "530px",
        oh_default: "470px",
        default: "400px",
        third_quarter_default: "320px",
        half_default: "250px",
        quarter_default: "150px",
        minimize: "110px"
    }

    const _bcompOptions = {
        login: {
            path: "/login",
            bg_blaclize: true,
            action: true,
            opensize: sizes.oh_default,
            ddbar_enable: true,
            alignment_top: false
        },
        search: {
            path: "/search",
            bg_deactivate: true,
            action: true,
            opensize: sizes.maximize,
            cover_all: true
        },
        nearby: {
            path: "/nearby",
            bg_blaclize: false,
            action: true,
            opensize: sizes.half_default,
            cover_all: true
        },
        specific: {
            path: "/specific",
            bg_blaclize: true,
            action: true,
            opensize: sizes.third_quarter_default, 
            ddbar_enable: true,
            cover_all: true
        },
        friend: {
            path: "/friend",
            bg_blaclize: false,
            action: true,
            opensize: sizes.default, 
            ddbar_enable: true,
            alignment_top: false,
            bg_deactivate: false
        },
        review: {
            path: "/review",
            bg_blaclize: false,
            action: true,
            opensize: sizes.default,
            ddbar_enable: true,
            alignment_top: false,
            bg_deactivate: false,
        },
        "[sub].manage.meeting": {
            path: "/manage/meeting",
            bg_blaclize: false,
            action: true,
            opensize: sizes.half_default,
            ddbar_enable: true,
            alignment_top: false,
            bg_deactivate: true,
        }
    }
    
    const _bcompHandler = (options) => {

        const { path, bg_blaclize, action, opensize, ddbar_enable, alignment_top, bg_deactivate, cover_all } = options;

        console.log(`_bcompHandler | path: ${ path } | bg_blaclize: ${bg_blaclize} | action: ${action} | opensize: ${opensize} | ddbar_enable: ${ddbar_enable} | alignment_top: ${alignment_top} | bg_deactivate: ${bg_deactivate}`);

        if (action) {

            setTimeout(() => {
                // background touch detector activation
                if (bg_deactivate !== true) bgRef.current.addEventListener("click", _bgClickHandler);
                // user swipe action detector activation
                // mbCompRef.current.addEventListener("mousedown", _swipeStartHandler);
                // mbCompRef.current.addEventListener("mouseup", _swipeOngoingHandler);
            }, 300);
    
            if (bg_deactivate !== true) bgRef.current.style.display = "block";
            if (ddbar_enable) dropdownBarRef.current.style.display = "block";
            setTimeout(() => {
                compDisplayerRef.current.style.width = "80%";
                // compDisplayerRef.current.style.height = '80%';
                compDisplayerRef.current.style.height = 'calc(100% - 60px)';

                if (cover_all) {
                    mbCompRef.current.style.height = (opensize.replace("px", "")*1 + 50) + "px" || "300px";
                    mbCompRef.current.style.bottom = "-50px";
                } else {
                    mbCompRef.current.style.height = opensize || "200px";
                    mbCompRef.current.style.bottom = "50px";
                }

                if (bg_blaclize) {
                    bgRef.current.style.opacity = "1";
                    bgRef.current.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                }
                if (alignment_top === false) mBottomRef.current.style.zIndex = "2500";                
            }, 200);
    
            return () => {
                setBO(true);
                if (bgRef.current) bgRef.current.removeEventListener("click", _bgClickHandler);
                // mbCompRef.current.removeEventListener("mousedown", _swipeStartHandler);
                // mbCompRef.current.removeEventListener("mouseup", _swipeOngoingHandler);
            }

        } else {
            setTimeout(() => {
                bgRef.current.removeEventListener("click", _bgClickHandler);
    
                bgRef.current.style.opacity = "0";
                mbCompRef.current.style.height = "0px";
                mbCompRef.current.style.bottom = "-50px";
                bgRef.current.style.backgroundColor = "white";
                dropdownBarRef.current.style.display = "none";
                setTimeout(() => {
                    bgRef.current.style.display = "none";
                    setBO(false);
                    if (mobile_init) _bgClickHandler();
                    setTimeout(() => {
                        mBottomRef.current.style.zIndex = null;
                    }, 300);
                }, 200);
            }, 200);
        }

    }

    useEffect(() => {
        if (!stat) return;
        console.log("Bcomp", Bcomp);
        if (Bcomp.mode) {
            if (!uinfo.isLogined) return _bcompHandler(_bcompOptions.login);
            else switch(Bcomp.mode) {
                case "login":
                    closeMenu();
                default:
                    return _bcompHandler( _bcompOptions[Bcomp.mode] || {
                        path: "/",
                        bg_blaclize: false,
                        action: true
                    });
            }
        }
        
        _bcompHandler({
            bg_blaclize: true,
            action: false
        });
        closeKeyboard();

    }, [ Bcomp, stat ]);

    // prevent initial marker removing error
    useEffect(() => {
        if (stat) setTimeout(() => setMobileInit(true), 500);
    }, [ stat ]);

    const closeMenu = (menu) => {
        // history.push('/');
    }
    
    const openKeyboard = () => {
        setKO(true);
    }

    const closeKeyboard = () => {
        setKO(false);
    }

    return <>
        <div
            ref={bgRef}
            className="background-cover"
            onTouchStart={_swipeStartHandler} 
            onTouchMove={_swipeOngoingHandler}
        ></div>
        <div className="mobile-bottom-comp" ref={mbCompRef} 
            onTouchStart={_swipeStartHandler} 
            onTouchMove={_swipeOngoingHandler}
        >
            <div className="dropdown-bar" ref={dropdownBarRef}></div>
            <div className="mobile-bottom-comp-displayer" ref={compDisplayerRef}>
                { (Bcomp.mode !== null) ?
                    (uinfo?.isLogined) ?
                            ( Bcomp.mode === "nearby" ) ?  <SearchNear results={Bcomp.value || []} history={ history }/> :
                            
                            ( Bcomp.mode === "search" ) ?  <Search swipeEvent={_swipeEvent}/> :
                            
                            ( Bcomp.mode === "specific" ) ?  <Specific swipeEvent={_swipeEvent} id={Bcomp.value || ""}/> :
                            
                            ( Bcomp.mode === "friend" ) ? <Friend swipeEvent={_swipeEvent} 
                                bottomCompHandler={(opensize) => _bcompHandler({ bg_blaclize: false, action: true, opensize, ddbar_enable: true, alignment_top: false })}
                                history={ history }
                            /> :
                            
                            ( Bcomp.mode === "review" ) ?  <Review swipeEvent={_swipeEvent} 
                                bottomCompHandler={(opensize) => _bcompHandler({ bg_blaclize: false, action: true, opensize, ddbar_enable: true, alignment_top: false })}
                            /> :
                            
                            /* submenu content */
                            ( Bcomp.mode === "[sub].manage.meeting" ) ?  <BottomManageMeeting swipeEvent={_swipeEvent} history={ history }
                                bottomCompHandler={(opensize) => _bcompHandler({ bg_blaclize: false, action: true, opensize, ddbar_enable: true, alignment_top: false })}
                            /> :
                            ( Bcomp.mode === "login" ) ?  <Login
                                bottomCompHandler={(opensize) => _bcompHandler({ bg_blaclize: true, action: true, opensize, ddbar_enable: true, alignment_top: false })}
                                onPinInput={openKeyboard}
                                onPinInputEnd={closeKeyboard}
                                minp={[m_kboard, setMK]}
                                swipeEvent={_swipeEvent}
                            />
                        :
                        <div onLoad={() => closeMenu()} ></div>
                    :
                    <Login
                        bottomCompHandler={(opensize) => _bcompHandler({ bg_blaclize: true, action: true, opensize, ddbar_enable: true, alignment_top: false })}
                        onPinInput={openKeyboard}
                        onPinInputEnd={closeKeyboard}
                        minp={[m_kboard, setMK]}
                        swipeEvent={_swipeEvent}
                    />
                :
                <div onLoad={() => closeMenu()} ></div>
                }
            </div>
        </div>
    </>
}