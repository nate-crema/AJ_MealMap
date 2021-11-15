import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from "react-cookie";

// component
// import Pin from "../components/Pin";

// api
import { user } from "../../../apis";

// css
import "../../../css/Login.css";
import "../../../css/Pin.css";

// component
import MobileBtn from "./MobileBtn";

function OnePin({ state, onClick, ref }) {
    
    const [ isActive, setActive ] = state;

    return <div className="one-pin"
        ref={ref}
        onClick={onClick} 
        style={{
            backgroundColor: isActive == 3 ? "#037ac7" : isActive == 2 ? "#006ed38f" : isActive == 1 ? "#008bae30" : "white"
        }}>
            { isActive == 3 && <svg version="1.1" className="sec_svg" id="secsvg_Layer_1" x="0px" y="0px" viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }}>
                    <path style={{
                        fill: "#FFFFFF00",
                        stroke: "white",
                        strokeWidth: "10",
                        strokeLinecap: "round",
                        strokeMiterlimit: "10"
                    }} d="M324.5,172.6l-88.4-44.9c-1.7-0.8-3.6-0.9-5.3,0l-87.1,43.1c-2.2,1.1-3.5,3.3-3.3,5.7
                        c1.9,27.7,16.4,191.2,93.1,191.2c70.4,0,87-115.4,90.7-139.2"/>
                    <path style={{
                        fill: "#FFFFFF00",
                        stroke: "white",
                        strokeWidth: "10",
                        strokeLinecap: "round",
                        strokeMiterlimit: "10"
                    }} d="M202,249.3l27.9,19.2c2,1.4,4.7,0.8,6-1.2l32.4-50.9"/>
                </svg>
            }
    </div>
}


function Pin({ digit = 4, className, style, onEnd = () => {} }) {

    const pinComps = [];
    const [ pin, setPin ] = useState("");
    const [ isIActived, setIActive ] = useState(false);
    const [ isListenAble, setLA ] = useState(false);
    const [ ued, setUED ] = useState(false);

    // pin area clicked handler
    const _oPClickHandler = (e) => {
        setIActive(!isIActived);
    }

    const _pressHandler = (e) => {
        console.log(e.key);
        const npin = !isNaN(e.key*1) ? (pin + e.key) : e.key == "Backspace" ? pin.substr(0, pin.length-1) : pin;
        let active = isIActived;
        setPin(npin);
        if (pin.length == 0 && e.key == "Backspace") active = false;
        if (npin.length >= 4) {
            active = false;
            setTimeout(() => {
                onEnd(npin, () => {});
            }, 300);
        }
        if (active) {
            for (let i = 0; i < npin.length; i++) pinComps[i].state[1](2);
            pinComps[npin.length].state[1](1);
            for (let j = npin.length+1; j < digit; j++) pinComps[j].state[1](0);
            // if (!isListenAble) setLA(true);
        } else {
            if (npin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
            else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
            // if (isListenAble) setLA(false);
        }
        setIActive(active);
    }

    // const _styleHandler = () => {
    //     if (isIActived) {
    //         for (let i = 0; i < pin.length; i++) pinComps[i].state[1](2);
    //         pinComps[pin.length].state[1](1);
    //         for (let j = pin.length+1; j < digit; j++) pinComps[j].state[1](0);
    //         // if (!isListenAble) setLA(true);
    //     } else {
    //         if (pin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
    //         else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
    //         // if (isListenAble) setLA(false);
    //     }
    // }

    useEffect(() => {
        if (isIActived) {
            for (let i = 0; i < pin.length; i++) pinComps[i].state[1](2);
            pinComps[pin.length].state[1](1);
            for (let j = pin.length+1; j < digit; j++) pinComps[j].state[1](0);
            // if (!isListenAble) setLA(true);
        } else {
            if (pin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
            else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
            // if (isListenAble) setLA(false);
        }
    }, [ isIActived ]);

    for (let i = 0; i < digit; i++) {
        pinComps.push(new function () {
            // this.ref = tref;
            // eslint-disable-next-line
            this.state = useState(0); // 0: inactive | 1: inputing | 2: inputed | 3: input_ended_all
            this.comp = <OnePin key={i} state={this.state} onClick={_oPClickHandler} />;
        });
    }


    return <div className={"pinwrap " + (className || "")} style={style} tabIndex="1" onKeyDown={_pressHandler}>
        { pinComps.map(({ comp }) => comp) }
    </div>
}

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
                    if (phRef.current) {
                        phRef.current.style.opacity = 0;
                        phRef.current.style.marginTop = "10px";
                    }
                }, 100);
            }

            // shadow css handler
            e.currentTarget.parentElement.style.boxShadow = "2px 2px 5px rgb(7 83 195 / 50%)";

            // custom function handler
            if (onFocus) onFocus(e);
        }} onBlur={(e) => {
            // placeholder handler
            if (v == "" && phRef.current) {
                phRef.current.style.opacity = 0;
                phRef.current.style.marginTop = "10px";
                setTimeout(() => {
                    if (phRef.current) {
                        phRef.current.style.opacity = 1;
                        phRef.current.style.marginTop = "0px";
                    }
                }, 100);
            }

            // shadow css handler
            e.currentTarget.parentElement.style.boxShadow = null;

            // custom function handler
            if (onBlur) onBlur(e);
        }} />
    </div>
}


