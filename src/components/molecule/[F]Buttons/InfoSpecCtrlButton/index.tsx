import { useState, useEffect, useRef, MouseEvent, CSSProperties } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import SvgManager from "@assets/svg";

// interfaces
type InfoSpecCtrlBtnType = "stage" | "close";

type InfoSpecCtrlBtnProps = {
    type: InfoSpecCtrlBtnType,
    children: string,
    onClick?: ( e: MouseEvent ) => any,
    className?: string,
    style?: CSSProperties
}

// components
const InfoSpecCtrlBtn: React.FC<InfoSpecCtrlBtnProps> = ({ type, children, className, style, onClick }) => {

    const btnClickActionHandler = ( e: MouseEvent ) => {
        if ( onClick ) onClick( e );
    }

    return <div className={ `infospec-ctrl-commonbtn commonbtn-${ type }`  + (( className ) ? ` ${ className }` : "") } style={ style } onClick={ btnClickActionHandler }>
        {
            ( type === "close" ) ? <>    
                <span>{ children } 닫기</span>
                <div className="btn-icn">
                    <SvgManager svg_type="arrow_down" style={{ "path": { fill: "var(--theme-color-C)" } }}/>
                </div>
            </> : <>
                <span>{ children }</span>
                <div className="btn-icn">
                    <SvgManager svg_type="arrow_right" style={{ "path": { fill: "var(--theme-color-C)" } }}/>
                </div>
            </>
        }
    </div>
};

export default InfoSpecCtrlBtn