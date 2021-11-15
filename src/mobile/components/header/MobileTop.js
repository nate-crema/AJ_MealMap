import { useState, useEffect, useRef } from 'react';

// css
import "../../../css/MobileTop.css";

// logo
import { Logo } from '../../../components/MenuBar';

export const MobileTop = function({ width, height }) {
    
    const [ keyword, setKeyWord ] = useState("");
    const [ isActive, setActive ] = useState("");

    const inputRef = useRef(<></>);

    useEffect(() => {
        if (!isActive) return;
        const _enterHandler = function(e) {
            if (e.keyCode == 13) inputRef.current.blur();
        }
        document.addEventListener("keypress", _enterHandler);
        return () => {
            document.removeEventListener("keypress", _enterHandler);
        }
    }, [ isActive ]);

    return <div className="mobile-top">
        <div className="logo" style={{
            width: isActive ? "0" : null
        }}>
            <div className="logo-wrap">
                <Logo/>
            </div>
            <div className="split-bar"></div>
        </div>
        <div className="input" onClick={() => inputRef.current.focus()}  style={{
            width: isActive ? "90%" : null,
            left: isActive ? "20px" : null
        }}>
            <span className="placeholder" style={{
                opacity: keyword.length > 0 ? "0" : "1"
            }}>배고파아ㅏㅏㅏㅏ</span>
            <input type="text" value={keyword} ref={inputRef} className="input_tag" onFocus={() => setActive(true)} onBlur={() => setActive(false)} onChange={(e) => setKeyWord(e.target.value)} />
        </div>
    </div>
}