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

    const { menu: { menu, mopen }, user: { uinfo } } = g_state;
    const setMenu = (menu) => dispatch({ type: "menu/SETMENU", menu });

    const [ inited, setInitialized ] = useState(false);

    history.listen((history, action) => {
        console.log(`history changed`);
        // console.log(history, window.location, location, action);
    })

    useEffect(() => setInitialized(true), [ ]);

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
                    </> : <Router>
                        <MobileTop width={width} height={height}/>
                        <LeftMenu width={width} height={height}/>
                        <MobileBottom width={width} height={height}/>
                        <Switch>
                            <Route
                                key="record"
                                path="/record"
                                render={() => <>
                                    <Record/>
                                </>}
                            />
                            <Route
                                key="manage"
                                path="/manage"
                                render={() => <>
                                    <Manage/>
                                </>}
                            />
                        </Switch>
                    </Router>
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