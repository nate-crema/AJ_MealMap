import { useState, useEffect, useRef, useCallback, MouseEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/pages/Login.css';

// api

// components
import AnimateLogo from "@components/Login/animate/AnimateLogo";

import StageLogin from "@components/Login/stage/StageLogin";
import StageAuthDepart from "@src/components/Login/stage/StageAuthBelong";
import StageJoinSelection from "@components/Login/stage/StageJoinSelection";
import StageEmailVerify from "@components/Login/stage/StageEmailVerify";

// interfaces

type LoginProps = {
    
}

const Login: React.FC<LoginProps> = ({  }) => {

    // global variable control
    const name = useRecoilValue<string>( states.name );

    // display control
    const [ title, setTitleText ] = useState<string>( "재학생 로그인" );
    const [ onTitleDisplay, setOnTitleDisplay ] = useState<boolean>( true );
    const setTitle = ( value: string ) => {
        setOnTitleDisplay( false );
        setTimeout(() => {
            setTitleText( value );
            setOnTitleDisplay( true );
        }, 300);
    };

    const [ ment, setMentText ] = useState<string>( "아주대학교 재학생만 이용할 수 있어요\n이메일과 이름으로 로그인 해주세요" );
    const [ onMentDisplay, setOnMentDisplay ] = useState<boolean>( true );
    const setMent = ( value: string ) => {
        setOnMentDisplay( false );
        setTimeout(() => {
            setMentText( value );
            setOnMentDisplay( true );
        }, 300);
    };

    const [ button_display, setButtonDisplay ] = useState<boolean>( false );

    // stage control
    const [ stage, setStage ] = useState( 0 );
    const [ stage_display, setStageDisplay ] = useState<boolean>( true );
    const setStageWithTexts = ( stage: number ) => {
        setStageDisplay( false );
        setTimeout(() => {
            setStage( stage );
            switch( stage ) {
                case 1:
                    setTitle( "재학생 로그인" );
                    setMent( "아주대학교 재학생만 이용할 수 있어요\n이메일과 이름으로 로그인 해주세요" );
                    break;
                case 2:
                    setTitle("추가인증");
                    setMent(`재학중이신 단과대학과 학과를 선택해주세요`);
                    break;
                case 4:
                    setTitle("로그인 실패");
                    setMent("입력된 정보로 가입된 계정을 찾을 수 없어요 :(\n새롭게 가입하거나 다시 로그인해주세요.");
                    break;
                case 5:
                    setTitle("재학인증");
                    setMent(`회원가입을 위해 재학중이신 단과대학과 학과를 선택해주세요`);
                    break;
                case 6:
                    setTitle("이메일인증");
                    setMent(`회원가입을 위해 학교에 등록된 이메일로 인증메일을 보내드렸어요!\n메일에 있는 인증번호를 아래 입력란에 입력해주세요`);
                    break;
                // case 3:
                //     setTitle("회원가입");
                //     setMent(`재학중이신 단과대학과 학과를 선택해주세요`);
                //     break;
                // case 4:
                //     setTitle("회원가입");
                //     setMent(`${ name }님의 계정으로 방금 인증번호 메일을 보냈어요!\n인증번호를 확인해 입력해주세요.`);
                //     break;
            }
            setTimeout(() => {
                setStageDisplay( true );
            }, 200);
        }, 100);
    }

    const [ init, setInit ] = useState<boolean>( false );
    useEffect(() => {
        setStageWithTexts( 1 );
        setTimeout(() => setInit( true ), 2200);
    }, []);
    
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
            }>
                {
                    ( stage === 1 ) ? <>
                        <StageLogin setStage={ setStageWithTexts }/>
                    </>
                    : ( [ 2, 5 ].includes( stage ) ) ? <>
                        <StageAuthDepart
                            stage={ stage }
                            setStage={ setStageWithTexts }
                            setMent={ setMent } 
                        />
                    </>
                    : ( stage === 4 ) ? <>
                        <StageJoinSelection
                            setStage={ setStageWithTexts }
                            setMent={ setMent } 
                        />
                    </>
                    : ( stage === 6 ) ? <>
                        <StageEmailVerify
                            setStage={ setStageWithTexts }
                            setMent={ setMent } 
                        />
                    </>
                    : <></>
                }
            </div>
            
        </div>
    </>
};

export default Login;