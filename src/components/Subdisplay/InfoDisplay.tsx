import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay.css';

// img
import MarkerImg from '@assets/Marker.png';

// components
import ServiceTitler from "../ServiceTitler";


// interfaces
import { RestaurantList, RestaurantInfo, RID } from "@interfaces/Restaurant";
import InfoBlock from "./InfoDisplay/InfoBlock";


const InfoDisplay: React.FC = () => {

    // selected info control
    const [ selected_rid, setSelectedRid ] = useRecoilState<RID | undefined>( states.restaurantSpecific );
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
        const restaurantMarkerImage = new window.kakao.maps.MarkerImage( MarkerImg, new window.kakao.maps.Size( 51, 77 ), { offset: new window.kakao.maps.Point( 25, 77 ) } );
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