function _Login({ location }) {

    // Query Handler

    const query = [];
    if (location.search != "") location.search.replace("?", "").split("&").forEach(v => query[v.split("=")[0]] = decodeURI(v.split("=")[1]));

    // Redux
    const { uinfo } = useSelector(state => state.user);
    const dispatch = useDispatch();

    // display text management

    const [ greeting_a, _setGA ] = useState("식사하셨어요?");
    const [ ment, _setMent ] = useState("전화번호로 로그인");

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
                setMent(`사용자를 찾지 못했습니다.`);
                setLMode(0);
            } else if (login_res == "NPN") {
                setGA("???");
                setMent(`입력하신 전화번호의 형태가 올바르지 않습니다`);
                setLMode(0);
            } else if (login_res == "NPIN") {
                setGA("PIN 오류");
                setMent(`일치하지 않는 PIN입니다. 다시 시도해주세요`);
                console.log(`-------------------`);
                // pinReset();
                setLMode(3);
                setTimeout(() => {
                    setLMode(1);
                }, 10);
            } else {
                console.log(login_res);
                setGA("로그인 완료");
                setMent(`${login_res.res.name}님 안녕하세요!`);
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
            setGA("오류가 발생했습니다.");
            setMent("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
    }

    // set authorize
    const _authReq = async (pin) => {
        try {
            const auth_res = await user.authorize(query.authorize, pin);
            console.log(auth_res);
            setGA("PIN설정 완료.");
            setMent("설정이 완료되었습니다! 잠시 후 로그인창으로 이동합니다");
            setTimeout(() => {
                window.location.href="/login";
            }, 1500);
        } catch(e) {
            console.error(e);
            setGA("오류가 발생했습니다.");
            setMent("오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
    }

    // second enter detect handler
    const _SndEnterDetect = async (e) => {
        if (e.key == "Enter") {
            if (name == "") setMent("이름을 입력해주세요");
            else if (email == "") setMent("이메일을 입력해주세요");
            else if (reged) {
                setGA("이미 가입이 되었어요");
                setMent("발송된 이메일을 확인해주세요!");
            } else {
                // register user
                const reg_res = await user.register(name, pn, email);
                if (reg_res == "AEU") {
                    setGA("Already Exist");
                    setMent("같은 이메일이 이미 등록되어있습니다. 관리자에게 문의하세요.");
                } else if (reg_res == "NEMAIL") setMent("음.. 입력하신 이메일이 아주대 이메일이 아니에요 ㅠ.. 다시 시도해주세요");
                else if (reg_res == "ERROR") setMent("등록중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                else {
                    setReged(true);
                    setGA("이메일 인증을 해주세요!");
                    setMent("재학인증을 위해 이메일로 발송된 링크를 클릭해주세요!");
                    setTimeout(() => {
                        setGA("아주대학교 메일페이지가 열립니다");
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
            setGA("로그인 오류");
            setMent("로그인중 문제가 발생하였습니다. 다시 시도해주세요");
            setTimeout(() => {
                window.localStorage.removeItem('linfo');
                window.location.reload();
            }, 2000);
        } else if (!uinfo?.isOneTime) {
            window.localStorage.setItem('linfo', uinfo.authorize.token);
            dispatch({ type: "user/SETUSER", uinfo });
        } else {
            setGA("안내");
            setMent("로그인 없이 이용하실경우 일부 정보가 표시되지 않을 수 있으며, 새로고침 시 로그아웃됩니다");
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
                setGA("PIN 설정");
                setMent("로그인에 사용할 PIN을 입력해주세요.");
                setLMode(10);
            } else {
                setGA("음.. 뭔가 이상하네요");
                setMent("올바르지 못한 접근경로 입니다.");
                setLMode(-10);
            }
        } else if (query.error) {
            // Login State Handling
            switch(query.error) {
                case "expire":
                    window.localStorage.removeItem('linfo');
                    setGA("로그인 만료");
                    setMent("로그인한지 6시간이 지나 자동으로 로그아웃되었습니다. 다시 로그인해주세요.");
                    break;
                case "error":
                    setGA("로그인 오류");
                    setMent("자동로그인중 문제가 발생하였습니다. 다시 시도해주세요");
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
                <Input type="number" className="pn_input" state={[ pn, setPn ]} placeholder="핸드폰 번호" 
                    onKeyPress={async (e) => {
                        if (e.key == "Enter") {
                            if (pn == "") setMent("전화번호로 로그인");
                            else if (pn.length == 11) {
                                const isexist = await user.isRegistered(pn);
                                console.log(isexist, isexist == "ANE", isexist == "NPN", isexist == undefined);
                                if (isexist == "ANE") {
                                    setGA("어라? 뭔가 이상해요");
                                    setMent("학교이메일로 인증 후 이용해주세요.");
                                } else if (isexist == "NPN") {
                                    setGA("어라? 뭔가 이상해요");
                                    setMent("올바르지 않은 핸드폰번호에요. 다시 입력해주세요");
                                } else if (isexist) {
                                    setGA("안녕하세요! 또 뵙네요 :)");
                                    setMent("PIN입력을 완료하여 로그인");
                                    setKey(isexist.key);
                                    setLMode(1);
                                } else if (isexist == undefined) {
                                    setGA("어라? 뭔가 이상해요");
                                    setMent("일시적인 오류가 발생했어요. 잠시 후 다시 로그인해주세요 ㅠㅠ");
                                } else {
                                    setGA("처음뵙네요! 반가워요 :)");
                                    setMent("가입을 위해 아래에 이름과 아주대 이메일을 입력해주세요!");
                                    setLMode(2);
                                }
                            } else setMent("전화번호를 11자리 모두 입력해주세요");
                        }
                    }}
                    onBlur={() => {
                        if (pn != "") setMent("전화번호 입력이 끝나셨다면 엔터를 눌러주세요!");
                    }}
                />
                <span className="skip-login" onClick={_skipLogin}>로그인없이 사용하시겠어요? {">"}</span>
            </>
            }
            { lmode == 1 && <Pin className="pin_input" onEnd={_loginReq}/> }
            { lmode == 2 && <>
                <Input type="text" className="name_input" state={[ name, setName ]} placeholder="이름 (실명)" onKeyPress={_SndEnterDetect}/>
                <Input type="text" className="email_input" state={[ email, setEmail ]} placeholder="학교 이메일 (@ajou.ac.kr)" onKeyPress={_SndEnterDetect}/>
            </> }
            { lmode == 10 && <Pin className="pin_input" onEnd={_authReq}/> }
        </div>
    </div>
}


function Login({ bottomCompHandler }) {

    const [ pn, setPn ] = useState("");
    const [ key, setKey ] = useState("");
    const [ department, setDP ] = useState("");

    const [ cookies, setCookie, removeCookie ] = useCookies(['x-access-meal-jwt']);

    const ments = [
        "로그인하면 다양한 기능을 사용할 수 있어요",
        "환영합니다! 아대밀맵 입니다 ;)",
        "안녕하세요! PIN을 입력해 로그인을 완료해주세요 :)",
    ];
    const mentRef = useRef(<></>);
    const [ stage, setStage ] = useState(0);
    const [ ment, _setMent ] = useState(ments[stage]);
    const setMent = function(v) {
        if (mentRef.current) {
            mentRef.current.style.opacity = 0;
            mentRef.current.style.marginTop = "10px";
            setTimeout(() => {
                _setMent(v);
                setTimeout(() => {
                    if (mentRef.current) {
                        mentRef.current.style.opacity = 1;
                        mentRef.current.style.marginTop = "0px";
                    }
                }, 100);    
            }, 200);
        } else _setMent(v);
    }

    useEffect(() => {
        if (stage == 3) bottomCompHandler("45%");
        else {
            setMent(ments[stage]);
            if (stage > 0) bottomCompHandler("30%");
        }
    }, [ stage ]);

    const dispatch = useDispatch();

    // check id validity & set encryption key
    const _chkIdValid = async () => {
        const { isRegistered, RESPONSE: { ANE, NPN } } = user;
        const isexist = await isRegistered(pn);

        if (typeof isexist == "object" && isexist?.key && isexist.res) {
            // pn exists
            setKey(isexist?.key);
            setStage(2);
        } else switch(isexist) {
            case ANE:
                // Email verification not ended
                setMent("이메일인증이 아직 완료되지 않았어요. 인증여부를 확인해주세요.");
                break;
            case NPN:
                // Invalid PN
                setMent("번호형식이 올바르지 않아요. 010으로 시작하는 13자리 번호를 입력해주세요.");
                setPn("");
                break;
            case false:
                // Not Found
                setMent("사용자를 찾을 수 없어요. 다시 확인해주세요.");
                setPn("");
                break;
            default:
                // Tmp error
                setMent("일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
            }
    }

    // login handler
    const _login = async (pin) => {
        const { login, RESPONSE: { UNF, NPN, NPIN } } = user;

        const login_res = await login(pn, pin, key);
        
        if (typeof login_res == "object" && login_res?.res) {
            // logined
            console.log(login_res);
            setMent(`${login_res?.res?.name}님 안녕하세요!<br/>오늘도 즐거운 식사 하세요 ;)`);
            setDP(`${login_res?.res?.college?.ko} ${login_res?.res?.major?.ko}`);
            setStage(3);
            setTimeout(() => {
                _setSession({
                    isLogined: true,
                    isOneTime: false,
                    name: login_res?.res?.name,
                    department: login_res?.res?.college?.ko,
                    major: login_res?.res?.major?.ko,
                    pn: login_res?.res?.pn,
                    authorize: login_res.res.authorize
                })
            }, 1500);
        } else switch(login_res) {
            case UNF: setMent("사용자를 찾을 수 없어요. 다시 시도해주세요."); break;
            case NPN: setMent("올바르지 않은 전화번호에요. 다시 시도해주세요."); break;
            case NPIN: setMent("PIN이 올바르지 않아요. 다시 시도해주세요."); break;
            default: setMent("알 수 없는 오류가 발생했어요. 다시 시도해주세요."); break;
        }
    }
    
    // session setter

    useEffect(() => {
        console.log("cookies", cookies);
        // removeCookie("x-access-meal-jwt");
    }, [cookies]);
      
    const _setSession = async (uinfo) => {
        window.localStorage.setItem('linfo', uinfo.authorize.token);
        setCookie("x-access-meal-jwt", uinfo.authorize.token, {
            expires: new Date(uinfo.authorize.exp),
            // domain: "ajoumeal.com",
            // secure: true
            // httpOnly: true
        });
        dispatch({ type: "user/SETUSER", uinfo });
    }

    return <div className="login-cover">
        <span className="title">로그인</span>
        <span className="ment" ref={mentRef}>{ ment.split("<br/>").map(v => <>{v}<br/></>) }</span>
        {
            (stage == 0) ? <MobileBtn text="지금 로그인" className="go-login-btn" type="0" action={() => setStage(1)}/>
            : (stage == 1) ? <div className="login-form" style={{
                animationName: "reveal"
            }}>
                <Input type="number" className="pn_input" state={[ pn, setPn ]} placeholder="핸드폰 번호" 
                    onKeyPress={async (e) => {
                        if (e.key == "Enter") {
                            if (pn == "") setMent("전화번호로 로그인");
                            else if (pn.length !== 11) setMent("전화번호를 11자리 모두 입력해주세요");
                        }
                    }}
                    onBlur={() => {
                        if (pn.length !== 11) setMent("전화번호를 11자리 모두 입력해주세요");
                        else setMent("아래 로그인 버튼을 눌러 로그인을 완료하세요");
                    }}
                />
            </div>
            : (stage == 2) ? <div className="login-form" style={{
                animationName: (stage == 2) ? "reveal" : ""
            }}>
                <Pin className="pin_input" onEnd={_login}/>
            </div>
            : (stage == 3) && <div className="login-confirm" style={{
                animationName: (stage == 3) ? "reveal" : "",
                animationDelay: (stage == 3) ? "5s" : ""
            }}>
                <span className="is-confirmed">로그인 승인</span>
                <span className="department">{department}</span>
            </div>
        }
        {
            (stage == 1 && pn.length == 11) && <MobileBtn text="로그인" className="go-login-btn" type="0" action={_chkIdValid}/>
        }
    </div>;

}

export default Login;