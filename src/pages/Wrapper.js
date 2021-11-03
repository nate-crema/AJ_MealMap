import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// css
import "../css/Wrapper.css";
import "../css/Global.css";

// menu component
import MenuBar from "../components/MenuBar";
import Notification from "../components/Notification";

import { MobileTop, MobileBottom } from "../components/Mobile";

// page component
// import Index from "./Index";
// import Login from "./Login";
// import Mealmap from "./Mealmap";
// import NFOUND from "./404";

import MobileHandler from "../components/MobileHandler";
import Map from "../components/Map";

// api
import { user, shop } from "../apis";

// Design Wrapper

function Wrapper({ history, location }) {

    // global state controller

    const g_state = useSelector(state => state);
    const dispatch = useDispatch();

    // Control Area Reference

    const ctrl_ref = useRef(false);

    // Handling Design

    const [ width, setWidth ] = useState(window.innerWidth);
    const [ height, setHeight ] = useState(window.innerHeight);
    const logo_ref = useRef(null);

    useEffect(() => {
        const onResizeHandler = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener("resize", onResizeHandler);
        return () => window.removeEventListener("resize", onResizeHandler);
    }, []);

    // ROUTING |-------------

    // Handling Route

    const route_table = [
        { path: "/login", menu_index: 0 },
        { path: "/", menu_index: 1 },
        { path: "/search", menu_index: 2 },
        { path: "/route", menu_index: 3 },
        { path: "/review", menu_index: 4 },
        { path: "/register", menu_index: 5 },
        { path: "/", menu_index: -100 },
    ]

    const { menu: { menu, mopen }, user: { uinfo } } = g_state;
    const setMenu = (menu) => dispatch({ type: "menu/SETMENU", menu });

    const [ inited, setInitialized ] = useState(false);

    history.listen((history, action) => {
        console.log(`history changed`);
        // console.log(history, window.location, location, action);
    })

    useEffect(() => {
        // console.log(`location`, window.location, location);
        if (!inited) {
            console.log("INITIALIZING");
            // initialized
            const go_menu = route_table.find((e, i) => e.path == window.location.pathname);
            console.log("go_menu", go_menu);
            if (go_menu) {
                if (go_menu.menu_index >= 2 && go_menu.menu_index <= route_table.length-2) dispatch({ type: "menu/SETMOPEN", mopen: true });
                else dispatch({ type: "menu/SETMOPEN", mopen: false });
                setMenu(go_menu.menu_index);
            } else console.log(`DIRECTORY NOT FOUND: ${window.location.pathname}`);
        } else {
            // dom re-render
            const go_menu = route_table.find((e, i) => e.menu_index == menu);
            if (go_menu && go_menu.path != window.location.pathname) {
                console.log(`path not match: history push`, go_menu.path);
                if (go_menu.menu_index >= 2 && go_menu.menu_index <= route_table.length-2) dispatch({ type: "menu/SETMOPEN", mopen: true });
                else dispatch({ type: "menu/SETMOPEN", mopen: false });
                history.push(go_menu.path);
            } else if (!go_menu) {
                console.log(`DIRECTORY NOT FOUND: ${window.location.pathname}`);
                setMenu(-100);
            } else if (menu == -100) {
                window.location.href = "/not_found";
            }
        }
    }, [ menu ]);

    useEffect(() => setInitialized(true), [ ]);

    // Handling Login

    /*

    useEffect( async () => {
        console.log("uinfo changed", uinfo, window.location.pathname);
        if (window.location.pathname == "/login" && uinfo.isLogined) setMenu(1);
        else if (!uinfo.isLogined && window.localStorage.getItem('linfo')) {
            // Login State Handling
            try {
                const uinfo = await user.isValidAuthToken(window.localStorage.getItem('linfo'));
                if (uinfo?.res?.authorize?.token) {
                    window.localStorage.setItem('linfo', uinfo.res.authorize.token);
                    dispatch({ type: "user/SETUSER", uinfo: {
                        ...uinfo.res,
                        authorize: null, 
                        isLogined: true,
                        isOneTime: false
                    } });
                }
                else throw new Error();
            } catch(e) {
                console.error(e);
                // if (e?.response?.data == "Login Expired") window.location.href = "/login?error=expire";
                // else window.location.href = "/login?error=error";
            }
        } else if (!uinfo.isLogined && window.location.pathname != "/login") setMenu(0);
    }, [ uinfo, window.location.pathname ]);

    */

    // ROUTING |-------------

    // MAP |-----------

    useEffect(() => {
        if ( menu == 5 ) dispatch({ type: "map/SETLIST", list: [] });
        else {
            dispatch({ type: "map/SETLIST", list: [] });
            setTimeout(() => {
                shop.getShopList()
                .then((list) => {
                    console.log('list', list);
                    dispatch({ type: "map/SETLIST", list });
                })
                .catch(e => console.error(e));
            }, 150);
        }
    }, [ menu ]);

    // MAP |-----------


    return (
        <>
            <div className="wrap">
                {
                    (width > 800) ? <>
                        <Notification/>
                        <MenuBar/>
                    </> : <>
                        <MobileTop width={width} height={height}/>
                        <MobileBottom width={width} height={height}/>
                    </>
                }
                <div className="map_service" style={{
                    width: (!(width > 800)) && "100%",
                    left: (!(width > 800)) && "0",
                }}>
                    <MobileHandler width={width} height={height}>
                        <Map
                            location={{
                                lat: 37.27983974701925,
                                long: 127.04362143912854
                            }}
                        />
                    </MobileHandler>
                </div>
            </div>
            {/* <div className="wrap"
                current-menu={menu}
            >
                <div className="logoArea" ref={logo_ref}>
                    <Logo className="logoComp" onClick={() => setMenu(1)}></Logo>
                    <div className="ctrlArea" ref={ctrl_ref}></div>
                </div>
                <Router>
                    <TransitionGroup className="routeTransition">
                        <CSSTransition 
                            classNames="routerFade"
                            key={location.key} 
                            timeout={ width > 1500 ? { enter: 450, exit: 450 } : { enter: 1000, exit: 500 }}
                        >
                            <Switch location={location}>
                                { 
                                    route_table.map(({ path, comp }, i) => 
                                        <Route
                                            key={i}
                                            path={path} 
                                            component={comp} 
                                            exact={ ( i < route_table.length-1 ) }
                                            onChange={_designHandler} 
                                            onEnter={_designHandler}
                                        />
                                    )
                                }
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                </Router>
            </div> */}
        </>
    )
}

export default withRouter(Wrapper);