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
import { ComponentOpenState, SubdisplayDisplayMode, SubdisplayMountMode } from "@interfaces/Subdisplay";
import Alert from "./Alert";

const SUBDISPLAY_SIZE_PRESETS: {
    [ keys in ComponentOpenState ]: string
} = {
    "SMALL": "calc( 80vh / 4 + 10px )",
    "HALF_SMALL": "calc( 80vh / 8 * 3 )",
    "MEDIUM": "calc( 80vh / 2 )",
    "HALF_MEDIUM": "calc( 80vh / 4 * 3 )",
    "QUARTER_MEDIUM": "calc( 80vh / 8 * 7 )",
    "LARGE": "calc( 80vh )"
};

const Subdisplay: React.FC = () => {
    
    // subdisplay sizing control
    const [ subdisplay_size, setSubdisplaySize ] = useRecoilState<ComponentOpenState>( states.subdisplayDisplaySize );

    // subdisplay display control
    const type = useRecoilValue<SubdisplayDisplayMode>( states.subdisplayDisplayMode );
    const navigate = useNavigate();
    const closeSubdisplay = () => {
        setSubdisplaySize( "LARGE" );
        navigate("/");
    }

    // subdisplay mount control
    const mounted = useRecoilValue<SubdisplayMountMode>( states.subdisplayMountMode );


    return <>
        <Alert/>
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
        } style={{
            height: (type !== "CLOSED" && mounted !== "UNMOUNTED") ? ( SUBDISPLAY_SIZE_PRESETS[ subdisplay_size ] ) : undefined
        }}>
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