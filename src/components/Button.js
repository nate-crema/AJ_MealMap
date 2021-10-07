import { useState, useEffect } from "react";

// css
import "../css/Button.css";

function Button({ styletype, animation, className, style, children, onClick }) {

    const [ isHover, setIH ] = useState(false);

    const animStyle = animation ? {
        animationName: "btnAnimDef",
        animationDuration: ".25s",
        animationFillMode: "both"
    } : {};
    const styleTypes = {
        "A": {
            backgroundColor: "var(--theme-color-C)",
            border: "none",
            textColor: "white"
        },
        "B": {
            _hover: {
                _graph_: "ease",
                backgroundColor: "var(--theme-color-C)",
                textColor: "white"
            }
        }
    }
    return <div style={{
        ...style,
        ...animStyle,
        backgroundColor: ( isHover ? styleTypes[styletype || ""]?._hover?.backgroundColor : styleTypes[styletype || ""]?.backgroundColor ) || "white",
        border: ( isHover ? styleTypes[styletype || ""]?._hover?.border : styleTypes[styletype || ""]?.border ) || "1px solid var(--theme-color-C)",
        transitionTimingFunction: styleTypes[styletype || ""]?._hover?._graph_
    }} className={"projectButton " + (className || "")} onClick={onClick} onMouseEnter={() => setIH(true)} onMouseLeave={() => setIH(false)} >
        <span style={{
            color: ( isHover ? styleTypes[styletype || ""]?._hover?.textColor : styleTypes[styletype || ""]?.textColor ) || "var(--theme-color-C)",
            left: style?.textAlign == "left" && "50px",
            transform: style?.textAlign == "left" && "translate(0, -50%)",
            transitionTimingFunction: styleTypes[styletype || ""]?._hover?._graph_
        }} className="btn_innertext" onMouseEnter={() => setIH(true)}>{ children }</span>
    </div>
}

export default Button;