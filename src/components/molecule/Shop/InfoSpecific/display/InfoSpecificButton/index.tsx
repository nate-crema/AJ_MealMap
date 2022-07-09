import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import SvgManager from "@assets/svg";

// interfaces
type InfoSpecificButtonProps = {
    className: string,
    type: "plus",
    children?: React.ReactNode
}

// components
const ICN_TYPE_MAPPEDVAL = {
    "plus": "plus-tri-bold"
    // "plus": "plus"
}

const InfoSpecificButton: React.FC<InfoSpecificButtonProps> = ({ className, type, children }) => {
    return <div className={ `infospec-btn ${ className }` }>
        <div className="icn-wrap">
            <SvgManager svg_type={ ICN_TYPE_MAPPEDVAL[ type ] } style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
        </div>
        <span className="btn-title">{ children }</span>
    </div>
};

export default InfoSpecificButton