import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/MobileBtn.css";

function MobileBtn({ text, action, type = 0, className, style }) {

    const styles = [
        {
            backgroundColor: "var(--theme-color-C)",
            color: "white"
        },
        {
            backgroundColor: "white",
            color: "var(--theme-color-C)"
        },
        {
            backgroundColor: "#AA2424",
            color: "white"
        },
        {
            backgroundColor: "white",
            color: "#AA2424"
        },
        {
            backgroundColor: "white",
            color: "black"
        },
    ]


    return <div className={ `${ className + " " }mobile-btn` } style={{
        backgroundColor: styles[type].backgroundColor,
        ...style
    }} onClick={(e) => (action && action(e))}>
        <span className="btn-text" style={{
            color: styles[type].color
        }}>{ text }</span>
    </div>;
}

export default MobileBtn;