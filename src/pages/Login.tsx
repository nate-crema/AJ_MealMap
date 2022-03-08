import { useState, useEffect, useRef, useCallback, MouseEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/pages/Login.css';
import '@styles/animation/Animate.Logo.css';

// api
import { serviceLogin as serviceLoginAPI, serviceRegister as serviceRegisterAPI } from "../api/auth";

// components
import GlobalInput from "@components/GlobalInput";
import ServiceButton from "@components/ServiceButton";

// interfaces
import { Location } from "@interfaces/recoil/State";
import { Login as LoginType } from "@interfaces/recoil/State";
import { LoginResultsFailedNotFound, ServiceLoginAPIResult } from "@interfaces/api/auth";
import ColDepFloatSelector from "@src/components/Login/ColDepFloatSelector";
type LoginProps = {
    
}



const AnimateLogo: React.FC = () => {
return <div className="welcome-animation">
    <svg className="service-logo" viewBox="0 0 157.363 100.944">
        <g id="Group_535" data-name="Group 535" transform="translate(-270.5 -136.5)">
            <path id="Path_69" data-name="Path 69" d="M148.084,248.173a48.9,48.9,0,1,1,15.153-17.87"
                transform="translate(201.595 -21.52)" fill="none" stroke="#005bae" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="3" />
            <path id="Path_70" data-name="Path 70" d="M145.927,189.285a32.717,32.717,0,1,1-11.956-10.138"
                transform="translate(201.595 -21.52)" fill="none" stroke="#005bae" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="3" />
            <path id="Path_71" data-name="Path 71"
                d="M203.253,186.742a17.816,17.816,0,0,0,2.385-9.18c0-7.607-4.2-13.774-9.373-13.774s-9.374,6.167-9.374,13.774c0,4.106,2.883,9.776,6.95,12.88,2.424,1.85,2.424,5.6,2.424,8.162v51.268"
                transform="translate(201.595 -21.52)" fill="none" stroke="#005bae" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="3" />
            <line id="Line_49" data-name="Line 49" y2="86.084" transform="translate(426.363 142.268)" fill="none"
                stroke="#005bae" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            <line id="Line_50" data-name="Line 50" y2="86.084" transform="translate(421.007 142.268)" fill="none"
                stroke="#005bae" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            <g id="Group_279" data-name="Group 279" transform="translate(201.595 -18.864)">
                <g id="Group_275" data-name="Group 275">
                    <path id="Path_66" data-name="Path 66"
                        d="M132.686,200.485c0,7.35-11.765,29.323-13.308,29.323-1.571,0-13.309-21.973-13.309-29.323a13.309,13.309,0,1,1,26.617,0Z"
                        fill="none" stroke="#005bae" strokeMiterlimit="10" strokeWidth="2" />
                    <circle id="Ellipse_21" data-name="Ellipse 21" cx="7.549" cy="7.549" r="7.549"
                        transform="translate(111.829 192.869)" fill="none" stroke="#005bae" strokeMiterlimit="10"
                        strokeWidth="2" />
                </g>
                <g id="Group_276" data-name="Group 276">
                    <path id="Path_67" data-name="Path 67"
                        d="M117.282,204s-1.622-2.248-1.607-3.043c.014-.7,2.033-3.9,2.511-4.524a.124.124,0,0,1,.2,0,25.534,25.534,0,0,1,2.529,4.477,1.47,1.47,0,0,1-.459.977"
                        fill="none" stroke="#005bae" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.45" />
                    <path id="Path_68" data-name="Path 68"
                        d="M120.119,195.562s3.147,4.46,3.147,5.3c0,.694-1.2,2.37-1.617,2.93a.46.46,0,0,1-.37.185h-1.164a.463.463,0,0,1-.391-.216l-1.6-2.559a.381.381,0,0,1,.03-.445l.634-.766"
                        fill="none" stroke="#005bae" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.45" />
                </g>
            </g>
        </g>
    </svg>
    <footer>
        <span className="service-name">아대밀맵</span>
    </footer>
</div>
}

const Login: React.FC<LoginProps> = ({  }) => {


    // stage control
    const [ stage, setStage ] = useState( 0 );
    const [ login, setLogin ] = useRecoilState<LoginType>( states.login );
    
    const [ title, setTitleText ] = useState<string>( "재학생 로그인" );
    const [ ment, setMentText ] = useState<string>( "아주대학교 재학생만 이용할 수 있어요\n이메일과 이름으로 로그인 해주세요" );
    
    const [ onTitleDisplay, setOnTitleDisplay ] = useState<boolean>( true );
    const [ onMentDisplay, setOnMentDisplay ] = useState<boolean>( true );

    const [ init, setInit ] = useState<boolean>( false );

    const [ stage_display, setStageDisplay ] = useState<boolean>( true );
    const [ button_display, setButtonDisplay ] = useState<boolean>( false );

    const setTitle = ( value: string ) => {
        setOnTitleDisplay( false );
        setTimeout(() => {
            setTitleText( value );
            setOnTitleDisplay( true );
        }, 300);
    };

    const setMent = ( value: string ) => {
        setOnMentDisplay( false );
        setTimeout(() => {
            setMentText( value );
            setOnMentDisplay( true );
        }, 300);
    };

    const setStageWithTexts = ( stage: number ) => {
        setStageDisplay( false );
        setTimeout(() => {
            setStage( stage );
            switch( stage ) {
                case 0:
                    setTitle( "재학생 로그인" );
                    setMent( "아주대학교 재학생만 이용할 수 있어요\n이메일과 이름으로 로그인 해주세요" );
                    break;
                case 2:
                    setTitle("로그인 실패");
                    setMent(`${ name }님의 계정을 확인하지 못했어요`);
                    break;
                case 3:
                    setTitle("회원가입");
                    setMent(`재학중이신 단과대학과 학과를 선택해주세요`);
                    break;
                case 4:
                    setTitle("회원가입");
                    setMent(`${ name }님의 계정으로 방금 인증번호 메일을 보냈어요!\n인증번호를 확인해 입력해주세요.`);
                    break;
            }
            setTimeout(() => {
                setStageDisplay( true );
            }, 200);
        }, 100);
    }

    useEffect(() => {
        setTimeout(() => setInit(true), 2200)
    }, []);
    
        
    // value input control
    const [ globalInputPhWidth, setGlobalInputPhWidth ] = useState<string>( "120px" );
    const [ globalInputFocus, setGlobalInputFocus ] = useState<boolean>( false );
    const [ globalInputChangeable, setGlobalInputChangeable ] = useState<boolean>( true );

    const [ namePhWidth, setNamePhWidth ] = useState<string>( "35px" );
    const [ nameFocus, setNameFocus ] = useState<boolean>( false );
    const [ nameChangeable, setNameChangeable ] = useState<boolean>( true );

    const [ authCodePhWidth, setAuthCodePhWidth ] = useState<string>( "65px" );
    const [ authCodeFocus, setAuthCodeFocus ] = useState<boolean>( false );
    const [ authCodeChangeable, setAuthCodeChangeable ] = useState<boolean>( true );

    const name = useRecoilValue<string>( states.name );
    const emailId = useRecoilValue<string>( states.emailId );
    const [ authCode, setAuthCode ] = useState<string>( "" );

    useEffect(() => {
        if ( stage === 0 ) {
            if ( name.length === 0 || emailId.length === 0 ) return setButtonDisplay( false );
            return setButtonDisplay( true );
        }
    }, [ stage, name, emailId ]);

    
    // user location control
    const [ location, setLocation ] = useState<Location>();

    const userLocationAPISucceed = ( position: GeolocationPosition ) => {
        setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
            address: ""
        })
    }

    useEffect(() => {
        if ( !window.navigator.geolocation ) return;
        window.navigator.geolocation.getCurrentPosition( userLocationAPISucceed, null, {
            enableHighAccuracy: true
        } );
    }, []);


    // button clicks control
    const loginClickHandler = useCallback( async ( e: MouseEvent ) => {
        e.stopPropagation();
        setButtonDisplay( false );
        if ( stage === 0 ) {
            const login_result: ServiceLoginAPIResult = await serviceLoginAPI( emailId, name );
            console.log(login_result);
            if ( login_result.result === "Logined" ) {
                setLogin({
                    isLogined: true,
                    name: login_result.userinfo.name,
                    emailId,
                    expires: new Date(login_result.expires)
                })
                setStage(200);
            } else if ( login_result.result === "Pending" ) {
                setStage(100);
            } else if ( login_result.result === "Failed" ) {
                if ( login_result.reason === LoginResultsFailedNotFound ) {
                    setStageWithTexts(2);
                }
            }
        }
    }, [ stage, emailId, name ]);

    const reloginClickHandler = () => {
        setStageWithTexts(0);
    };

    const registerMoverClickHandler = () => {
        // serviceRegisterAPI( location );
        setStageWithTexts(3);
    };

    const registerClickHandler = () => {

    }

    // register click control
    

    

    return <>
        <span className="catch-phrase">아주대학교 밥집지도<br/>아대밀맵</span>
        <AnimateLogo/>
        <div className="login-contents" style={{ animation: init ? "none" : "" }}>
            <span className="stage-title" style={{ opacity: onTitleDisplay ? 1 : 0 }}>{ title }</span>
            <div className="stage-ment" style={{
                height: `${ 20 * ment.split("\n").length }px`
            }}>{ ment.split("\n").map( ment_line => <>
                <p style={{ opacity: onMentDisplay ? 1 : 0 }}>{ ment_line }</p>
            </> ) }</div>
            <div className={ 
                "stage-rendering"
                + ( ( stage_display === true ) ? " stage-fade-in" : " stage-fade-out" )
                + ( ( button_display === true ) ? " button-display" : "" )
            }>
                {
                    ( stage === 0 ) ? <>
                        <GlobalInput
                            placeholder="아주대학교 이메일"
                            onInputDisplayText="@ajou.ac.kr"
                            value="emailId"
                            className={ "portal-id-input" }

                            phWidth={ [ globalInputPhWidth, setGlobalInputPhWidth ] }
                            focusState={ globalInputFocus }

                            type="text"
                            changeable={ globalInputChangeable }
                        />
                        <GlobalInput
                            placeholder="이름"
                            value="name"
                            className={ "name-input" }

                            phWidth={ [ namePhWidth, setNamePhWidth ] }
                            focusState={ nameFocus }

                            type="text"
                            changeable={ nameChangeable }
                        />
                    </> : ( stage === 1 ) ? <>
                        <GlobalInput
                            placeholder="단과대학"
                            value="emailId"
                            className={ "portal-id-input" }

                            phWidth={ [ globalInputPhWidth, setGlobalInputPhWidth ] }
                            focusState={ globalInputFocus }

                            type="text"
                            changeable={ globalInputChangeable }

                            _ref={ undefined }
                            onBlur={ undefined }
                            onFocus={ undefined }
                        />
                        <GlobalInput
                            placeholder="학과"
                            value="name"
                            className={ "name-input" }

                            phWidth={ [ namePhWidth, setNamePhWidth ] }
                            focusState={ nameFocus }

                            type="text"
                            changeable={ nameChangeable }

                            _ref={ undefined }
                            onBlur={ undefined }
                            onFocus={ undefined }
                        />
                        
                    </> : ( stage === 2 ) ? <div className="account-unknown">
                        <ServiceButton text="다시 로그인" theme="sub-selection" style={{ fontSize: "14px" }} onClick={ reloginClickHandler } key="relogin-button"/>
                        <ServiceButton text="회원가입" theme="main-selection" style={{ fontSize: "14px" }} onClick={ registerMoverClickHandler } key="register-move-button"/>
                    </div> : ( stage === 3 ) ? <>
                        <ColDepFloatSelector/>
                    </> : ( stage === 4 ) ? <div className="register">
                        <GlobalInput
                            placeholder="인증번호"
                            valueState={[ authCode, setAuthCode ]}
                            className={ "auth-code-input" }

                            phWidth={ [ authCodePhWidth, setAuthCodePhWidth ] }
                            focusState={ authCodeFocus }

                            type="text"
                            changeable={ authCodeChangeable }
                        />
                        <ServiceButton
                            key="register-button"
                            className="register-button"
                            style={{
                                fontSize: "14px",
                                opacity: ( authCode.length === 6 ) ? 1 : 0
                            }}
                            text="가입하기" theme="main-selection"
                            onClick={ registerClickHandler }
                        />
                    </div> 
                    : <></>
                }
            </div>
            <div 
                className={ "login_button" + ( button_display ? " open" : " close" ) }
                onClick={ loginClickHandler }
            >
                <span>로그인</span>
            </div>
        </div>
    </>
};

export default Login;