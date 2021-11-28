import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/MobileTop.css";

// logo
import { Logo } from '../../../components/MenuBar';

// api
import { shop } from '../../../apis';

const SBClickBlock = function({ className, style, text, icn }) {
    
    return <div className={ className + " sb_block" || "sb_block" }>
        <span className="text">{ text }</span>
        {
            (icn == "arrowpoint") && <>
                <svg xmlns="http://www.w3.org/2000/svg" className="arrowpoint" width="6" height="11.362" viewBox="0 0 6 11.362">
                    <path data-name="Path 145" d="M390.05,220.377a.489.489,0,0,1-.346-.835l4.726-4.726a.078.078,0,0,0,0-.11l-4.856-4.856a.489.489,0,0,1,.692-.692l4.856,4.856a1.056,1.056,0,0,1,0,1.494l-4.726,4.726A.488.488,0,0,1,390.05,220.377Z" transform="translate(-389.432 -209.014)" fill="#005ab4"/>
                </svg>
            </>
        }
    </div>
}

export const MobileTop = function({ width, height }) {

    // global variable
    const { user: { uinfo }, map: { stat }, search: { area_open }, mobile: { bottom_comp: Bcomp, mealfriend } } = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [ keyword, setKw ] = useState("");
    const [ search_result, setSR ]=  useState([]);
    const [ prevres_close, setPC ] = useState(false);
    const [ isActive, setActive ] = useState(false);
    const [ mode, setMode ] = useState(0); // 0: recommend / recent | 1: searching

    const inputRef = useRef(<></>);
    const sbRef = useRef();

    useEffect(() => {
        if (!isActive) return;
        dispatch({ type: "search/SETOPEN", open: true });
        const _enterHandler = function(e) {
            if (e.keyCode == 13) inputRef.current.blur();
        }
        document.addEventListener("keypress", _enterHandler);
        return () => {
            document.removeEventListener("keypress", _enterHandler);
        }
    }, [ isActive ]);

    useEffect(() => {
        if (isActive && Bcomp?.mode !== "search") dispatch({ type: "mobile/SETCOMP", comp: { mode: "search" } });
        else if (!isActive && keyword.length == 0 && Bcomp?.mode == "search") dispatch({ type: "mobile/SETCOMP", comp: null });
    }, [ keyword.length, isActive ]);

    const _updateSearchResult = async (v) => {
        
        // search keyword
        setTimeout(() => setKw(pv => {
            if (v !== pv || v.length <= 0) {
                setPC(true);
                setTimeout(() => {
                    setSR([]);
                    setPC(false);
                }, 150);
                return pv;
            }
            dispatch({ type: "search/SETKW", kw: v });
            const { findShopList } = shop;
            findShopList(v)
            .then(res => {
                setPC(true);
                setTimeout(() => {
                    dispatch({ type: "search/SETRES", result: res });
                    setPC(false);
                }, 150);
            });
            return pv;
        }), 200);
    }

    // swipe handler

        const _handleUp = (mvt) => {
            setActive(false);
            inputRef.current.blur();
            dispatch({ type: "search/SETOPEN", open: false });
        }

        useEffect(() => {
            _swipeEvent.addEventListener("toUp", _handleUp);
            return () => {
                _swipeEvent.removeEventListener("toUp", _handleUp);
            }
        }, []);

        // swipe detection
        const [ eventList, setEL ] = useState({
            toUp: {},
            toDown: {}
        });
        const [ eventTimeA, setETA ] = useState(0);
        const [ eventTimeB, setETB ] = useState(0);
        const [ swipe_start, setSS ] = useState(-100);

        const SWIPE_STD = 30;

        const _swipeStartHandler = (e) => {
            setSS(e.touches[0].clientY);
        }
    
        const _swipeOngoingHandler = (e) => {
            // console.log("end");
            // console.log();
            if (swipe_start < 0) return;
            let mp = null;
            if (swipe_start + SWIPE_STD - e.touches[0].clientY < 0) mp = "toDown";
            else if (swipe_start - SWIPE_STD - e.touches[0].clientY > 0) mp = "toUp";
            
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
            if (eA == eB) if (eventList[mp] && !(swipe_start < 0)) Object.values(eventList[mp]).forEach((fnc, i) => {
                try {
                    fnc(
                        (mp === "toDown") ? (e.touches[0].clientY - swipe_start) :
                        (mp === "toUp") ? (swipe_start - e.touches[0].clientY) :
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

    // swipe handler

    return <>
        <div className="search-background"
            ref={sbRef}
            style={ 
                area_open ? 
                    { height: "100%", opacity: "1" }
                    : { height: null, opaciy: null } 
            } 
            onTouchStart={_swipeStartHandler}
            onTouchMove={_swipeOngoingHandler}
        >
            <div className="block-list">
                <SBClickBlock text="메뉴 추천받기" icn="arrowpoint" className="rec_block"/>
                <span className="recent-text">최근 검색</span>
            </div>
            <span className="notion">위로 쓸어올려 검색 닫기</span>
        </div>
        <div className="mobile-top">
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
                <input type="text" value={keyword} ref={inputRef} className="input_tag" onFocus={() => setActive(true)} onBlur={() => setActive(false)} onChange={(e) => {
                    setKw(e.target.value);
                    _updateSearchResult(e.target.value);
                }} />
            </div>
        </div>
    </>
}