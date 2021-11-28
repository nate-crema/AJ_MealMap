import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/MobileTop.css";
import "../css/MobileBottom.css";

// logo
import { Logo } from './MenuBar';

// sub-rendering component
import Search from "./mobile_comps/SearchNear";
import Specific from "./mobile_comps/Specific";
import Friend from './mobile_comps/Friend';
import Login from './mobile_comps/Login';

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
        mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "var(--theme-color-C)");
        mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "var(--theme-color-C)");
        dispatch({ type: "map/SETLIST", list: [] });
        dispatch({ type: "mobile/SETCOMP", comp: null });
        if (isMobile() && stat) dispatch({ type: "map/SETMCLICK", active: true });
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
            console.log("Swipe Detected");
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
    
    const _bcompHandler = (bg_blaclize, action, opensize, ddbar_enable, alignment_top, bg_deactivate) => {

        console.log(`_bcompHandler`, bg_blaclize, action, opensize, ddbar_enable, alignment_top, bg_deactivate);

        if (action) {

            setTimeout(() => {
                // background touch detector activation
                if (bg_deactivate !== true) bgRef.current.addEventListener("click", _bgClickHandler);
                // user swipe action detector activation
                // mbCompRef.current.addEventListener("mousedown", _swipeStartHandler);
                // mbCompRef.current.addEventListener("mouseup", _swipeOngoingHandler);
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
                // mbCompRef.current.removeEventListener("mouseup", _swipeOngoingHandler);
            }

        } else {
            setTimeout(() => {
                bgRef.current.removeEventListener("click", _bgClickHandler);
    
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
                    return _bcompHandler(false, true, "40%", true, false, false);
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
        if (Bcomp) {
            dispatch({ type: "mobile/SETCOMP", comp: null });
            return setTimeout(() => {
                openMenu(menu);
            }, 150);
        }
        mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "rgba(0, 0, 0, 0.1)");
        mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "rgba(0, 0, 0, 0.5)");
        switch(menu) {
            case "friend":
                mBottomRef.current.querySelectorAll(".btn-friend .img path").forEach(v => v.style.fill = "var(--theme-color-C)");
                mBottomRef.current.querySelectorAll(".btn-friend span").forEach(v => v.style.color = "var(--theme-color-C)");
                dispatch({ type: "mobile/SETCOMP", comp: { mode: "friend" } })
                return;
            default:
                return;
        }
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
                            <svg className="img friend_svg" xmlns="http://www.w3.org/2000/svg" width="34.006" height="28.308" viewBox="0 0 34.006 28.308">
                                <g id="Group_381" data-name="Group 381" transform="translate(-439.161 -208.87)">
                                    <g id="Group_378" data-name="Group 378" transform="translate(446.008 213.067)">
                                    <path id="Path_109" data-name="Path 109" d="M467.554,241.3a.585.585,0,0,1-.586-.585,9.087,9.087,0,1,0-18.174,0,.585.585,0,0,1-1.171,0,10.257,10.257,0,1,1,20.515,0A.585.585,0,0,1,467.554,241.3Z" transform="translate(-447.624 -217.189)" fill="#005bae"/>
                                    <path id="Path_110" data-name="Path 110" d="M458.951,225.517a5.73,5.73,0,1,1,5.729-5.73A5.736,5.736,0,0,1,458.951,225.517Zm0-10.289a4.559,4.559,0,1,0,4.559,4.559A4.564,4.564,0,0,0,458.951,215.229Z" transform="translate(-448.693 -214.058)" fill="#005bae"/>
                                    </g>
                                    <g id="Group_379" data-name="Group 379" transform="translate(458.331 208.87)">
                                    <path id="Path_111" data-name="Path 111" d="M478.794,236.235a.585.585,0,0,1-.585-.585,9.092,9.092,0,0,0-6.121-8.592.585.585,0,0,1,.382-1.106,10.262,10.262,0,0,1,6.909,9.7A.585.585,0,0,1,478.794,236.235Z" transform="translate(-464.543 -212.126)" fill="#005bae"/>
                                    <path id="Path_112" data-name="Path 112" d="M470.476,219.333a.585.585,0,0,1-.347-1.057,4.561,4.561,0,0,0-3.894-8.077,4.532,4.532,0,0,0-2.341,1.527.585.585,0,1,1-.909-.739,5.73,5.73,0,1,1,7.836,8.233A.581.581,0,0,1,470.476,219.333Z" transform="translate(-462.855 -208.87)" fill="#005bae"/>
                                    </g>
                                    <g id="Group_380" data-name="Group 380" transform="translate(439.161 208.87)">
                                    <path id="Path_113" data-name="Path 113" d="M439.746,236.235a.585.585,0,0,0,.585-.585,9.092,9.092,0,0,1,6.121-8.592.585.585,0,1,0-.382-1.106,10.262,10.262,0,0,0-6.909,9.7A.585.585,0,0,0,439.746,236.235Z" transform="translate(-439.161 -212.126)" fill="#005bae"/>
                                    <path id="Path_114" data-name="Path 114" d="M447.445,219.333a.585.585,0,0,0,.347-1.057,4.561,4.561,0,0,1,3.894-8.077,4.532,4.532,0,0,1,2.341,1.527.585.585,0,1,0,.909-.739,5.73,5.73,0,1,0-7.836,8.233A.58.58,0,0,0,447.445,219.333Z" transform="translate(-440.23 -208.87)" fill="#005bae"/>
                                    </g>
                                </g>
                            </svg>
                            <span className="btn-name">밥친구 {mealfriend.list.length}명</span>
                        </> : <>
                            <svg id="loupe_1_" className="img friend_svg" data-name="loupe (1)" xmlns="http://www.w3.org/2000/svg" width="26.795" height="27.929" viewBox="0 0 26.795 27.929">
                                <g id="Group_319" data-name="Group 319" transform="translate(-190.79 -66.831)">
                                    <g id="Group_319-2" data-name="Group 319" transform="translate(190.79 70.973)">
                                    <path id="Path_82" data-name="Path 82" d="M210.452,107.376a.577.577,0,0,1-.577-.577,8.965,8.965,0,0,0-17.931,0,.577.577,0,1,1-1.155,0,10.12,10.12,0,1,1,20.24,0A.577.577,0,0,1,210.452,107.376Z" transform="translate(-190.79 -83.589)" fill="#005bae"/>
                                    <path id="Path_83" data-name="Path 83" d="M204.181,85.311a5.653,5.653,0,1,1,5.653-5.653A5.659,5.659,0,0,1,204.181,85.311Zm0-10.151a4.5,4.5,0,1,0,4.5,4.5A4.5,4.5,0,0,0,204.181,75.16Z" transform="translate(-194.061 -74.005)" fill="#005bae"/>
                                    </g>
                                    <g id="Group_320" data-name="Group 320" transform="translate(202.947 66.831)">
                                    <path id="Path_84" data-name="Path 84" d="M231.074,100.583a.578.578,0,0,1-.577-.577,8.969,8.969,0,0,0-6.039-8.477.577.577,0,0,1,.376-1.092,10.126,10.126,0,0,1,6.817,9.569A.578.578,0,0,1,231.074,100.583Z" transform="translate(-217.014 -76.795)" fill="#005bae"/>
                                    <path id="Path_85" data-name="Path 85" d="M219.367,77.155a.577.577,0,0,1-.342-1.043,4.5,4.5,0,0,0-3.842-7.969,4.471,4.471,0,0,0-2.309,1.506.577.577,0,0,1-.9-.728,5.653,5.653,0,0,1,10.041,3.563,5.677,5.677,0,0,1-2.31,4.559A.578.578,0,0,1,219.367,77.155Z" transform="translate(-211.848 -66.831)" fill="#005bae"/>
                                    </g>
                                </g>
                            </svg>
                            <span className="btn-name">친구</span>
                        </> }
                    </div>
                    <div className="btn-bottom btn-route" onClick={() => openMenu("route")}>
                        <svg className="img route_svg" xmlns="http://www.w3.org/2000/svg" width="28.104" height="27.959" viewBox="0 0 28.104 27.959">
                        <g id="Group_321" data-name="Group 321" transform="translate(-66.066 -66.336)">
                            <path id="Path_86" data-name="Path 86" d="M70.283,105.97c-1.179,0-4.217-7.037-4.217-8.613a4.217,4.217,0,0,1,4.217-4.218h0A4.222,4.222,0,0,1,74.5,97.355v0C74.5,98.933,71.462,105.97,70.283,105.97Zm0-11.7h0a3.089,3.089,0,0,0-3.088,3.089c0,1.5,2.182,5.873,3.089,7.217.908-1.344,3.089-5.719,3.089-7.217v0A3.092,3.092,0,0,0,70.284,94.268Z" transform="translate(0 -11.675)" fill="#005bae"/>
                            <path id="Path_87" data-name="Path 87" d="M105.131,79.167c-1.179,0-4.217-7.037-4.217-8.613a4.223,4.223,0,0,1,4.216-4.219h0a4.222,4.222,0,0,1,4.217,4.216v0C109.349,72.13,106.31,79.167,105.131,79.167Zm0-11.7h0a3.093,3.093,0,0,0-3.088,3.09c0,1.5,2.182,5.873,3.089,7.217.908-1.344,3.089-5.719,3.089-7.217v0A3.092,3.092,0,0,0,105.131,67.465Z" transform="translate(-15.179)" fill="#005bae"/>
                            <path id="Path_88" data-name="Path 88" d="M84.338,93.254a.565.565,0,0,1-.038-1.128c.051,0,5.164-.384,6.672-3.116a.773.773,0,0,0,.134-.647c-.221-.492-1.579-.8-2.57-1.022-1.333-.3-2.483-.56-2.878-1.334a1.25,1.25,0,0,1,0-1.1c1.027-2.386,5.422-3.453,5.92-3.567a.564.564,0,1,1,.252,1.1c-1.2.275-4.456,1.335-5.135,2.914-.007.018-.044.107-.028.139.154.3,1.338.568,2.121.745,1.425.322,2.9.654,3.351,1.66a1.8,1.8,0,0,1-.175,1.655c-1.805,3.272-7.348,3.681-7.584,3.7Z" transform="translate(-7.713 -6.53)" fill="#005bae"/>
                        </g>
                        </svg>
                        <span className="btn-name">경로</span>
                    </div>
                    <div className="btn-bottom btn-review" onClick={() => openMenu("review")}>
                        <svg className="img review_svg" id="thinking" xmlns="http://www.w3.org/2000/svg" width="28.773" height="28.773" viewBox="0 0 28.773 28.773">
                            <g id="Group_288" data-name="Group 288">
                                <g id="Group_287" data-name="Group 287">
                                <path id="Path_76" data-name="Path 76" d="M19.182,0A9.509,9.509,0,0,0,11.9,3.358,8.09,8.09,0,1,0,8.093,18.583h.07a4.744,4.744,0,0,0,4.426,3A4.793,4.793,0,0,0,16.873,18.9,9.592,9.592,0,1,0,19.182,0Zm0,17.983A8.372,8.372,0,0,1,16.7,17.61a.6.6,0,0,0-.741.373,3.571,3.571,0,0,1-6.807-.193.709.709,0,0,0-.669-.424H8.44c-.116.008-.231.017-.349.017A6.894,6.894,0,1,1,11.729,4.642a.6.6,0,0,0,.792-.144,8.389,8.389,0,1,1,6.66,13.485Z" transform="translate(0)" fill="#005bae"/>
                                <path id="Path_77" data-name="Path 77" d="M109.064,384a2.4,2.4,0,1,0,2.4,2.4A2.4,2.4,0,0,0,109.064,384Zm0,3.6a1.2,1.2,0,1,1,1.2-1.2A1.2,1.2,0,0,1,109.064,387.6Z" transform="translate(-100.672 -362.42)" fill="#005bae"/>
                                <path id="Path_78" data-name="Path 78" d="M23.131,448a1.8,1.8,0,1,0,1.8,1.8A1.8,1.8,0,0,0,23.131,448Zm0,2.4a.6.6,0,1,1,.6-.6A.6.6,0,0,1,23.131,450.4Z" transform="translate(-20.134 -422.823)" fill="#005bae"/>
                                </g>
                            </g>
                        </svg>
                        <span className="btn-name">리뷰</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}