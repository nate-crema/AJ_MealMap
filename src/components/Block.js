import { useEffect, useState, useRef } from "react";

import "../css/Block.css";

function getWindowSize(idx) {
    return idx == 0 ? window.innerWidth : idx == 1 && window.innerHeight;
}

function Block({ title, subtext, color, img, htmlDoc, boxSize: _boxSize, style, imgCss, subTextCss, menu: _menu, changeMenu }) {

    const [ docSize, setDocSize ] = useState([getWindowSize(0), getWindowSize(1)]);
    const [ boxSize, setBoxSize ] = useState([400, 300, 'default']);

    // document handler
    const fncBlockDOM = useRef();
    
    // document resize event handler

    const _resizeHandler = () => {
        const width = getWindowSize(0);
        const height = getWindowSize(1);
        setDocSize([width , height]);
        let { style } = fncBlockDOM.current;
        style.width = null;
        style.height = null;
        setTimeout(() => {
            if (docSize[0] > ((_boxSize.cvtPoint && _boxSize.cvtPoint[0] == 0) ? _boxSize.cvtPoint[1] : 1000)) {
                let { offsetWidth, offsetHeight } = fncBlockDOM.current;
                style.width = offsetWidth + "px";
                style.height = offsetHeight + "px";
            } else {
                style.width = null;
                style.height = null;
            }
        }, 10);
    }

    useEffect(() => {
        window.addEventListener("resize", _resizeHandler)
        return () => window.removeEventListener("resize", _resizeHandler);
    }, []);

    useEffect(() => {
        console.log(`docSize updated: (${docSize[0]},${docSize[1]})`);
        if (_boxSize && _boxSize.cvtPoint) {
            if (docSize[_boxSize.cvtPoint[0]] >= _boxSize.cvtPoint[1]){
                if (_boxSize.PC) setBoxSize([
                        _boxSize.PC[2] ? _boxSize.PC[0] + _boxSize.PC[2] : _boxSize.PC[0],
                        _boxSize.PC[2] ? _boxSize.PC[1] + _boxSize.PC[2] : _boxSize.PC[1],
                        'PC'
                ])
                else setBoxSize([
                        _boxSize.default[2] ? _boxSize.default[0] + _boxSize.default[2] : _boxSize.default[0],
                        _boxSize.default[2] ? _boxSize.default[1] + _boxSize.default[2] : _boxSize.default[1],
                        'default'
                ])
            } else {
                if (_boxSize.Mobile) setBoxSize([
                        _boxSize.Mobile[2] ? _boxSize.Mobile[0] + _boxSize.Mobile[2] : _boxSize.Mobile[0],
                        _boxSize.Mobile[2] ? _boxSize.Mobile[1] + _boxSize.Mobile[2] : _boxSize.Mobile[1],
                        'Mobile'
                ])
                else setBoxSize([
                        _boxSize.default[2] ? _boxSize.default[0] + _boxSize.default[2] : _boxSize.default[0],
                        _boxSize.default[2] ? _boxSize.default[1] + _boxSize.default[2] : _boxSize.default[1],
                        'default'
                ])
            }
        } else setBoxSize([
                _boxSize ? _boxSize.default[0] : "100%",
                _boxSize ? _boxSize.default[1] : "300px",
                'default'
        ])
        console.log(`boxSize updated: (${boxSize[0]},${boxSize[1]}) || mode: ${boxSize[2]}`);
    }, [ docSize ]);
    
    return (
        <div className="fncBlock" ref={fncBlockDOM} style={{
            width: boxSize[0],
            height: boxSize[1]
        }} 
        style={Object.assign(style)}
        onMouseEnter={(e) => {
            let { style, offsetWidth, offsetHeight } = e.target;
            style.transition = "all .24s ease";
            style.width = offsetWidth + 10 + "px";
            style.height = offsetHeight + 10 + "px";
            // console.log(e.target.offsetWidth);
        }}
        onMouseLeave={(e) => {
            let { style, offsetWidth, offsetHeight } = e.target;
            style.width = offsetWidth - 10 + "px";
            style.height = offsetHeight - 10 + "px";
            setTimeout(() => {
                style.transition = "initial";
            }, 200);
            // console.log(e.target.offsetWidth);
        }}
        onClick={changeMenu}
        >
            <p className="title" style={{ color }}>{title}</p>
            <p className="subtext" style={Object.assign({ color }, subTextCss)}>{subtext}</p>
            <img className="boxImage" src={img} style={Object.assign({
                opacity: boxSize[2] == "Mobile" ? 0.3 : 1
            }, imgCss)}/>
        </div>
    )
}

export default Block;