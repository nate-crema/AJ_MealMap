import { useState, useEffect, useRef } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";

// component
import Pin from "../components/Pin";

// api
import { user } from "../apis";

// css
import "../css/Login.css";


function Input({ type, placeholder, className, state: [ v, setV ], onChange, onFocus, onBlur, onKeyPress }) {

    const inpRef = useRef(<></>);
    const phRef = useRef(<></>);

    return <div className={"inp_cover " + (className || "")} onClick={(e) => inpRef.current.focus()} >
        <span ref={phRef} className="placeholder" id="inp_placeholder" onClick={(e) => inpRef.current.focus()}>{ placeholder || "" }</span>
        <input ref={inpRef} type={type} value={v} onKeyPress={onKeyPress} onChange={(e) => {
            setV(e.target.value);
            if (onChange) onChange(e);
        }} onFocus={(e) => {
            if (v == "") {
                // placeholder handler
                phRef.current.style.opacity = 1;
                phRef.current.style.marginTop = "0px";
                setTimeout(() => {
                    phRef.current.style.opacity = 0;
                    phRef.current.style.marginTop = "10px";
                }, 100);
            }

            // shadow css handler
            e.currentTarget.parentElement.style.boxShadow = "2px 2px 5px rgb(7 83 195 / 50%)";

            // custom function handler
            if (onFocus) onFocus(e);
        }} onBlur={(e) => {
            // placeholder handler
            if (v == "") {
                phRef.current.style.opacity = 0;
                phRef.current.style.marginTop = "10px";
                setTimeout(() => {
                    phRef.current.style.opacity = 1;
                    phRef.current.style.marginTop = "0px";
                }, 100);
            }

            // shadow css handler
            e.currentTarget.parentElement.style.boxShadow = null;

            // custom function handler
            if (onBlur) onBlur(e);
        }} />
    </div>
}


