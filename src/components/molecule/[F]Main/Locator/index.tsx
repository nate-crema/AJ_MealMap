import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components

// interfaces
import { Location } from "@interfaces/service/recoil/State";
type LocatorProps = {
    
}

type KakaoRegionResult = {
    [ key: number ]: {
        address_name: string;
        code: string;
        region_1depth_name: string;
        region_2depth_name: string;
        region_3depth_name: string;
        region_4depth_name: string;
        region_type: string;
        x: number;
        y: number;
    } | null;
};

declare global {
    interface Window {
        kakao: any;
    }
}

const Locator: React.FC<LocatorProps> = ({  }) => {


    // geolocation control
    const setLocationInfoGlobal = useSetRecoilState<Location>( states.location );
    const [ location, setLocation ] = useState<KakaoRegionResult>( [] );

    const geolocationHandler = ( position: GeolocationPosition ): void => {
        const { coords: { latitude: lat, longitude: long, accuracy } } = position;
        console.log(`accuracy: ${ Math.floor( accuracy * 100 ) / 100 }m`);
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode( long, lat, regionInfoHandler );
    }
    
    const geolocationErrorHandler = ( error: GeolocationPositionError ): void => {
        console.log( error );
        setDisplay( false );
        setMent( "확인할 수 없음" );
        setDisplay( true );
    }
    
    const regionInfoHandler = ( result: any, status: number ): void => {
        const { OK: SUCCEED } = window.kakao.maps.services.Status;
        if ( status === SUCCEED ) setLocation( result );
    }

    useEffect((): void => {
        // get location info
        if ( navigator.geolocation ) {
            setDisplay( false );
            setMent( "확인중" );
            setDisplay( true );
            navigator.geolocation.getCurrentPosition( geolocationHandler, geolocationErrorHandler, {
                enableHighAccuracy: true
            } );
        } else {
            setDisplay( false );
            setMent( "확인할 수 없음" );
            setDisplay( true );
        }
    }, []);

    
    // location display control
    const [ display, setDisplay ] = useState<boolean>( false );
    const [ ment, setMent ] = useState<string>("");

    useEffect((): void => {
        if ( location[0] ) {
            setDisplay( false );
            const address: Array<string> = [ location[0]?.region_4depth_name || "" , location[0]?.region_3depth_name || "" , location[0]?.region_2depth_name || "" , location[0]?.region_1depth_name || "" ];
            let new_ment: string = "";
            let i: number = 0;
            
            address.forEach( v => {
                if ( ( i < 2 ) && v.length > 0 ) {
                    i++;
                    new_ment = `${ v } ${ new_ment }`
                }
            });
            setTimeout(() => {
                setMent( new_ment );
                setDisplay( true );
                setLocationInfoGlobal({ lat: location[0]?.y || 0, long: location[0]?.x || 0, address: new_ment })
            }, 200);
        }
    }, [ location ] );
    

    return <div className="service-locator">
        <span className={ "current-location" + ( display ? " fadeIn" : " fadeOut" ) }>현재 위치: { ment }</span>
    </div>
};

export default Locator;