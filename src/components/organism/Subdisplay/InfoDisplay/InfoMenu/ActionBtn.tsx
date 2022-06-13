import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay/InfoMenu/ActionBtn.css';

// components
import ServiceButton from "@atom/Button";

// interfaces



const ActionBtn: React.FC = () => {

    // sharing control
    const sharePage = async () => {
        try {
            await navigator.share({
                title: `[야대밀맵]`
                // text: `${  }`
            })
        } catch(e) {
            if ( !navigator?.share ) copyURL();
            else console.error(e);
        }
    }

    const copyURL = async () => {
        ( async () => {
            try {
                const copy_result = await window.navigator.clipboard.writeText( window.location.href );
                alert("식당 소개페이지 URL이 복사되었습니다.");
            } catch(e) {
                console.error(e);
                alert("URL을 복사하지 못했습니다. 확인 후 다시 시도해주세요.");
            }
        } )()
    }

    return <div className="action-btns">
        <ServiceButton className="btn-review" text="리뷰하기" theme="sub-selection"/>
        <ServiceButton className="btn-share" text="공유하기" theme="main-selection" onClick={ sharePage }/>
    </div>
};

export default ActionBtn