import { useState, useEffect, useRef, MouseEvent, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import SvgManager from "@assets/svg";
import { InfoSpecificOpenInfoAddType, InfoSpecificOpenInfoDisplayType } from "@interfaces/InfoSpecific";

// interfaces
type InfoSpecificButtonProps = {
    className: string,
    type: "plus" | "edit",
    children?: React.ReactNode,
    onClick?: ( e: MouseEvent ) => any,
    specinfo_type: InfoSpecificOpenInfoDisplayType
}

// components
const ICN_TYPE_MAPPEDVAL = {
    "plus": "plus-tri-bold",
    "edit": "edit"
    // "plus": "plus"
}

const InfoAddButton: React.FC<InfoSpecificButtonProps> = ({ className, type, children, onClick, specinfo_type }) => {

    const setInfoSpecificOpenInfo = useSetRecoilState( states.infoSpecificOpenInfo )

    const btnClickHandler = useCallback( ( e: MouseEvent ) => {
        if ( onClick ) onClick( e );
        else {
            setInfoSpecificOpenInfo( `ADD/${ specinfo_type }` as InfoSpecificOpenInfoAddType );
        }
    }, [ specinfo_type ] )

    return <div className={ `infospec-btn ${ className }` } onClick={ btnClickHandler }>
        <div className="icn-wrap">
            <SvgManager svg_type={ ICN_TYPE_MAPPEDVAL[ type ] } style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
        </div>
        <span className="btn-title">{ children }</span>
    </div>
};

export default InfoAddButton