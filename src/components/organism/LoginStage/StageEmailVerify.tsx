import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Login/StageEmailVerify.css';

// api
import { serviceRegisteringMail as serviceRegisteringMailAPI, serviceRegisterUser } from "@src/api/auth";

// components
import GlobalInput from "@molecule/Input/GlobalInput";
import ServiceButton from "@atom/ServiceButton";

// interfaces
import { LoginStageCompProps } from "@interfaces/Login/StageComponents";


const StageEmailVerify: React.FC<LoginStageCompProps> = ({ }) => {

    // values state control
    const [ authCodePhWidth, setAuthCodePhWidth ] = useState<string>( "65px" );
    const [ authCodeFocus, setAuthCodeFocus ] = useState<boolean>( false );
    const [ authCodeChangeable, setAuthCodeChangeable ] = useState<boolean>( true );

    const name = useRecoilValue<string>( states.name );
    const emailId = useRecoilValue<string>( states.emailId );
    const [ authCode, setAuthCode ] = useState<string>( "" );

    // authorize mail sending control
    const sendAuthMail = async ( lat: number, long: number ) => {
        const sendmail_result = await serviceRegisteringMailAPI( { lat, long, address: "" } );
        console.log( sendmail_result );
    }

    // user location information control
    const userLocationAPISucceed = ( position: GeolocationPosition ) => {
        sendAuthMail( position.coords.latitude, position.coords.longitude );
    }

    useEffect(() => {
        if ( !window.navigator.geolocation ) return;
        window.navigator.geolocation.getCurrentPosition( userLocationAPISucceed, null, {
            enableHighAccuracy: true
        } );
    }, []);

    // register button click handler
    const registerClickHandler = useCallback( async () => {
        const register_result = await serviceRegisterUser( emailId, name, authCode );
        console.log(register_result);
    }, [ emailId, name, authCode ] )

    return <div className="register">
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
};

export default StageEmailVerify