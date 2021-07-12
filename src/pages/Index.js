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

import Filter from "../components/Filter";

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
    const init = useState(false);
    
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { def: { blocks, boxSize, size, prev }, menu: { menu } } = state;

    const setMenu = (i) => {
        dispatch({ type: "prev/LOGPREV", v: window.location.href });
        dispatch({ type: "menu/SETMENU", v: i });
    };

    useEffect(() => {
        console.log(`GLOBAL MENU CHANGED: ${menu}`);
        changeMenuUI(menu, history.push, state);
    }, [ menu ]);

    // backward event handler

    useEffect(() => {
        // 뒷정리 함수 이용
        return history.listen((location) => {
          if (history.action === "POP") {
            window.location.href = window.location.pathname;
          }
        });
      }, [ history ]);

    return (
        <div className="wrapper" id="wrapRef">
            <div className="logoSpace">
                <Logo className="logoMain" onClick={e => setMenu(0)} style={{
                    cursor: menu == 0 ? "default" : "pointer"
                }}/>
                <div className="titlerCover" style={{ top: "250px" }}>
                    <p className="titler" id="titleRef">{title}</p>
                </div>
                {menu > 0 && (blocks[menu-1].subarea || <></>)}
            </div>
            <div className="serviceSpace">
                <Route path="/" exact component={() => {return <Main
                    changeMenuUI={(i) => setMenu(i)}
                    init={init}
                />}}/>
                <Route path="/mealmap" exact component={() => {return <MealMap 
                    init={init}
                />}}/>
            </div>
        </div>
    )
}

export default Index;