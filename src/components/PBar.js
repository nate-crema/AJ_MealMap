import { useState, useEffect, useRef } from "react";

// css
import "../css/PBar.css";

// eslint-disable-next-line
function PBar({ style, className, state: [ v, setV ], onEnd = () => {} }) {

    const pbar_ref = useRef(<></>);

    const [ clicked, setClicked ] = useState(false);
    const [ movepc, setMP ] = useState(0);

    useEffect(() => {
        if (clicked) {
            const mouseChk = (e) => {
                const refrect = pbar_ref.current?.getBoundingClientRect();
                let sv = (e.pageX - refrect.x) / (refrect.width) * 100;
                if (sv < 0) sv = 0;
                else if (sv > 100) sv = 100
                setMP(sv);
                setV(Math.floor(sv/10));
                const mouseDAble = () => setClicked(false);
                window.addEventListener("mouseup", mouseDAble);
                return () => window.removeEventListener("mouseup", mouseDAble);
            }
            window.addEventListener("mousemove", mouseChk);
            return () => window.removeEventListener("mousemove", mouseChk);
        }
    }, [ clicked ]);


    return <div className={"pbar " + ( className || "" )} style={{
        ...style
    }} ref={ pbar_ref }>
        <div className="pback" style={{ width: `${Math.floor(movepc/10) * 10 || 0}%` }}></div>
        <div className="pbtn" style={{ left: `${Math.floor(movepc/10) * 10 || 0}%` }} onMouseDown={(e) => {
            setClicked(true);
        }} onMouseUp={ () => {
            setClicked(false);
            onEnd();
        } } ></div>
    </div>
}

export default PBar;