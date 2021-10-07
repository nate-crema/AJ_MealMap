import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../css/SearchInput.css";

function SearchInput({ className, valueState: [ value, setV ] }) {
    return <div className={`search_input ${className || ""}`}>
        <input type="text" className="s_inptag" value={value} onChange={(e) => setV(e.target.value)} id="search_input"/>
        <svg id="loupe" data-name="loupe (1)" width="29.3" height="29.299" viewBox="0 0 29.3 29.299">
            <g id="Group_9" data-name="Group 9">
                <path id="Path_1" data-name="Path 1" d="M28.942,27.218,20.61,18.886a11.62,11.62,0,1,0-1.726,1.726l8.332,8.332a1.221,1.221,0,1,0,1.726-1.726ZM11.6,20.757A9.156,9.156,0,1,1,20.754,11.6,9.166,9.166,0,0,1,11.6,20.757Z" transform="translate(0 -0.003)" fill="#005bae"/>
            </g>
        </svg>
    </div>
}

export default SearchInput;