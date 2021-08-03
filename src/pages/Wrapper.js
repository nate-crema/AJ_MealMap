import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";

// css
import "../css/Wrapper.css";

// component
import Index from "./Index";
import Login from "./Login";
import Mealmap from "./Mealmap";
import NFOUND from "./404";

// design assets
import Logo from "../components/Logo";

// api resource
import json from "../keys/api.json";

// map api import

function MAPIMPORT() {
    const APIKEY = json.kakao.web;

    useEffect(() => {

        const scriptMapBase = document.createElement('script');
        scriptMapBase.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIKEY}&autoload=false`;
        scriptMapBase.async = false;
        document.body.appendChild(scriptMapBase);

        const scriptMapLib = document.createElement('script');
        scriptMapLib.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIKEY}&libraries=services,clusterer,drawing&autoload=false`;
        scriptMapLib.async = false;
        document.body.appendChild(scriptMapLib);

        return () => {
            document.body.removeChild(scriptMapBase);
            document.body.removeChild(scriptMapLib);
        }

    }, []);

    return <></>
}

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
    const [ css, setCss ] = useState({
        wrap: {},
        logo_loc: {
            left: null,
        },
    });

    function _designHandler(e) {
        console.log(`width: ${ window.innerWidth } | height: ${ window.innerHeight }`)
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

        let updateCss = css;

        if (isMobile()) {
            
            // style option initialize
            updateCss.logo_loc.height = null;
            updateCss.logo_loc.top = null;
            updateCss.logo_loc.width = null;
            setCss(updateCss);


        } else {
            if (window.location.pathname == "/") {
                // logo position change
                updateCss.logo_loc.height = null;
                updateCss.logo_loc.top = null;
                setCss(updateCss);
                setTimeout(() => {
                    updateCss.logo_loc.width = null;
                    // updateCss.logo_loc.height = "80%";
                    setCss(updateCss);
                }, 150);
                // updateCss.logo_loc.left = "50%";
                // updateCss.logo_loc.transform = "translate(-50%, -50%)";
                
            } else {
                // logo position change
                updateCss.logo_loc.width = "300px";
                setCss(updateCss);
                setTimeout(() => {
                    updateCss.logo_loc.height = "80%";
                    updateCss.logo_loc.top = "30%";
                    // updateCss.logo_loc.height = "80%";
                    setCss(updateCss);
                }, 150);
                // updateCss.logo_loc.left = "0";
                // updateCss.logo_loc.transform = "translate(0, -50%)";
            }
        }

    }

    // Handling Route

    const route_table = [
        {
            path: "/",
            comp: Index,
            menu_index: 0
        },
        {
            path: "/login",
            comp: Login,
            menu_index: 1
        },
        {
            path: "/mealmap",
            comp: Mealmap,
            menu_index: 2
        },
        {
            path: "/",
            comp: NFOUND,
            menu_index: -100
        },
    ]

    const { menu: { menu } } = g_state;
    const setMenu = (menu) => dispatch({ type: "menu/SETMENU", menu });

    const [ inited, setInitialized ] = useState(false);

    history.listen((history, action) => {
        console.log(`history changed`);
        console.log(history, window.location, location, action);
        _designHandler();
    })

    useEffect(() => {
        // console.log(`location`, window.location, location);
        if (!inited) {
            console.log("INITIALIZING");
            // initialized
            const go_menu = route_table.find((e, i) => e.path == window.location.pathname);
            // console.log("go_menu", go_menu);
            if (go_menu) setMenu(go_menu.menu_index);
            else console.log(`DIRECTORY NOT FOUND: ${window.location.pathname}`);
        } else {
            // dom re-render
            const go_menu = route_table.find((e, i) => e.menu_index == menu);
            if (go_menu && go_menu.path != window.location.pathname) {
                console.log(`path not match: history push`, go_menu.path);
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

    // Handling Window Size

    function isMobile() {
        // REFERENCE: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
        let check = false;
        // eslint-disable-next-line
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

        if (window.innerWidth < 1500) check = true;

        return check;
    }

    useEffect(() => {
        // wrap_grid control

        if (isMobile()) {

        } else {

        }


    }, [ width, height ]);

    useEffect(() => {
        _designHandler();
        window.addEventListener("resize", _designHandler);
        return () => window.removeEventListener("resize", _designHandler);
    }, []);

    return (
        <>
            <MAPIMPORT/>
            <div className="wrap"
                style={{ ...css.wrap }}
                current-menu={menu}
            >
                <div className="logoArea" style={{ ...css.logo_loc }}>
                    <Logo className="logoComp" onClick={() => setMenu(0)}></Logo>
                    <div className="ctrlArea" ref={ctrl_ref}></div>
                </div>
                <Router>
                    <TransitionGroup className="routeTransition">
                        <CSSTransition 
                            classNames="routerFade"
                            key={location.key} 
                            timeout={ width > 1500 ? { enter: 200, exit: 200 } : { enter: 1000, exit: 1000 }}
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
            </div>
        </>
    )
}

export default withRouter(Wrapper);