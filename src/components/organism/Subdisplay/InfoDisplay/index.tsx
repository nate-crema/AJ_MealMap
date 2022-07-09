import { useState, useEffect, useRef, useMemo, useCallback, SyntheticEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// api
import { APIResult, getShop } from "@api/service";

// css
import './style.css';

// img
import MarkerImg from '@assets/Marker.png';

// components
import ServiceTitler from "../../../molecule/Titler";
import InfoMenu from "../../Shop/InfoMenu";
import InfoHeader from "../InfoHeader";

// interfaces
// import { shopReview } from "@interfaces/shop/Review";
import { ShopAPIResult } from "@interfaces/api/service";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import InfoSpecific from "@organism/Shop/InfoSpecific";

type InfoBlockProps = {
    shop: ShopServiceType
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
    const [ shop, setShop ] = useRecoilState<ShopServiceType | undefined>( states.shopSpecific );
    

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
        <InfoMenu
            // contact={ shop?.contact }
        />
    </div>
};

export default InfoDisplay