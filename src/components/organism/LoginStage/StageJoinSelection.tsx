import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Login/StageJoinSelection.css';

// components
import ServiceButton from "@atom/ServiceButton";

// interfaces
import { LoginStageCompProps } from "@interfaces/Login/StageComponents";



const StageJoinSelection: React.FC<LoginStageCompProps> = ({ setStage, setMent }) => {

    const reloginClickHandler = () => {
        setStage(1);
    };

    const registerMoverClickHandler = () => {
        setStage(5);
    };

    return <div className="account-unknown">
        <ServiceButton text="다시 로그인" theme="sub-selection" style={{ fontSize: "14px" }} onClick={ reloginClickHandler } key="relogin-button"/>
        <ServiceButton text="회원가입" theme="main-selection" style={{ fontSize: "14px" }} onClick={ registerMoverClickHandler } key="register-move-button"/>
    </div>
};

export default StageJoinSelection