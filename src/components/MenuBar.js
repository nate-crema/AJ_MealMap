import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../css/MBar.css";

// img
import search_icon from "../assets/img/menu_icon/search.svg";
import route_icon from "../assets/img/menu_icon/route.svg";
import review_icon from "../assets/img/menu_icon/review.svg";
import add_icon from "../assets/img/menu_icon/add.svg";

// menu component
import Search from "./menus/Search";
import Add from "./menus/Add";
import Specific from "./menus/Specific";

function Logo({ onClick, style: _style = {} }) {
    const style = [
        {   
            fill: "none",
            stroke:"var(--theme-color-C)",
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: "10",
            ..._style[".st0"]
        },
        {   
            fill: "none",
            stroke:"var(--theme-color-C)",
            strokeWidth: "2",
            strokeMiterlimit: "10",
            ..._style[".st1"]
        },
        {   
            fill: "none",
            stroke:"var(--theme-color-C)",
            strokeWidth: "1.45",
            strokeLinecap: "round",
            strokeMiterlimit: "10",
            ..._style[".st2"]
        }
    ];
    return <>
        <svg version="1.1" id="Layer_1" x="0px" y="0px" onClick={onClick}
            viewBox="0 0 110 110" style={{ enableBackground: "new 0 0 110 110", ..._style?.svg, cursor: onClick ? "pointer" : null }}>
            <path class="st0" style={style[0]} d="M83.7,94.7c-8.1,5.8-18,9.3-28.7,9.3C28,104,6,82,6,55S28,6,55,6s49,21.9,49,49c0,7.8-1.8,15.2-5.1,21.8"/>
            <path class="st0" style={style[0]} d="M81.5,35.8c3.9,5.4,6.2,12,6.2,19.2c0,18.1-14.7,32.8-32.8,32.8S22.2,73.1,22.2,55S36.9,22.2,55,22.2
                c5.2,0,10.2,1.2,14.6,3.4"/>
            <g>
                <g>
                    <path class="st1" style={style[1]} d="M68.3,47c0,7.4-11.8,29.3-13.3,29.3c-1.6,0-13.3-22-13.3-29.3s6-13.3,13.3-13.3S68.3,39.6,68.3,47z"/>
                    <circle class="st1" style={style[1]} cx="55" cy="46.9" r="7.5"/>
                </g>
                <g>
                    <path class="st2" style={style[2]} d="M52.9,50.5c0,0-1.6-2.2-1.6-3c0-0.7,2-3.9,2.5-4.5c0.1-0.1,0.1-0.1,0.2,0c0.5,0.6,2.5,4,2.5,4.5
                        c0,0.6-0.5,1-0.5,1"/>
                    <path class="st2" style={style[2]} d="M55.7,42.1c0,0,3.1,4.5,3.1,5.3c0,0.7-1.2,2.4-1.6,2.9c-0.1,0.1-0.2,0.2-0.4,0.2h-1.2c-0.2,0-0.3-0.1-0.4-0.2
                        l-1.6-2.6c-0.1-0.1-0.1-0.3,0-0.4l0.6-0.8"/>
                </g>
            </g>
        </svg>
    </>
}


function MBar({  }) {

    // global variable
    const { menu: { menu, mopen }, specific: { content: spec_info } } = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [ mstb, setMSTB ] = useState(false);
    useEffect(() => {
        if ( mopen == true ) setMSTB(true);
        else if ( menu >= 2 && menu <= 4 ) {
            setMSTB(false);
            setTimeout(() => {
                setMSTB(true);
            }, 300);
        } else {
            setTimeout(() => {
                setMSTB(false);
            }, 1000);
        }
    }, [ mopen, menu ]);

    const menus = [
        { img: search_icon, mname: "검색", mid: 2, comp: <Search/> },
        { img: route_icon, mname: "경로", mid: 3, comp: <></> },
        { img: review_icon, mname: "리뷰", mid: 4, comp: <></> },
        { img: add_icon, mname: "추가", mid: 5, comp: <Add/> }
    ];

    const getMenu = (mid) => {
        // console.log(menus.find(v => v.mid == mid));
        return menus.find(v => v.mid == mid);
    }

    const _menuClick = (e, i) => {
        const mprop = menus[i];
        dispatch({ type: "menu/SETMENU", menu: mprop.mid });
    }

    return  <>
        <nav className="mbar">
            <div className="logoArea">
                <Logo style={{
                        svg: {
                            width: "70%",
                            height: "auto",
                            position: "absolute",
                            top: "40%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }
                    }} 
                    onClick={() => dispatch({ type: "menu/SETMENU", menu: 1 })}
                />
                <div className="logo_hinder">
                    <div className="stylebar"/>
                </div>
                <div className="action_btns">
                    <span className="login">로그인</span>
                    <span className="register">회원가입</span>
                </div>
            </div>
            <div className="menus">
                { menus.map((v, i) => <div className="bar-cont" onClick={(e) => _menuClick(e, i)}>
                    <div className="icon_block">
                        <img className="bar-img" src={ v.img }/>
                    </div>
                    <span className="menu_title">{ v.mname }</span>
                </div>) }
            </div>
        </nav>
        <div className="menu_contents" style={{
            display: mopen ? "block" : mstb == false ? "none" : "block",
            animationName: mopen ? "menu_open" : "menu_close"
        }}>
            <span className="menu_title">{ getMenu(menu)?.mname || "" }</span>
            <div className="menu_area">
                { getMenu(menu)?.comp || <></> }
            </div>
            {
                spec_info != null && <Specific/>
            }
        </div>
    </>
}

export default MBar;