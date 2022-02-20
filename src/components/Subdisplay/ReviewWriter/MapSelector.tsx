import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/MapSelector.css';

// components
import MapHandler from "../../MapHandler";
import { MapOnPlaceClickedFunction } from "@src/interfaces/MapHandler";

// interfaces
type MapSelectorProps = {
    onAnswered: MapOnPlaceClickedFunction
}

const MapSelector: React.FC<MapSelectorProps> = ({ onAnswered }) => {

    const onPlaceClicked = ( location: { lat: number, long: number } ) => {
        console.log( location );
        // onAnswered( location );
    }


    return <MapHandler
        className="map-displayer-reviewwriter"
        type="input"
        option={{ onPlaceClicked }}
    />
};

export default MapSelector