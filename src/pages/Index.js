import "../css/Index.css";
import { useState, useEffect, useRef, createContext, useCallback, useLayoutEffect } from "react";
import { Route, Link, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// components - etc
import Logo from "../components/Logo";

// components - pages
import Main from "./Index/main";
import MealMap from "./Index/mealmap";


// global functions

import { initMenuN, changeMenuUI, setTitler, getNowInfo, loadList, constant } from "../module/functions";

// ----

function Index({ history }) {

    const { menuList, boxSize } = constant;
    
    // level controller
    const [ title, setTitle ] = useState("");
    
    // state controller
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { menu: { menu, init } } = state;

    // global menu setter

    const setMenu = (i) => {
        dispatch({ type: "prev/LOGPREV", v: window.location.href });
        dispatch({ type: "menu/SETMENU", v: i });
    };

    // menu ui setter

    useEffect(() => {
        console.log(`GLOBAL MENU CHANGED: ${menu}`);
        changeMenuUI(menu, history.push);
    }, [ menu ]);

    // backward event handler

    useEffect(() => {
        // 뒷정리 함수 이용
        return history.listen((location) => {
            if (history.action === "POP") window.location.href = window.location.pathname;
        });
    }, [ history ]);

    useEffect(() => {
        if (!init) {
            // 메인페이지가 아닌 페이지로 처음 들어왔을 경우
            console.log(menu);
            console.log(menu == undefined);
            if (menu == undefined) {
                let isSetted = false;
                for (var i = 0; i < menuList.length; i++) if (menuList[i].route == window.location.pathname) {
                    console.log(`found menu index num: ${i}`);
                    dispatch({ type: "menu/SETMENU", v: i });
                    isSetted = true;
                    break;
                }
                if (!isSetted) dispatch({type: "menu/SETMENU", v: 0});
            }
            changeMenuUI(menu, history.push);
            dispatch({ type: "menu/INITMENU" });
        }
    }, []);

    return (
        <div className="wrapper" id="wrapRef">
            <div className="logoSpace">
                <Logo className="logoMain" onClick={e => setMenu(0)} style={{
                    cursor: menu == 0 ? "default" : "pointer"
                }}/>
                <div className="titlerCover" style={{ top: "250px" }}>
                    <p className="titler" id="titleRef">{title}</p>
                </div>
                {menu > 0 && (menuList[menu].subarea || <></>)}
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