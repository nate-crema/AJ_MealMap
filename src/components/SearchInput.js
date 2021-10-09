import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../css/SearchInput.css";

function SearchInput({ className, valueState: [ value, setV ], style, disabled, svg, onClick, onFocus, onBlur, placeholder, _ref }) {

    const [ isFocus, setIF ] = useState(false);
    const inputRef = useRef(<></>);

    useEffect(() => {
        if (isFocus && onFocus) onFocus();
        else if (!isFocus && onBlur) onBlur();
    }, [ isFocus ]);

    return <div className={`search_input ${className || ""}`} style={style || {}} onClick={onClick} ref={_ref || null}>
        <span className="placeholder" style={{
            opacity: (isFocus || value.length != 0) ? "0" : "1"
        }} onClick={() => inputRef.current.focus()}>{ placeholder || "" }</span>
        <input 
            autoComplete="off"
            type="text"
            className="s_inptag" 
            style={{
                opacity: disabled && "0.6",
                fontSize: disabled && "15px"
            }}
            value={value} 
            ref={inputRef}
            onChange={(e) => setV(e.target.value)}
            id="search_input"
            disabled={disabled}
            onFocus={() => setIF(true)}
            onBlur={() => setIF(false)}
        />
        { 
            svg || <svg id="loupe" data-name="loupe (1)" width="29.3" height="29.299" viewBox="0 0 29.3 29.299">
                <g id="Group_9" data-name="Group 9">
                    <path id="Path_1" data-name="Path 1" d="M28.942,27.218,20.61,18.886a11.62,11.62,0,1,0-1.726,1.726l8.332,8.332a1.221,1.221,0,1,0,1.726-1.726ZM11.6,20.757A9.156,9.156,0,1,1,20.754,11.6,9.166,9.166,0,0,1,11.6,20.757Z" transform="translate(0 -0.003)" fill="#005bae"/>
                </g>
            </svg>
        }
    </div>
}

export default SearchInput;