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

    // global states control
    const { lat, long } = useRecoilValue<{ lat: number, long: number }>( states.location );


    // map reference object control
    const mapRef = useRef<HTMLDivElement | null>( null );
    const kakaoMapObject = useRef<any>( null );
    

    // map function control: marker
    const [ markers, setMarkers ] = useState<Array<any>>( [] );

    useEffect(() => setMarkers( option.markers || [] ), [ option ]);

    useEffect(() => {
        // display marker
        if ( markers && markers?.length > 0 ) markers.forEach( (v) => v.setMap( kakaoMapObject.current ) );
    }, [ markers ])

    useEffect(() => {
        setMarkers((option.markers || []).map( ({ position, image }) => 
            new window.kakao.maps.Marker({ position, image })
        ))
    }, [ option.markers ]);


    // map function control: click
    const { onPlaceClicked, location = { lat, long }, level } = useMemo( () => option, [ option ]);
    const clicked_marker = useRef<any>( null );
    const clickable = useRef<boolean>( true );

    const clickHandler = useCallback( ( e: any ) => {
        if ( onPlaceClicked && clickable.current ) {
            clickable.current = false;
            const position = new window.kakao.maps.LatLng( e.latLng.getLat(), e.latLng.getLng() );
            
            if ( clicked_marker.current ) clicked_marker.current.setMap( null );
            const ShopMarker = new window.kakao.maps.Marker({
                position,
                image: new window.kakao.maps.MarkerImage( MarkerImg, new window.kakao.maps.Size( 30, 45 ), { offset: new window.kakao.maps.Point( 15, 45 ) } )
            })
            clicked_marker.current = ShopMarker;

            clicked_marker.current.setMap( kakaoMapObject.current );
            if ( kakaoMapObject.current ) kakaoMapObject.current.panTo( position );
            onPlaceClicked( { lat: e.latLng.getLat(), long: e.latLng.getLng() } );

            setTimeout(() => {
                levelResizer();
            }, 500);
            
        }
    }, [ onPlaceClicked ] );


    // map function control: animation
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


    // map initializement
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

    return <div className={ "map-displayer" + ( className ? ` ${ className }` : "" ) } style={ style } ref={ mapRef }/>
};

export default MapHandler