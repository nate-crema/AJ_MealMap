import { useState, useEffect, useRef } from "react";

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
    const [ type, setType ] = useRecoilState<SubdisplayDisplayMode>( states.subdisplayDisplayMode );
    const closeSubdisplay = () => setType( "CLOSED" );

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

                </> : 
                <></>
            }
        </div>
    </>
};

export default Subdisplay