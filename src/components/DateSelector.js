import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/DateSelector.css";

function DateSelector({ className, inputValue, action }) {

    const select_ragne = 30;
    const selectables = {
        hour: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
    }

    const lscrolled = useRef(new Date().getTime());
    const _scrollHandler = (e) => {
        const timestamp = new Date().getTime();
        lscrolled.current = timestamp;
        return setTimeout(() => {
            _scrollAction(timestamp, e);
        }, 500);
    }
    const _scrollAction = (timestamp, e) => {
        if ( lscrolled.current !== timestamp ) return;
        console.log('Detected', e);
    }

    

    return <>
        <div className={ className + " timeinfo_selector" } style={{
            gridTemplateColumns: `repeat(${ inputValue.length }, 33%)`
        }}>
            { inputValue.includes("hour") && <>
                <div className="swiping-selector selector-hour"
                    onScroll={ _scrollHandler }
                >
                    <span className="selectable-value" style={{
                        padding: "0",
                        height: "10px"
                    }}> </span>
                    { selectables.hour.map(v => <>
                        <span className="selectable-value">{ v }</span>
                    </>) }
                </div>
            </> }
        </div>
    </>;
}

export default DateSelector;