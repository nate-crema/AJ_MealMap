import { useState, useEffect, useRef, useMemo, useCallback, SyntheticEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// api
import { APIResult, getShop } from "@api/service";

// css
import '@styles/components/Subdisplay/InfoDisplay.css';

// img
import MarkerImg from '@assets/Marker.png';

// components
import ServiceTitler from "../../../molecule/Titler";
import InfoHeader from "./InfoHeader";
import BasicInfo from "./InfoMenu/BasicInfo";
import ReviewBrief from "./InfoMenu/ReviewBrief";
import ActionBtn from "./InfoMenu/ActionBtn";

// interfaces
// import { shopReview } from "@interfaces/shop/Review";
import { ShopAPIResult } from "@interfaces/api/service";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";

type touchState = "na" | "toUp" | "toDown";
type changeState = "standby" | "fadeIn" | "fadeOut";

type InfoMenuProps = {
    contact?: string
    duration?: string
    // reviews?: Array<shopReview>
    reviews?: Array<any>
    setMinimize: Function
}

type InfoBlockProps = {
    shop: ShopServiceType
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

// const InfoBlock: React.FC<InfoBlockProps> = ({ shop }) => {

//     const [ minimize, setMinimize ] = useState<boolean>( false );

//     return <div
//         className={ "info-block" + ( minimize ? " minimized" : " non-minimized" ) }
//         style={{ height: minimize ? "50px" : undefined }}
//         onClick={ () => setMinimize( false ) }
//     >
//         {
//             ( minimize ) ? <div className="minimize-wrap">
//                 <span className="walk-distance">{ shop.duration ? `약 ${ Math.floor( shop.duration / 60 ) }분 거리` : "소요시간 계산불가" }</span>
//                 { ( window.innerWidth > 400 ) && <span className="review-oneline">{ shop.short_review || shop.common_review }</span> }
//             </div> : <div className="animation-wrap">
//                 <InfoHeader title={ shop.name } cat={ shop.cat } worktime={[ "15:00", "16:00" ]}/>
//                 <InfoMenu 
//                     contact={ shop?.contact }
//                     reviews={ shop?.reviews }
//                     setMinimize={ setMinimize }
//                 />
//             </div>
//         }
//     </div>
// };

const InfoDisplay: React.FC = () => {

    // selected info control
    const [ selected_rid, setSelectedRid ] = useRecoilState<ShopIDType | undefined>( states.shopSpecific );
    const [ shop, setshop ] = useState<ShopServiceType | undefined>( undefined );
    const shops = useRecoilValue<Array<ShopServiceType>>( states.shops );

    useEffect(() => {
        ( async () => {
            if ( !selected_rid ) return;
            let loaded_shop: ShopServiceType = shops.filter( v => v.shopID === selected_rid )[0];
            if ( !loaded_shop ) {
                const shop_result: ShopAPIResult = await getShop( selected_rid );
                if ( shop_result.result === APIResult.SUCCEED ) {
                    loaded_shop = shop_result.data;
                } else return;
            }
            console.log( "shopinfo loaded:", loaded_shop );
            setshop( loaded_shop );
        } )()
    }, [ selected_rid ]);
    

    // shop_name & tag_review control
    const [ shop_name, setshopName ] = useState<string>( "음식점을 선택해주세요" );
    const [ tag_review, setTagReview ] = useState<string>( "선택한 음식점에 대한 정보가 표시됩니다" );

    useEffect(() => {
        if ( !shop ) return;

        setshopName( shop.name );
        // setTagReview( shop.short_review || shop.common_review );
    }, [ shop ]);


    // map display control
    // const [ map_option, setMapOption ] = useState<MapHandlerOptionDisplay>({ location: { lat: -1, long: -1 }, level: 1, markers: [] });

    useEffect((): void => {
        if ( !shop ) return;
        // const { location: { lat, long } } = shop;
        
        // setMapOption({ location: { lat: lat - ( 20 / ( 111 * 1000 ) ), long }, level: 1, markers: [
        //     { 
        //         position: new window.kakao.maps.LatLng( lat, long ),
        //         image: new window.kakao.maps.MarkerImage( MarkerImg, new window.kakao.maps.Size( 30, 45 ), { offset: new window.kakao.maps.Point( 15, 45 ) } ) }
        // ] });

    }, [ shop ]);

    
    

    return <div className="info-display-area">
        <ServiceTitler
            className="info-display-titler"
            title={ shop_name } titleStyle={{ fontSize: "20px", fontWeight: "700" }}
            ment={ tag_review } mentStyle={{ fontSize: "16px" }}
        />
    </div>
};

export default InfoDisplay