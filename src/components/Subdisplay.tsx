import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay.css';

// components
import InfoDisplay from "./Subdisplay/InfoDisplay";
import ReviewWriter from "./Subdisplay/ReviewWriter";

// interfaces
import { SubdisplayDisplayMode, SubdisplayMountMode } from "@interfaces/Subdisplay";


const Subdisplay: React.FC = () => {

    // subdisplay display control
    const type = useRecoilValue<SubdisplayDisplayMode>( states.subdisplayDisplayMode );
    const navigate = useNavigate();
    const closeSubdisplay = () => navigate("/");

    // subdisplay mount control
    const mounted = useRecoilValue<SubdisplayMountMode>( states.subdisplayMountMode );

    return <>
        <div
            className={ 
                "subdisplay-background-shader"
                + ( mounted === "UNMOUNTED" ? " unmounted" : " mounted" )
            }
            onClick={ closeSubdisplay }
        />
        <div className={
            "subdisplay-component"
            + ( mounted === "UNMOUNTED" ? " unmounted" : " mounted" )
            + ( type === "CLOSED" ? " closed" : " opened" )
        }>
            {
                ( type === "INFO/READ" ) ? <>
                    <InfoDisplay/>
                </> : 
                ( type === "REVIEW/WRITE" ) ? <>
                    <ReviewWriter/>
                </> : 
                <></>
            }
        </div>
    </>
};

export default Subdisplay