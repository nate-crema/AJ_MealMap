import { useState, useEffect, useRef, useCallback, useMemo, SyntheticEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './InfoMenu.css';

// interfaces
type touchState = "na" | "toUp" | "toDown";
type changeState = "standby" | "fadeIn" | "fadeOut";

type InfoMenuProps = {
    contact?: string
    duration?: string
    // reviews?: Array<shopReview>
    reviews?: Array<any>
    setMinimize: Function
}

// components
import BasicInfo from "./deprecated/BasicInfo";
import ReviewBrief from "./deprecated/ReviewBrief";
import ActionBtn from "./deprecated/ActionBtn";

const InfoMenu: React.FC<InfoMenuProps> = ({ contact, duration, reviews, setMinimize }) => {

    const [ menu, setMenu ] = useState<number>(0);
    const [ menu_changing, setMenuChanging ] = useState<[ touchState, changeState ]>( [ "na", "standby" ] );
    const MENU_ANIMATE_TAGS = useMemo( () => ( menu_changing.map( v => ` animation_${v}` ).toString().replace(",", "") ), [ menu_changing ] )

    const MENU_EQUAL = useCallback( ( id: number ): boolean => menu === id, [ menu ] );

    const setMenuControl = useCallback( ( touchState: touchState ): void => {
        if ( touchState === "toUp" && ( menu < 2 ) ) {
            setMinimize( false );
            setMenuChanging( [ touchState, "fadeOut" ] );
            setTimeout(() => {
                setMenu( p => p+1 );
                setMenuChanging( [ "toDown", "fadeOut" ] );
                setTimeout(() => setMenuChanging( [ "na", "fadeIn" ] ), 100);
            }, 300);
        }
        else if ( touchState === "toDown" && ( menu > -1 ) ) {
            setMenuChanging( [ touchState, "fadeOut" ] );
            // console.log( menu );
            if ( menu === 0 ) setMinimize( true );
            setTimeout(() => {
                setMenu( p => p-1 );
                setMenuChanging( [ "toUp", "fadeOut" ] );
                setTimeout(() => setMenuChanging( [ "na", "standby" ] ), 100);
            }, 300);
        }
    }, [ menu ] );



    const SWIPE_STANDARD = 50;

    const initTouchPosition = useRef<[ number, number ]>( [ -1, -1 ] );
    const [ touchState, setTouchState ] = useState<touchState>( "na" );
    const STATEBAR_TOP = useMemo( () => `calc( 33% * ${ menu })`, [ menu ] )

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

    useEffect(() => setMenuControl( touchState ), [ touchState ]);
    

    return <div className="info-menu" onTouchMove={ setTouchStateControl }>
        <div className={ "menu-content-wrap" + MENU_ANIMATE_TAGS }>
            {
                MENU_EQUAL(0) ? <BasicInfo contact={ contact || "연락처정보 없음" } duration={ duration || "거리정보 없음" }/> :
                MENU_EQUAL(1) ? <ReviewBrief reviews={ reviews || [] } /> :
                MENU_EQUAL(2) ? <ActionBtn/> :
                <></>
            }
        </div>
        <div className="menu-statebar">
            <div className="menu-onstate" style={{ top: STATEBAR_TOP }}/>
        </div>
    </div>
}

export default InfoMenu;