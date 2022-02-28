import { useState, useEffect, useRef, MouseEventHandler, CSSProperties } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/ServiceButton.css';

// components

// interfaces
import { ServiceButtonThemes } from "@interfaces/ServiceButton";

type ServiceButtonProps = {
    text: string,
    className?: string,
    style?: CSSProperties,
    theme: ServiceButtonThemes,
    onClick?: MouseEventHandler
}

const themes = {
    "defalut": { backgroundColor: "var(--theme-color-C)", color: "white" },
    "main-selection": { backgroundColor: "var(--theme-color-C)", color: "white" },
    "sub-selection": { backgroundColor: "white", color: "var(--theme-color-C)" },
    "warn-main-selection": { backgroundColor: "#aa2200", color: "white" },
    "warn-sub-selection": { backgroundColor: "white", color: "#aa2200" }
}


const ServiceButton: React.FC<ServiceButtonProps> = ({ text, className, style = {}, theme, onClick }) => {

    return <div
        className={ "service-button" + ( className ? ( " " + className ) : "" ) }
        style={{ ...style, ...themes[ theme ] }}
        onClick={ onClick }
    >
        <span className="service-button-text" 
            style={{ color: themes[ theme ].color, fontSize: style?.fontSize, fontWeight: style?.fontWeight }}
        >{ text }</span>
    </div>
};

export default ServiceButton