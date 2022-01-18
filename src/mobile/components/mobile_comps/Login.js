import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCookie, setCookie } from '../../../connection/cookie';
import { useHistory } from 'react-router-dom';

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


function Pin({ digit = 4, className, style, onEnd = () => {}, onFocus, onBlur, minp }) {

    const pinComps = [];
    const [ pin, setPin ] = useState("");
    const [ isIActived, setIActive ] = useState(false);
    const [ init, setInit ] = useState(false);
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

    useEffect(() => {
        _pressHandler({ key: minp })
    }, [ minp ])

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
        setInit(true);
    }, []);

    useEffect(() => {
        if (isIActived) {
            // start input
            for (let i = 0; i < pin.length; i++) pinComps[i].state[1](2);
            pinComps[pin.length].state[1](1);
            for (let j = pin.length+1; j < digit; j++) pinComps[j].state[1](0);
            if (init && onFocus) onFocus();
            setLA(!isListenAble);
        } else {
            if (pin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
            else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
            if (onBlur) onBlur();
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
            if (onChange) return onChange(e);
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

function Login({ bottomCompHandler, onPinInput, onPinInputEnd, minp, swipeEvent }) {

    const Bcomp = useSelector(state => state.mobile.bottom_comp);
    const history = useHistory();

    // size definition
    const sizes = {
        maximize: "720px",
        sub_maximize: "680px",
        oh_default: "550x",
        default: "400px",
        half_default: "200px",
        quarter_default: "100px",
        minimize: "40px"
    }

    // state definition
    const [ pn, setPn ] = useState("");
    const [ key, setKey ] = useState("");
    const [ department, setDP ] = useState("");

    const [ pin_open, setPinOpen ] = useState(false);

    // global variable handler
    const dispatch = useDispatch();

    // ments handler
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

    // user touch-action handler
    const _swipeDownHandler = () => {
        dispatch({ type: "mobile/SETCOMP", comp: { mode: null } });
    }

    // swipe events: registration
    useEffect(() => {
        swipeEvent.addEventListener("toDown", _swipeDownHandler);
        return () => {
            swipeEvent.removeEventListener("toDown", _swipeDownHandler);
        }
    }, []);

    // user login-state handler
    useEffect(() => {
        switch(stage) {
            case 2:
                // onPinInput();
                if (pin_open) {
                    bottomCompHandler(sizes.maximize);
                    break;
                }
            default:
                onPinInputEnd();
                if (stage != 3) {
                    setMent(ments[stage]);
                    bottomCompHandler(sizes.oh_default);
                } else bottomCompHandler(sizes.default);
                break;
        }
    }, [ stage, pin_open ]);

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
        
        setMent(`정보를 암호화하여 로그인하는 중이에요...`);
        const login_res = await login( pn, pin, key );

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
                    img: login_res?.uinfo?.img,
                    authorize: login_res.res.authorize
                })
                dispatch({ type: "mobile/SETCOMP", comp: { mode: Bcomp.mode === "login" ? { mode: null } : Bcomp.mode } });
            }, 1500);
        } else switch(login_res) {
            case UNF: setMent("사용자를 찾을 수 없어요. 다시 시도해주세요."); break;
            case NPN: setMent("올바르지 않은 전화번호에요. 다시 시도해주세요."); break;
            case NPIN: setMent("PIN이 올바르지 않아요. 다시 시도해주세요."); break;
            default: setMent("알 수 없는 오류가 발생했어요. 다시 시도해주세요."); break;
        }
    }
    
    // session setter

    // useEffect(() => {
    //     console.log("cookies", cookies);
    //     // removeCookie("x-access-meal-jwt");
    // }, [cookies]);
      
    const _setSession = async (uinfo) => {
        window.localStorage.setItem('linfo', uinfo.authorize.token);
        // setCookie("x-access-meal-jwt", uinfo.authorize.token, {
        //     expires: new Date(uinfo.authorize.exp),
        //     // domain: "ajoumeal.com",
        //     // secure: true
        //     httpOnly: true
        // });
        dispatch({ type: "user/SETUSER", uinfo });
    }

    // pin active checker
    useEffect(() => {
        console.log("pin_open", pin_open);
        if (pin_open) onPinInput();
        else onPinInputEnd();
    }, [ pin_open ]);

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
            : (stage == 2) ?<div className="login-form" style={{
                    animationName: (stage == 2) ? "reveal" : ""
                }}>
                    <Pin className="pin_input" onEnd={_login} onFocus={() => setPinOpen(true)} onBlur={() => setPinOpen(false)} minp={minp[0]}/>
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