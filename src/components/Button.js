import { useState, useEffect } from "react";

// css
import "../css/Button.css";

function Button({ styletype, animation, className, style, children, onClick }) {
    const animStyle = animation ? {
        animationName: "btnAnimDef",
        animationDuration: ".25s",
        animationFillMode: "both"
    } : {};
    return <div style={{
        ...style,
        ...animStyle,
        backgroundColor: styletype == "A" ? "var(--theme-color-C)" : "white",
        border: styletype == "A" ? "none" : "1px solid var(--theme-color-C)"
    }} className={"projectButton " + (className || "")} onClick={onClick} >
        <span style={{
            color: styletype == "A" ? "white" : "var(--theme-color-C)",
        }} className="btn_innertext">{ children }</span>
    </div>
}

export default Button;