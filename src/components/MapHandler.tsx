import { useState, useEffect, useRef, RefObject, useMemo, MutableRefObject, CSSProperties, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// img
import MarkerImg from '@assets/Marker.png';

// css
import "@styles/components/MapHandler.css";

// interfaces
import { MapHandlerModeInput, MapHandlerCommonOptions, MapHandlerModeDisplay } from "@src/interfaces/MapHandler";

type MapHandlerProps = {
    className?: string,
    style?: CSSProperties
}

const MapHandler: React.FC<MapHandlerProps & (MapHandlerModeDisplay | MapHandlerModeInput) > = ({ className, style, type, option }) => {

    const { lat, long } = useRecoilValue<{ lat: number, long: number }>( states.location );

    const mapRef = useRef<HTMLDivElement | null>( null );
    const kakaoMapObject = useRef<any>( null );
    
    const [ markers, setMarkers ] = useState<Array<any>>( [] );
    const clicked_marker = useRef<any>( null );

    const clickable = useRef<boolean>( true );
    const { onPlaceClicked, location = { lat, long }, level } = useMemo( () => option, [ option ]);

    useEffect(() => setMarkers( option.markers || [] ), [ option ]);

    const clickHandler = useCallback( ( e: any ) => {
        if ( onPlaceClicked && clickable.current ) {
            const position = new window.kakao.maps.LatLng( e.latLng.getLat(), e.latLng.getLng() );
            
            if ( clicked_marker.current ) clicked_marker.current.setMap( null );
            const restaurantMarker = new window.kakao.maps.Marker({
                position,
                image: new window.kakao.maps.MarkerImage( MarkerImg, new window.kakao.maps.Size( 30, 45 ), { offset: new window.kakao.maps.Point( 15, 45 ) } )
            })
            clicked_marker.current = restaurantMarker;

            clicked_marker.current.setMap( kakaoMapObject.current );
            if ( kakaoMapObject.current ) kakaoMapObject.current.panTo( position );
            onPlaceClicked( { lat: e.latLng.getLat(), long: e.latLng.getLng() } );

            setTimeout(() => {
                levelResizer();
            }, 500);
            
        }
    }, [ onPlaceClicked ] );

    function levelResizer() {
        clickable.current = false;
        let prev_level = kakaoMapObject.current.getLevel();
        if ( prev_level === 1 ) {
            clickable.current = true;
            return;
        }
        else {
            kakaoMapObject.current.setLevel( prev_level-1 );
            setTimeout(() => {
                levelResizer();
            }, 100);
        }
    }

    useEffect(() => {
        // reset prev map
        for ( let i: number = 0; i < +(mapRef.current?.children?.length || 0); i++ ) {
            console.log( mapRef.current?.children[i] );
            mapRef.current?.removeChild( mapRef.current?.children[i] );
        }

        // display map
        kakaoMapObject.current = new window.kakao.maps.Map( mapRef.current, {
            center: new window.kakao.maps.LatLng( location.lat, location.long ),
            level: level || 1
        } );

        // register click handler
        window.kakao.maps.event.addListener( kakaoMapObject.current, 'click', clickHandler );
        return () => {
            window.kakao.maps.event.removeListener( kakaoMapObject.current, 'click', clickHandler );
        }
    }, [ location?.lat, location?.long ]);


    // marker control
    useEffect(() => {
        // display marker
        if ( markers && markers?.length > 0 ) markers.forEach( (v) => v.setMap( kakaoMapObject.current ) );
    }, [ markers ])

    useEffect(() => {
        setMarkers((option.markers || []).map( ({ position, image }) => 
            new window.kakao.maps.Marker({ position, image })
        ))
    }, [ option.markers ]);

    return <div className={ "map-displayer" + ( className ? ` ${ className }` : "" ) } style={ style } ref={ mapRef }/>
};

export default MapHandler