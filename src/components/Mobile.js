import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/MobileTop.css";
import "../css/MobileBottom.css";

// logo
import { Logo } from './MenuBar';

// img
import friend from "../assets/img/friend.svg";
import route from "../assets/img/route.svg";
import review from "../assets/img/review.svg";
import group from "../assets/img/group.svg";

// sub-rendering component
import Search from "./mobile_comps/Search";
import Specific from "./mobile_comps/Specific";
import Friend from './mobile_comps/Friend';

export const MobileTop = function({ width, height }) {
    
    const [ keyword, setKeyWord ] = useState("");
    const [ isActive, setActive ] = useState("");

    const inputRef = useRef(<></>);

    useEffect(() => {
        if (!isActive) return;
        const _enterHandler = function(e) {
            if (e.keyCode == 13) inputRef.current.blur();
        }
        document.addEventListener("keypress", _enterHandler);
        return () => {
            document.removeEventListener("keypress", _enterHandler);
        }
    }, [ isActive ]);

    return <div className="mobile-top">
        <div className="logo" style={{
            width: isActive ? "0" : null
        }}>
            <div className="logo-wrap">
                <Logo/>
            </div>
            <div className="split-bar"></div>
        </div>
        <div className="input" onClick={() => inputRef.current.focus()}  style={{
            width: isActive ? "90%" : null,
            left: isActive ? "20px" : null
        }}>
            <span className="placeholder" style={{
                opacity: keyword.length > 0 ? "0" : "1"
            }}>배고파아ㅏㅏㅏㅏ</span>
            <input type="text" value={keyword} ref={inputRef} className="input_tag" onFocus={() => setActive(true)} onBlur={() => setActive(false)} onChange={(e) => setKeyWord(e.target.value)} />
        </div>
    </div>
}


export const MobileBottom = function({ width, height }) {

    const { map: { stat }, mobile: { bottom_comp: Bcomp, mealfriend } } = useSelector(state => state);
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
    const mBottomRef = useRef(<></>);

    // remove supporter footer

    useEffect(() => {
        if (width < 600) document.getElementById("footer-support").style.display = "none";
    }, [ width, height ]);

    // bottom component control

    const isMobile = () => {
        return (width < height) || ( width < 600 );
    }

    const _bgClickHandler = () => {
        dispatch({ type: "map/SETLIST", list: [] });
        dispatch({ type: "mobile/SETCOMP", comp: null });
        if (isMobile() && stat) dispatch({ type: "map/SETMCLICK", active: true });
    }

    // swipe detection

    const SWIPE_STD = 50;

    const _swipeStartHandler = (e) => {
        // let is_ignore = false;
        // e.nativeEvent.path.forEach(v => {
        //     for (var i = 0; i < v?.classList?.length || 0; i++) (v.classList[i] === "slider") && (is_ignore = true);
        // })
        // if (is_ignore) return setSS([-100, -100]);
        setSS([e.touches[0].clientX, e.touches[0].clientY]);
    }

    const _swipeEndHandler = (e) => {
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
        if (eA == eB) if (eventList[mp] && !(swipe_start[0] < 0) && !(swipe_start[1] < 0)) 
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
    
    const _bcompHandler = (bg_blaclize, action, opensize, ddbar_enable, alignment_top, bg_deactivate) => {

        if (action) {

            setTimeout(() => {
                // background touch detector activation
                if (bg_deactivate !== true) bgRef.current.addEventListener("click", _bgClickHandler);
                // user swipe action detector activation
                // mbCompRef.current.addEventListener("mousedown", _swipeStartHandler);
                // mbCompRef.current.addEventListener("mouseup", _swipeEndHandler);
            }, 300);
    
            bgRef.current.style.display = "block";
            if (ddbar_enable) dropdownBarRef.current.style.display = "block";
            setTimeout(() => {
                mbCompRef.current.style.top = opensize || "50%";
                compDisplayerRef.current.style.width = "80%";
                compDisplayerRef.current.style.height = `calc(100% - ${opensize} - 20px)`;

                if (bg_blaclize) {
                    bgRef.current.style.opacity = "1";
                    bgRef.current.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                }
                if (alignment_top === false) mBottomRef.current.style.zIndex = "2500";                
            }, 200);
    
            return () => {
                setBO(true);
                bgRef.current.removeEventListener("click", _bgClickHandler);
                // mbCompRef.current.removeEventListener("mousedown", _swipeStartHandler);
                // mbCompRef.current.removeEventListener("mouseup", _swipeEndHandler);
            }

        } else {
            document.removeEventListener("click", _bgClickHandler);

            bgRef.current.style.opacity = "0";
            mbCompRef.current.style.top = "105%";
            bgRef.current.style.backgroundColor = "white";
            dropdownBarRef.current.style.display = "none";
            setTimeout(() => {
                bgRef.current.style.display = "none";
                setBO(false);
                if (mobile_init) _bgClickHandler();
                setTimeout(() => {
                    mBottomRef.current.style.zIndex = null;
                }, 150);
            }, 200);
        }

    }

    useEffect(() => {
        if (!stat) return;
        if (Bcomp) {
            switch(Bcomp.mode) {
                case "search":
                    return _bcompHandler(false, true, "70%");
                case "specific":
                    return _bcompHandler(true, true, "65%", true);
                case "friend":
                    return _bcompHandler(false, true, "40%", true, false, true);
                default:
                    return _bcompHandler(true, true);
            }
        }
        else _bcompHandler(true, false);
    }, [ Bcomp, stat ]);

    // prevent initial marker removing error
    useEffect(() => {
        if (stat) setTimeout(() => setMobileInit(true), 500);
    }, [ stat ]);

    // bottom menu control
    const openMenu = (menu) => {
        switch(menu) {
            case "friend":
                dispatch({ type: "mobile/SETCOMP", comp: { mode: "friend" } })
                return;
            default:
                return;
        }
    }

    return <>
        <div className="background-cover" ref={bgRef}></div>
        <div className="mobile-bottom-comp" ref={mbCompRef} 
            onTouchStart={_swipeStartHandler} 
            onTouchMove={_swipeEndHandler}
        >
            <div className="dropdown-bar" ref={dropdownBarRef}></div>
            <div className="mobile-bottom-comp-displayer" ref={compDisplayerRef}>
                { (Bcomp != null && Bcomp) ?
                    (Bcomp.mode == "search") ? <Search results={Bcomp.value || []}/> :
                    (Bcomp.mode == "specific") ? <Specific swipeEvent={_swipeEvent} id={Bcomp.value || ""}/> :
                    (Bcomp.mode == "friend") ? <Friend swipeEvent={_swipeEvent} 
                        bottomCompHandler={(percent) => _bcompHandler(false, true, percent, true, false)}
                    /> : false
                    :
                    <></>
                }
            </div>
        </div>
        <div className="mobile-bottom" ref={mBottomRef}>
            <div className="contents-area">
                <div className="contents-wrap">
                    <div className="btn-bottom btn-friend" onClick={() => openMenu("friend")}>
                        { (mealfriend.list.length > 0) ? <>
                            <img src={group}/>
                            <span className="btn-name">밥친구 {mealfriend.list.length}명</span>
                        </> : <>
                            <img src={friend}/>
                            <span className="btn-name">친구</span>
                        </> }
                    </div>
                    <div className="btn-bottom btn-route" onClick={() => openMenu("route")}>
                        <img src={route}/>
                        <span className="btn-name">경로</span>
                    </div>
                    <div className="btn-bottom btn-review" onClick={() => openMenu("review")}>
                        <img src={review}/>
                        <span className="btn-name">리뷰</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}