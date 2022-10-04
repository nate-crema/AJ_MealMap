import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import MapHandler from "@molecule/[F]Map/MapHandler";
import { MapOnPlaceClickedFunction } from "@molecule/[F]Map/MapHandler/types";
import ServiceButton from "@atom/ServiceButton";

// interfaces
type LocationReviewerProps = {
    onAnswered: MapOnPlaceClickedFunction
    onSelected?: () => void
}

const LocationReviewer: React.FC<LocationReviewerProps> = ({ onAnswered, onSelected }) => {

    const [ selected, setSelected ] = useState<{ lat: number, long: number } | null>( null );

    const onPlaceClicked = ( location: { lat: number, long: number } ) => {
        console.log( location );
        setSelected( location );
        if ( onSelected ) onSelected();
    }

    const onButtonClicked = useCallback( () => {
        if ( selected ) return onAnswered( selected );
    }, [ selected ] );


    return <>
        <MapHandler
            className="map-displayer-reviewwriter"
            type="input"
            option={{ onPlaceClicked }}
        />
        <ServiceButton 
            className="mapselector-nextstep"
            style={{ fontSize: "16px", fontWeight: "500" }}
            { ...(( selected ) ? { 
                text: "선택완료", theme: "main-selection"
            } : {
                text: "잘 모르겠어요", theme: "sub-selection"
            }) }
            onClick={ onButtonClicked }
        />
    </>
};

export default LocationReviewer