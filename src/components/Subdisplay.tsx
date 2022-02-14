import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay.css';
import { SubdisplayDisplayMode, SubdisplayMountMode } from "@src/interfaces/Subdisplay";
import InfoDisplay from "./Subdisplay/InfoDisplay";

// components


// interfaces


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
                ( type === "REVIEW/WRITE" ) ? <div>

                </div> : 
                <></>
            }
        </div>
    </>
};

export default Subdisplay