function Login({ location }) {

    // Query Handler

    const query = [];
    if (location.search != "") location.search.replace("?", "").split("&").forEach(v => query[v.split("=")[0]] = decodeURI(v.split("=")[1]));

    // Redux
    const { uinfo } = useSelector(state => state.user);
    const dispatch = useDispatch();

    // display text management

    const [ greeting_a, _setGA ] = useState("???????????????????");
    const [ ment, _setMent ] = useState("??????????????? ?????????");

    const setGA = function(v) {
        if (document.getElementById("greeting")) {
            document.getElementById("greeting").style.opacity = 0;
            document.getElementById("greeting").style.marginTop = "10px";
            setTimeout(() => {
                _setGA(v);
                setTimeout(() => {
                    document.getElementById("greeting").style.opacity = 1;
                    document.getElementById("greeting").style.marginTop = "0px";
                }, 100);    
            }, 200);
        } else _setGA(v);
    }
    const setMent = function(v) {
        if (document.getElementById("ment")) {
            document.getElementById("ment").style.opacity = 0;
            document.getElementById("ment").style.marginTop = "10px";
            setTimeout(() => {
                _setMent(v);
                setTimeout(() => {
                    document.getElementById("ment").style.opacity = 1;
                    document.getElementById("ment").style.marginTop = "0px";
                }, 100);    
            }, 200);
        } else _setMent(v);
    }

    // login state management
    const [ lmode, _setLMode ] = useState(0);
    const [ l_temp_mode, setLMode ] = useState(0);
    const lmodeRef = useRef(<></>);

    useEffect(() => {
        lmodeRef.current.style.opacity = "0";
        setTimeout(() => {
            _setLMode(l_temp_mode);
            setTimeout(() => lmodeRef.current.style.opacity = "1", 10);
        }, 300);
    }, [ l_temp_mode ]);

    // input info
    const [ pn, setPn ] = useState("");
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");

    // login encryption info
    const [ key, setKey ] = useState(null);
    
    // register state manage
    const [ reged, setReged ] = useState(false);

    // skip login
    const _skipLogin = async (e) => {
        return await login({
            isLogined: true,
            isOneTime: true,
            name: undefined,
            email: undefined,
            pn: undefined
        });
    }

    // set login
    const _loginReq = async (pin, pinReset) => {
        if (pn != "" && pin != "") try {
            const login_res = await user.login(pn, pin, key);
            if (login_res == "UNF") {
                setGA("???");
                setMent(`???????????? ?????? ???????????????.`);
                setLMode(0);
            } else if (login_res == "NPN") {
                setGA("???");
                setMent(`???????????? ??????????????? ????????? ???????????? ????????????`);
                setLMode(0);
            } else if (login_res == "NPIN") {
                setGA("PIN ??????");
                setMent(`???????????? ?????? PIN?????????. ?????? ??????????????????`);
                console.log(`-------------------`);
                // pinReset();
                setLMode(3);
                setTimeout(() => {
                    setLMode(1);
                }, 10);
            } else {
                console.log(login_res);
                setGA("????????? ??????");
                setMent(`${login_res.res.name}??? ???????????????!`);
                setTimeout(() => {
                    return login({
                        ...login_res.res,
                        isLogined: true,
                        isOneTime: false
                    });
                }, 1500);
            }
        } catch(e) {
            console.error(e);
            setGA("????????? ??????????????????.");
            setMent("????????? ??????????????????. ????????? ?????? ??????????????????.");
        }
    }

    // set authorize
    const _authReq = async (pin) => {
        try {
            const auth_res = await user.authorize(query.authorize, pin);
            console.log(auth_res);
            setGA("PIN?????? ??????.");
            setMent("????????? ?????????????????????! ?????? ??? ?????????????????? ???????????????");
            setTimeout(() => {
                window.location.href="/login";
            }, 1500);
        } catch(e) {
            console.error(e);
            setGA("????????? ??????????????????.");
            setMent("????????? ??????????????????. ????????? ?????? ??????????????????.");
        }
    }

    // second enter detect handler
    const _SndEnterDetect = async (e) => {
        if (e.key == "Enter") {
            if (name == "") setMent("????????? ??????????????????");
            else if (email == "") setMent("???????????? ??????????????????");
            else if (reged) {
                setGA("?????? ????????? ????????????");
                setMent("????????? ???????????? ??????????????????!");
            } else {
                // register user
                const reg_res = await user.register(name, pn, email);
                if (reg_res == "AEU") {
                    setGA("Already Exist");
                    setMent("?????? ???????????? ?????? ????????????????????????. ??????????????? ???????????????.");
                } else if (reg_res == "NEMAIL") setMent("???.. ???????????? ???????????? ????????? ???????????? ???????????? ???.. ?????? ??????????????????");
                else if (reg_res == "ERROR") setMent("????????? ????????? ??????????????????. ?????? ??? ?????? ??????????????????.");
                else {
                    setReged(true);
                    setGA("????????? ????????? ????????????!");
                    setMent("??????????????? ?????? ???????????? ????????? ????????? ??????????????????!");
                    setTimeout(() => {
                        setGA("??????????????? ?????????????????? ????????????");
                        setTimeout(() => {
                            window.open("https://gmail.com",'_blank');
                        }, 1000);
                    }, 2000);
                }
            }
        }
    }

    // login handling
    const login = async (uinfo) => {
        if (uinfo?.isOneTime !== true && !uinfo?.authorize?.token) {
            setGA("????????? ??????");
            setMent("???????????? ????????? ?????????????????????. ?????? ??????????????????");
            setTimeout(() => {
                window.localStorage.removeItem('linfo');
                window.location.reload();
            }, 2000);
        } else if (!uinfo?.isOneTime) {
            window.localStorage.setItem('linfo', uinfo.authorize.token);
            dispatch({ type: "user/SETUSER", uinfo });
        } else {
            setGA("??????");
            setMent("????????? ?????? ?????????????????? ?????? ????????? ???????????? ?????? ??? ?????????, ???????????? ??? ?????????????????????");
            setTimeout(() => {
                dispatch({ type: "user/SETUSER", uinfo });
            }, 2000);
        }
    }

    useEffect(async () => {
        if (query.authorize) {
            // Authorizing Access handling
            const is_valid = await user.isValidAuthRoute(query.authorize);
            if (is_valid) {
                setGA("PIN ??????");
                setMent("???????????? ????????? PIN??? ??????????????????.");
                setLMode(10);
            } else {
                setGA("???.. ?????? ???????????????");
                setMent("???????????? ?????? ???????????? ?????????.");
                setLMode(-10);
            }
        } else if (query.error) {
            // Login State Handling
            switch(query.error) {
                case "expire":
                    window.localStorage.removeItem('linfo');
                    setGA("????????? ??????");
                    setMent("??????????????? 6????????? ?????? ???????????? ???????????????????????????. ?????? ?????????????????????.");
                    break;
                case "error":
                    setGA("????????? ??????");
                    setMent("?????????????????? ????????? ?????????????????????. ?????? ??????????????????");
                    window.localStorage.removeItem('linfo');
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 500);
                    break;
            }
        }
    }, [ ]);
    
    return <div className="serviceArea loginCover" id="serviceArea" doc-contype="login-content">
        <span className="greeting" id="greeting">{ greeting_a }</span>
        <span className="ment" id="ment">{ ment }</span>
        <div className="lmode-cover" style={{ opacity: 1, marginTop: "0px", transition: "all .23s ease" }} ref={lmodeRef}>
            { lmode == 0 && 
            <>
                <Input type="number" className="pn_input" state={[ pn, setPn ]} placeholder="????????? ??????" 
                    onKeyPress={async (e) => {
                        if (e.key == "Enter") {
                            if (pn == "") setMent("??????????????? ?????????");
                            else if (pn.length == 11) {
                                const isexist = await user.isRegistered(pn);
                                console.log(isexist, isexist == "ANE", isexist == "NPN", isexist == undefined);
                                if (isexist == "ANE") {
                                    setGA("??????? ?????? ????????????");
                                    setMent("?????????????????? ?????? ??? ??????????????????.");
                                } else if (isexist == "NPN") {
                                    setGA("??????? ?????? ????????????");
                                    setMent("???????????? ?????? ?????????????????????. ?????? ??????????????????");
                                } else if (isexist) {
                                    setGA("???????????????! ??? ????????? :)");
                                    setMent("PIN????????? ???????????? ?????????");
                                    setKey(isexist.key);
                                    setLMode(1);
                                } else if (isexist == undefined) {
                                    setGA("??????? ?????? ????????????");
                                    setMent("???????????? ????????? ???????????????. ?????? ??? ?????? ????????????????????? ??????");
                                } else {
                                    setGA("???????????????! ???????????? :)");
                                    setMent("????????? ?????? ????????? ????????? ????????? ???????????? ??????????????????!");
                                    setLMode(2);
                                }
                            } else setMent("??????????????? 11?????? ?????? ??????????????????");
                        }
                    }}
                    onBlur={() => {
                        if (pn != "") setMent("???????????? ????????? ??????????????? ????????? ???????????????!");
                    }}
                />
                <span className="skip-login" onClick={_skipLogin}>??????????????? ?????????????????????? {">"}</span>
            </>
            }
            { lmode == 1 && <Pin className="pin_input" onEnd={_loginReq}/> }
            { lmode == 2 && <>
                <Input type="text" className="name_input" state={[ name, setName ]} placeholder="?????? (??????)" onKeyPress={_SndEnterDetect}/>
                <Input type="text" className="email_input" state={[ email, setEmail ]} placeholder="?????? ????????? (@ajou.ac.kr)" onKeyPress={_SndEnterDetect}/>
            </> }
            { lmode == 10 && <Pin className="pin_input" onEnd={_authReq}/> }
        </div>
    </div>
}

export default Login;