import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Login/StageAuthBelong.css';
import { LoginStageCompProps } from "@src/interfaces/Login/StageComponents";
import DepartSelector, { SelectionValueType } from "@src/components/DepartSelector";
import { DepartedUserInfo, UserDepartAPIResult } from "@src/interfaces/api/univ";
import { checkUserDepart as checkUserDepartAPI } from "@src/api/univ";

// interfaces
type UnivDepartInfos = {
    // college: SelectionValueType
}

// components


const StageAuthBelong: React.FC<LoginStageCompProps> = ({ stage = 2, setStage, setMent }) => {

    const redirect_map: 
        { [ keys in number ]: { [ keys in "VERIFIED" | "FAILED" ]: number } }
    = {
        2: {
            "VERIFIED": 3,
            "FAILED": 1
        },
        5: {
            "VERIFIED": 6,
            "FAILED": 4
        }
    }

    const onSelectComplete = ( value: { college: SelectionValueType, department: SelectionValueType }, setLogoState: ( state: "univ" | "error" | "verified" ) => any ) => {
        if ( !setMent || !value.college || !value.department ) return;

        setMent( `재학정보를 확인중이에요` );
        setTimeout( async () => {
            const api_result: UserDepartAPIResult = await checkUserDepartAPI( value.college?.value || -1, value.department?.value || -1 );
            if ( api_result.result === "SUCCEED" ) {
                setMent( `재학정보가 확인되었어요! 환영합니다 :)` );
                setLogoState( "verified" );
                setTimeout(() => {
                    setStage( redirect_map[ stage ].VERIFIED );
                }, 2500);
                console.log( api_result.userinfo );
            } else if ( api_result.result === "FAILED" ) {
                if ( api_result.reason === "Belonging Validation Failed" ) {
                    setMent( `일치하는 재학정보를 확인하지 못했어요.\n다시 시도해주세요 :(` );
                } else {
                    setMent( `재학정보를 확인하던 중 오류가 발생했어요.\n관리자에게 문의하거나 잠시 후 다시 시도해주세요` );
                }
                setLogoState( "error" );
                setTimeout(() => {
                    setStage( redirect_map[ stage ].FAILED );
                }, 2500);
            }
        }, 300);
    }

    return <div className="stage-authdepart">
        <DepartSelector
            onSelectComplete={ onSelectComplete }
        />
    </div>
};

export default StageAuthBelong