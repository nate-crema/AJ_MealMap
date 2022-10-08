import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import '@organism/[F]Effect/LogoAnimate/style.css';

// api
import { serviceLogin } from "@api/auth";

// components
import ServiceInput from "@atom/ServiceInput";

// interfaces
import { Login as LoginType } from "@recoil/types";
import { LoginStageCompProps } from "@interfaces/Login/StageComponents";
import { LoginResultConstants, LoginResultFailedReasons, ServiceLoginAPIResult } from "@interfaces/api/auth";


const StageLogin: React.FC<LoginStageCompProps> = ({ setStage }) => {

    // login global states control
    const setLogin = useSetRecoilState<LoginType>( states.login );

    // input states control
    const emailId = useRecoilValue<string>( states.emailId );
    const [ emailIdInputPhWidth, setEmailIdInputPhWidth ] = useState<string>( "120px" );
    const [ emailIdInputFocus, setEmailIdInputFocus ] = useState<boolean>( false );
    const [ emailIdInputChangeable, setEmailIdInputChangeable ] = useState<boolean>( true );
    
    const name = useRecoilValue<string>( states.name );
    const [ namePhWidth, setNamePhWidth ] = useState<string>( "35px" );
    const [ nameFocus, setNameFocus ] = useState<boolean>( false );
    const [ nameChangeable, setNameChangeable ] = useState<boolean>( true );


    // button states control
    const [ loginbtn_display, setLoginbtnDisplay ] = useState<boolean>( false );
    useEffect(() => {
        if ( name.length === 0 || emailId.length === 0 ) return setLoginbtnDisplay( false );
        else setLoginbtnDisplay( true );
    }, [ name, emailId ]);

    
    // button click event control
    const loginClickHandler = useCallback( async () => {
        const login_result: ServiceLoginAPIResult = await serviceLogin( emailId, name );
        if ( login_result.result === LoginResultConstants.LOGINED ) {
            setLogin({
                isLogined: true,
                name: login_result.userinfo.name,
                emailId,
                expires: new Date(login_result.expires)
            });
            setStage(3);
        } else if ( login_result.result === LoginResultConstants.PENDING ) {
            setStage(2);
        } else if ( login_result.result === LoginResultConstants.FAILED ) {
            if ( login_result.reason === LoginResultFailedReasons.NOT_FOUND ) setStage(4);
            else setStage(10);
        } else setStage(10);
    }, [ emailId, name ] );

    return <div className="stage-login">
        <div className={ "input-area" + ( loginbtn_display ? " loginbtn-active" : "" )}>
            <ServiceInput
                placeholder="아주대학교 이메일"
                onInputDisplayText="@ajou.ac.kr"
                value="emailId"
                className={ "email-id-input" }

                phWidth={ [ emailIdInputPhWidth, setEmailIdInputPhWidth ] }
                focusState={ emailIdInputFocus }

                type="text"
                changeable={ emailIdInputChangeable }
            />
            <ServiceInput
                placeholder="이름"
                value="name"
                className={ "name-input" }

                phWidth={ [ namePhWidth, setNamePhWidth ] }
                focusState={ nameFocus }

                type="text"
                changeable={ nameChangeable }
            />
        </div>
        <div 
            className={ "login_button" + ( loginbtn_display ? " open" : " close" ) }
            onClick={ loginClickHandler }
        >
            <span>로그인</span>
        </div>
    </div>
};

export default StageLogin