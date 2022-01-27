import { useEffect, useState, useRef, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import io from "socket.io-client";

// css
import "../css/Wrapper.css";
import "../css/Global.css";

// menu component
import MenuBar from "../components/MenuBar";
import Notification from "../components/Notification";

import { MobileTop } from "../mobile/components/header/MobileTop";
import { MobileBottom } from "../mobile/components/footer/MobileBottom";
import LeftMenu from "../mobile/components/leftside/LeftMenu";
import Record from "../mobile/components/submenu/Record";
import Manage from "../mobile/components/submenu/Manage";

import MobileHandler from "../mobile/components/MobileHandler";
import Map from "../components/Map";

// api
import { user, shop } from "../apis";

// Design Wrapper

function Wrapper({ history, location }) {

    // global state controller

    const g_state = useSelector(state => state);
    const dispatch = useDispatch();

    const ctrl_ref = useRef(false); // Control Area Reference

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

    const router = [
        { // menu id: 0
            name: "main",
            url: "/",
            mobile_comp: { mode: null }
        },
        { // menu id: 1
            name: "friend",
            url: "/friend",
            mobile_comp: { mode: "friend" }
        },
        { // menu id: 2
            name: "route",
            url: "/route",
            mobile_comp: { mode: "route" }
        },
        { // menu id: 3
            name: "review",
            url: "/review",
            mobile_comp: { mode: "review" }
        },
        { // menu id: 4
            name: "search",
            url: "/search",
            mobile_comp: { mode: "search" }
        },
        { // menu id: 5
            name: "nearby",
            url: "/nearby",
            mobile_comp: { mode: "nearby" }
        },
        { // menu id: 6
            name: "meeting manage",
            url: "/manage/meeting",
            mobile_comp: { mode: "[sub].manage.meeting" }
        }
    ]

    const { menu: { menu, mopen }, user: { uinfo }, socket: { socket } } = g_state;
    const setMenu = (menu) => {
        console.log(router[menu]);
        if (!router[menu]) return;
        dispatch({ type: "menu/SETMENU", menu });
        dispatch({ type: "mobile/SETCOMP", comp: router[menu].mobile_comp });
    };

    const _routeChangeHandler = (history, action) => {
        console.log(`history changed`);
        const routed_urls = router.map(v => v.url);
        // console.log(history);
        if (routed_urls.includes(history.pathname)) 
            setMenu(routed_urls.indexOf(history.pathname));
        // console.log(history, window.location, location, action);
    };
    
    useEffect(() => {
        _routeChangeHandler({ pathname: window.location.pathname })
    }, [ window.location.href ])

    // routing state assign
    useEffect(() => {
        history.push(window.location.pathname);
    }, [ ]);

    // connect with socket server

    const connectSocket = ( url ) => { 
        const new_socket = io(url);
        dispatch({ type: "socket/SETSOCKET", socket: new_socket });
    }

    useEffect(() => {
        let socketurl;
        if ( process.env.NODE_ENV === "development" ) socketurl = "localhost:3001";
        else socketurl = "api.ajoumeal.com";
        
        if ( !socket ) setTimeout(() => connectSocket( socketurl ), 100);
    }, []);

    

    // Handling Login

    useEffect( () => {
        console.log("uinfo changed", uinfo, window.location.pathname);

        // recover login state
        if (!uinfo || !uinfo.isLogined) user.isValidAuthToken()
            .then(({res}) => {
                if (res && res.authorize) dispatch({ type: "user/SETUSER", uinfo: {
                    isLogined: true,
                    isOneTime: false,
                    name: res?.uinfo?.name,
                    department: res?.uinfo?.college?.ko,
                    major: res?.uinfo?.major?.ko,
                    pn: res?.uinfo?.pn,
                    img: res?.uinfo?.img,
                    authorize: res.authorize
                } })
                else throw new Error();
            })
            .catch(e => console.error(e));

    }, [ uinfo, window.location.pathname ]);

    // ROUTING |-------------

    // MAP |-----------

    // useEffect(() => {
    //     if ( menu == 5 ) dispatch({ type: "map/SETLIST", list: [] });
    //     else {
    //         dispatch({ type: "map/SETLIST", list: [] });
    //         setTimeout(() => {
    //             shop.getShopList()
    //             .then((list) => {
    //                 console.log('list', list);
    //                 dispatch({ type: "map/SETLIST", list });
    //             })
    //             .catch(e => console.error(e));
    //         }, 150);
    //     }
    // }, [ menu ]);

    // MAP |-----------


    return (
        <>
            <div className="wrap">
                {
                    (width > 800) ? <>
                        {/* <Notification/>
                        <MenuBar/> */}
                    </> : <>
                        <MobileTop width={width} height={height}/>
                        <LeftMenu width={width} height={height}/>
                        <MobileBottom width={width} height={height} history={history}/>
                        <Switch>
                            <Route
                                key="record"
                                path="/record"
                                render={() => <>
                                    <Record history={ history }/>
                                </>}
                            />
                            <Route
                                key="manage"
                                path="/manage"
                                render={() => <>
                                    <Manage history={ history }/>
                                </>}
                            />
                        </Switch>
                    </>
                }
                <div className="map_service" style={{
                    width: (!(width > 800)) && "100%",
                    left: (!(width > 800)) && "0",
                }}>
                    <MobileHandler width={width} height={height} history={history}>
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