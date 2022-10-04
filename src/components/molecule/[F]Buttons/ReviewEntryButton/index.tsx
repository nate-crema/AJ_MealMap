import { useState, useEffect, useRef, useMemo, SyntheticEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components

// interface
import { SubdisplayMountMode } from "@pages/Subdisplay/types";

type touchState = "na" | "toUp" | "toDown";



const ReviewEntryButton: React.FC = () => {
    
    // touched action control
    const [ touched, setTouched ] = useState<boolean>( false );
    const subdisplayMountMode = useRecoilValue<SubdisplayMountMode>( states.subdisplayMountMode );

    const text: string = useMemo( () => {
        if ('ontouchstart' in window) return "밀어올려서 리뷰 추가하기"
        return "클릭해서 리뷰 추가하기"
    }, [ subdisplayMountMode ] );

    // swiped action control
    const SWIPE_STANDARD = 50;
    const initTouchPosition = useRef<[ number, number ]>( [ -1, -1 ] );
    const [ touchState, setTouchState ] = useState<touchState>( "na" );

    const setTouchStateControl = ( e: SyntheticEvent ): void => {
        const { changedTouches }: TouchList | any = e.nativeEvent;

        if ( !changedTouches.length ) return;
        const { clientX: x, clientY: y }: Touch = changedTouches[0];

        const STATES = {
            TOUCH_STARTED: initTouchPosition.current.includes(-1),
            SWIPE_TODOWN: y > initTouchPosition.current[1] + SWIPE_STANDARD,
            SWIPE_TOUP: y + SWIPE_STANDARD < initTouchPosition.current[1]
        }

        if ( STATES.TOUCH_STARTED ) {
            setTouchState( "na" );
            initTouchPosition.current = [ x, y ];
        }
        else if ( STATES.SWIPE_TODOWN ) setTouchState( "toDown" );
        else if ( STATES.SWIPE_TOUP ) setTouchState( "toUp" );
        else setTouchState( "na" );
    }

    const ACTIVE_STANDARD: boolean = useMemo( () => {
        if ( ('ontouchstart' in window) && subdisplayMountMode === "UNMOUNTED" )
            return touchState === "toUp";
        else return true;
    }, [ subdisplayMountMode, touchState ] );


    // review page open control
    const navigate = useNavigate();
    const [ init, setInit ] = useState<boolean>( false );

    const reviewActivator = useCallback(() => {
        console.log(ACTIVE_STANDARD);
        if ( ACTIVE_STANDARD ) navigate("/review");
    }, [ ACTIVE_STANDARD ]);

    useEffect( () => {
        console.log( init );
        if ( init ) reviewActivator();
        else setInit( true );
    } , [ touchState ]);

    
    return <div 
        className="review-entrypoint"
        style={ touched ? { 
            width: "calc(80% + 10px)",
            bottom: "0px"
        } : {}}
        onClick={ reviewActivator }
        onTouchStart={() => setTouched(true)}
        onTouchMove={ setTouchStateControl }
        onTouchEnd={() => { setTouched(false); setTouchState("na") }}
    >
        <span className="entry-text">{ text }</span>
    </div>
};

export default ReviewEntryButton