import { useState, useEffect, useRef, useMemo, useCallback, SyntheticEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay.css';

// img
import MarkerImg from '@assets/Marker.png';

// components
import ServiceTitler from "../ServiceTitler";
import InfoHeader from "./InfoDisplay/InfoHeader";
import BasicInfo from "./InfoDisplay/InfoMenu/BasicInfo";
import ReviewBrief from "./InfoDisplay/InfoMenu/ReviewBrief";

// interfaces
import { RestaurantList, RestaurantInfo, RestaurantID } from "@interfaces/Restaurant";
import { RestaurantReview } from "@interfaces/Restaurant/Review";

type touchState = "na" | "toUp" | "toDown";
type changeState = "standby" | "fadeIn" | "fadeOut";

type InfoMenuProps = {
    contact?: string,
    duration?: string,
    reviews?: Array<RestaurantReview>,
    setMinimize: Function
}

type InfoBlockProps = {
    restaurant: RestaurantInfo
}

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
            console.log( menu );
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
                MENU_EQUAL(2) ? <></> :
                <></>
            }
        </div>
        <div className="menu-statebar">
            <div className="menu-onstate" style={{ top: STATEBAR_TOP }}/>
        </div>
    </div>
}

const InfoBlock: React.FC<InfoBlockProps> = ({ restaurant }) => {

    const [ minimize, setMinimize ] = useState<boolean>( false );

    useEffect(() => console.log( minimize ), [ minimize ]);

    return <div className="info-block" style={{ height: minimize ? "30px" : undefined }} >
        <InfoHeader title={ restaurant.name } cat={ restaurant.cat } worktime={[ "15:00", "16:00" ]}/>
        <InfoMenu 
            contact={ restaurant?.contact }
            reviews={ restaurant?.reviews }
            setMinimize={ setMinimize }
        />
    </div>
};

const InfoDisplay: React.FC = () => {

    // selected info control
    const [ selected_rid, setSelectedRid ] = useRecoilState<RestaurantID | undefined>( states.restaurantSpecific );
    const [ restaurant, setRestaurant ] = useState<RestaurantInfo | undefined>( undefined );
    const restaurants = useRecoilValue<RestaurantList>( states.restaurants );

    useEffect(() => {
        if ( !selected_rid ) return;
        const loaded_restaurant: RestaurantInfo = restaurants[ selected_rid ];
        if ( !loaded_restaurant ) return;

        setRestaurant( loaded_restaurant );
    }, [ selected_rid ]);
    

    // restaurant_name & tag_review control
    const [ restaurant_name, setRestaurantName ] = useState<string>( "음식점을 선택해주세요" );
    const [ tag_review, setTagReview ] = useState<string>( "선택한 음식점에 대한 정보가 표시됩니다" );

    useEffect(() => {
        if ( !restaurant ) return;
        console.log( restaurant );

        setRestaurantName( restaurant.name );
        setTagReview( restaurant.short_review || restaurant.common_review );
    }, [ restaurant ]);


    // map display control
    const [ map_display, setMapDisplay ] = useState<boolean>( false );
    const mapRef = useRef<HTMLDivElement>( null );
    const kakaoMapObject = useRef<any>( null );

    useEffect((): void => {
        if ( !restaurant ) return;
        const { location: { lat, long } } = restaurant;

        // adjust latitude value for InfoBlock display
        const restaurantPositonObject = new window.kakao.maps.LatLng( lat, long );
        const restaurantDisplayPositonObject = new window.kakao.maps.LatLng( lat - ( 20 / ( 111 * 1000 ) ), long );
        kakaoMapObject.current = new window.kakao.maps.Map( mapRef.current, {
            center: restaurantDisplayPositonObject,
            level: 1
        } );

        // display marker
        const restaurantMarkerImage = new window.kakao.maps.MarkerImage( MarkerImg, new window.kakao.maps.Size( 30, 45 ), { offset: new window.kakao.maps.Point( 15, 45 ) } );
        const restaurantMarker = new window.kakao.maps.Marker({
            position: restaurantPositonObject,
            image: restaurantMarkerImage
        })
        restaurantMarker.setMap( kakaoMapObject.current );

    }, [ restaurant ]);

    
    

    return <div className="info-display-area">
        <ServiceTitler
            className="info-display-titler"
            title={ restaurant_name } titleStyle={{ fontSize: "20px", fontWeight: "700" }}
            ment={ tag_review } mentStyle={{ fontSize: "16px" }}
        />
        <div className="map-displayer" ref={ mapRef }/>
        { ( restaurant ) && <InfoBlock restaurant={ restaurant } /> }
    </div>
};

export default InfoDisplay