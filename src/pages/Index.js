import "../css/Index.css";
import { useState, useEffect, useRef, createContext, useCallback } from "react";
import { Route, Link, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as mapActions from '../store/modules/map';

// img
import bI_1 from "../assets/img/blockImg1.png";
import bI_2 from "../assets/img/blockImg2.png";
import bI_3 from "../assets/img/blockImg3.png";
import bI_4 from "../assets/img/blockImg4.png";
import bI_5 from "../assets/img/blockImg5.png";
import bI_6 from "../assets/img/blockImg6.png";

// components - etc
import Logo from "../components/Logo";

// compoennts - fnc for menu

import Filter from "../components/filter";

// components - pages
import Main from "./Index/main";
import MealMap from "./Index/mealmap";

// global functions

import { initMenu, changeMenuUI, setTitler, getNowInfo, loadList } from "../module/functions";

// ----

function Index({ history }) {

    console.log(initMenu);
    
    // level controller
    const [ title, setTitle ] = useState("");
    const menuRef = useRef(null);
    const titlerRef = useRef(null);
    const wrapRef = useRef(null);
    
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { def: { blocks, boxSize, size, prev }, menu: { menu } } = state;

    const setMenu = useCallback((i) => {
        changeMenuUI(i, history, state, () => {
            dispatch({ type: "prev/LOGPREV", v: window.location.href });
            dispatch({ type: "menu/SETMENU", v: i ? i+1 : 0 });
        })
    }, [ dispatch ]);

    useEffect(() => {
        console.log("GLOBAL MENU CHANGED");
    }, [ menu ]);

    return (
        <div className="wrapper" id="wrapRef">
            <div className="logoSpace">
                <Logo className="logoMain" onClick={e => setMenu()} style={{
                    cursor: menu == 0 ? "default" : "pointer"
                }}/>
                <div className="titlerCover" style={{ top: "250px" }}>
                    <p className="titler" id="titleRef">{title}</p>
                </div>
                {menu > 0 && (blocks[menu-1].subarea || <></>)}
            </div>
            <div className="serviceSpace">
                <Route path="/" exact component={() => {return <Main
                    blocks={blocks}
                    boxSize={boxSize}
                    changeMenuUI={(i) => setMenu(i)}
                    menu={menu}
                    // onClick={ getList }
                />}}/>
                <Route path="/mealmap" exact component={() => {return <MealMap
                    state={state}
                />}}/>
            </div>
        </div>
    )
}

export default Index;