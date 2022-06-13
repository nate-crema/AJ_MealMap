import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/MapSelector.css';

// components
import MapHandler from "../../../molecule/MapHandler/MapHandler";
import { MapOnPlaceClickedFunction } from "@src/interfaces/MapHandler";
import ServiceButton from "@src/components/atom/Button";

// interfaces
type MapSelectorProps = {
    onAnswered: MapOnPlaceClickedFunction
    onSelected?: () => void
}

const MapSelector: React.FC<MapSelectorProps> = ({ onAnswered, onSelected }) => {

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

export default MapSelector