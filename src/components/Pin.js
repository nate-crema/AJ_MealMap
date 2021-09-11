import { useState, useEffect, useCallback, useRef } from "react";

// css
import "../css/Pin.css";

function OnePin({ state, onClick, ref }) {
    
    const [ isActive, setActive ] = state;

    return <div className="one-pin"
        ref={ref}
        onClick={onClick} 
        style={{
            backgroundColor: isActive == 3 ? "#037ac7" : isActive == 2 ? "#006ed38f" : isActive == 1 ? "#008bae30" : "white"
        }}>
            { isActive == 3 && <svg version="1.1" className="sec_svg" id="secsvg_Layer_1" x="0px" y="0px" viewBox="0 0 500 500" style={{ enableBackground: "new 0 0 500 500" }}>
                    <path style={{
                        fill: "#FFFFFF00",
                        stroke: "white",
                        strokeWidth: "10",
                        strokeLinecap: "round",
                        strokeMiterlimit: "10"
                    }} d="M324.5,172.6l-88.4-44.9c-1.7-0.8-3.6-0.9-5.3,0l-87.1,43.1c-2.2,1.1-3.5,3.3-3.3,5.7
                        c1.9,27.7,16.4,191.2,93.1,191.2c70.4,0,87-115.4,90.7-139.2"/>
                    <path style={{
                        fill: "#FFFFFF00",
                        stroke: "white",
                        strokeWidth: "10",
                        strokeLinecap: "round",
                        strokeMiterlimit: "10"
                    }} d="M202,249.3l27.9,19.2c2,1.4,4.7,0.8,6-1.2l32.4-50.9"/>
                </svg>
            }
    </div>
}


function Pin({ digit = 4, className, style, onEnd = () => {} }) {

    const pinComps = [];
    const [ pin, setPin ] = useState("");
    const [ isIActived, setIActive ] = useState(false);
    const [ isListenAble, setLA ] = useState(false);
    const [ ued, setUED ] = useState(false);

    // pin area clicked handler
    const _oPClickHandler = (e) => {
        setIActive(!isIActived);
    }

    const _pressHandler = (e) => {
        console.log(e.key);
        const npin = !isNaN(e.key*1) ? (pin + e.key) : e.key == "Backspace" ? pin.substr(0, pin.length-1) : pin;
        let active = isIActived;
        setPin(npin);
        if (pin.length == 0 && e.key == "Backspace") active = false;
        if (npin.length >= 4) {
            active = false;
            setTimeout(() => {
                onEnd(npin, () => {});
            }, 300);
        }
        if (active) {
            for (let i = 0; i < npin.length; i++) pinComps[i].state[1](2);
            pinComps[npin.length].state[1](1);
            for (let j = npin.length+1; j < digit; j++) pinComps[j].state[1](0);
            // if (!isListenAble) setLA(true);
        } else {
            if (npin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
            else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
            // if (isListenAble) setLA(false);
        }
        setIActive(active);
    }

    // const _styleHandler = () => {
    //     if (isIActived) {
    //         for (let i = 0; i < pin.length; i++) pinComps[i].state[1](2);
    //         pinComps[pin.length].state[1](1);
    //         for (let j = pin.length+1; j < digit; j++) pinComps[j].state[1](0);
    //         // if (!isListenAble) setLA(true);
    //     } else {
    //         if (pin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
    //         else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
    //         // if (isListenAble) setLA(false);
    //     }
    // }

    useEffect(() => {
        if (isIActived) {
            for (let i = 0; i < pin.length; i++) pinComps[i].state[1](2);
            pinComps[pin.length].state[1](1);
            for (let j = pin.length+1; j < digit; j++) pinComps[j].state[1](0);
            // if (!isListenAble) setLA(true);
        } else {
            if (pin.length < digit) for (let i = 0; i < digit; i++) pinComps[i].state[1](0);
            else for (let i = 0; i < digit; i++) pinComps[i].state[1](3);
            // if (isListenAble) setLA(false);
        }
    }, [ isIActived ]);

    for (let i = 0; i < digit; i++) {
        pinComps.push(new function () {
            // this.ref = tref;
            // eslint-disable-next-line
            this.state = useState(0); // 0: inactive | 1: inputing | 2: inputed | 3: input_ended_all
            this.comp = <OnePin key={i} state={this.state} onClick={_oPClickHandler} />;
        });
    }


    return <div className={"pinwrap " + (className || "")} style={style} tabIndex="1" onKeyDown={_pressHandler}>
        { pinComps.map(({ comp }) => comp) }
    </div>
}

export default Pin;