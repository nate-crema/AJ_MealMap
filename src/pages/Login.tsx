import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/pages/Login.css';
import '@styles/Animate.Logo.css';

// components
import GlobalInput from "@src/components/GlobalInput";

// interfaces
import { Login as LoginType } from "../interfaces/recoil/State";
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

    useEffect(() => {
        if ( stage === 1 && (Math.random() * 10)%2 ) setStage( 2 );
    }, [ stage ]);

    
    // stage texts control
    const [ title, setTitle ] = useState<String>( "" );
    const [ ment, setMent ] = useState<String>( "" );

    useEffect(() => {
        switch( stage ) {
            case 0:
                setTitle("재학생 로그인");
                setMent("아주대학교 재학생만 이용할 수 있어요\n통합ID와 이름으로 로그인 해주세요");
                break;
            case 1:
                setTitle(`${ login.name }님 안녕하세요 =)`);
                setMent("보안을 위해 재학 학과 인증을 진행할게요\n이 정보는 보안목적 이외에 사용되지 않아요");
                break;
            case 2:
                if ( login.isLogined ) {
                    setTitle("로그인 성공");
                    setMent(`${ login.name }님 안녕하세요!\n환영합니다 :)`);
                } else {
                    setTitle("로그인 실패");
                    setMent(`입력하신 정보로 로그인에 실패했어요. 다시 로그인해주세요.`);
                }
                break;
        }
    }, [ stage, login ]);
    
        
    // value input control
    const [ globalInputPhWidth, setGlobalInputPhWidth ] = useState<String>( "120px" );
    const [ globalInputFocus, setGlobalInputFocus ] = useState<Boolean>( false );
    const [ globalInputChangeable, setGlobalInputChangeable ] = useState<Boolean>( true );

    const [ namePhWidth, setNamePhWidth ] = useState<String>( "35px" );
    const [ nameFocus, setNameFocus ] = useState<Boolean>( false );
    const [ nameChangeable, setNameChangeable ] = useState<Boolean>( true );

    const name = useRecoilValue<String>( states.name );
    const portalId = useRecoilValue<String>( states.portalId );


    // stage display control
    const [ stage_display, setStageDisplay ] = useState<Boolean>( true );
    const [ button_display, setButtonDisplay ] = useState<Boolean>( false );

    useEffect(() => {
        // console.log( name.length, portalId.length );
        if ( name.length === 0 || portalId.length === 0 ) return setButtonDisplay( false );
        setButtonDisplay( true );
    }, [ name, portalId ]);


    // login click control
    
    const _loginButtonHandler = () => {
        setStage( p => p+1 );
    }
    



    return <>
        <span className="catch-phrase">아주대학교 밥집지도<br/>아대밀맵</span>
        <AnimateLogo/>
        <div className="login-contents">
            <span className="stage-title">{ title }</span>
            <span className="stage-ment">{ ment.split("\n").map( ment_line => <>
                <p>{ ment_line }</p>
            </> ) }</span>
            <div className={ 
                "stage-rendering"
                + ( ( stage_display === true ) ? " stage-fade-in" : " stage-fade-out" )
                + ( ( button_display === true ) ? " button-display" : "" )
            }>
                {
                    ( stage === 0 ) ? <>
                        <GlobalInput
                            placeholder="아주대학교 통합ID"
                            value="portalId"
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
                            placeholder="이름"
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
                    </> : ( stage === 1 ) ? <>
                        <GlobalInput
                            placeholder="단과대학"
                            value="portalId"
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
                        
                    </> : ( stage === 2 ) ? <>
                        
                    </> : <></>
                }
            </div>
            <div className={ "login_button" + ( button_display ? " open" : " close" ) } onClick={ _loginButtonHandler }>
                <span>로그인</span>
            </div>
        </div>
    </>
};

export default Login;