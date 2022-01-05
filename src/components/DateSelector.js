import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/DateSelector.css";

// components
import MobileBtn from '../mobile/components/mobile_comps/MobileBtn';

function ScrollSelector({ select_state, mode, updating, displayInvalidity }) {

    const selectables = {
        hour: [ 
            { value: 1, display: "01" }, 
            { value: 2, display: "02" }, 
            { value: 3, display: "03" }, 
            { value: 4, display: "04" }, 
            { value: 5, display: "05" }, 
            { value: 6, display: "06" }, 
            { value: 7, display: "07" }, 
            { value: 8, display: "08" }, 
            { value: 9, display: "09" }, 
            { value: 10, display: "10" }, 
            { value: 11, display: "11" }, 
            { value: 12, display: "12" }
        ],
        minute: [ 
            { value: 0, display: "00" }, 
            { value: 10, display: "10" }, 
            { value: 20, display: "20" }, 
            { value: 30, display: "30" }, 
            { value: 40, display: "40" }, 
            { value: 50, display: "50" }
        ],
        month: [ 
            { value: 1, display: "01" }, 
            { value: 2, display: "02" }, 
            { value: 3, display: "03" }, 
            { value: 4, display: "04" }, 
            { value: 5, display: "05" }, 
            { value: 6, display: "06" }, 
            { value: 7, display: "07" }, 
            { value: 8, display: "08" }, 
            { value: 9, display: "09" }, 
            { value: 10, display: "10" }, 
            { value: 11, display: "11" }, 
            { value: 12, display: "12" }
        ],
        day: [ 
            { value: 1, display: "01" }, 
            { value: 2, display: "02" }, 
            { value: 3, display: "03" }, 
            { value: 4, display: "04" }, 
            { value: 5, display: "05" }, 
            { value: 6, display: "06" }, 
            { value: 7, display: "07" }, 
            { value: 8, display: "08" }, 
            { value: 9, display: "09" }, 
            { value: 10, display: "10" }, 
            { value: 11, display: "11" }, 
            { value: 12, display: "12" }, 
            { value: 13, display: "13" }, 
            { value: 14, display: "14" }, 
            { value: 15, display: "15" }, 
            { value: 16, display: "16" }, 
            { value: 17, display: "17" }, 
            { value: 18, display: "18" }, 
            { value: 19, display: "19" }, 
            { value: 20, display: "20" }, 
            { value: 21, display: "21" }, 
            { value: 22, display: "22" }, 
            { value: 23, display: "23" }, 
            { value: 24, display: "24" }, 
            { value: 25, display: "25" }, 
            { value: 26, display: "26" }, 
            { value: 27, display: "27" }, 
            { value: 28, display: "28" }, 
            { value: 29, display: "29" }, 
            { value: 30, display: "30" }, 
            { value: 31, display: "31" }
        ],
        ampm: [ 
            { value: 1, display: "AM" }, 
            { value: 2, display: "PM" }
        ],
    }
    const [ selected, setSelected ] = select_state;

    // swiping-selector handler
        
    const auto_scroll = useRef(false);
    const [ scrolling, setScrolling ] = useState(false);

    const swipeRef = useRef();
    const lscrolled = useRef(new Date().getTime());

    const _scrollHandler = ( e ) => {
        setScrolling(true);
        const timestamp = new Date().getTime();
        lscrolled.current = timestamp;
        return setTimeout(() => {
            _scrollAction( timestamp, e) ;
        }, 300);
    }

    const _scrollAction = ( timestamp, e ) => {
        // check is scroll action ends
        if ( lscrolled.current !== timestamp || auto_scroll.current ) return;

        // get scroll position
        let scroll_position = Math.round(e.target.scrollTop/71);
        console.log(scroll_position, selectables[mode]);
        if ( selectables[mode].length < (scroll_position + 1) ) scroll_position = selectables[mode][selectables[mode].length-1].value-1;
        console.log(scroll_position);
        
        // adjust scroll position
        auto_scroll.current = true;
        swipeRef.current.scrollTop = scroll_position * 71 - 12;
        auto_scroll.current = false;
        
        // update current selected state
        setSelected(prev => ({ ...prev, [ mode ]: selectables[mode][scroll_position].value }));
        setScrolling(false);

        // check value validity
        if ( (["month", "day"].includes(mode) && selected.month && selected.day ) && !checkValidity( selected.month, selected.day ) ) 
            displayInvalidity();
    }

    const checkValidity = ( v1, v2 ) => {
        console.log(v1, v2);
        const today = new Date();
        let year = ( (new Date(`${today.getFullYear()}.${v1}.${v2}`).getTime - today.getTime) > 0 ) ? today.getFullYear()-1: today.getFullYear();
        
        if ( ["month", "day"].includes(mode) &&
            ( 
                (new Date(`${year}.${v1}.${v2}`).getMonth()+1) !== v1 ||
                new Date(`${year}.${v1}.${v2}`).getDate() !== v2
            )
        ) return false;
        return true;
    }

    useEffect(() => {
        updating[1](scrolling);
    }, [ scrolling ]);

    return <div className='scroll-selector-wrap'>
        <div className="value-focus-bar bar-top"></div>
        <div className="value-focus-bar bar-bottom"></div>
        <div className={ `scroll-selector selector-${ mode }` }
            ref={ swipeRef }
            onScroll={ _scrollHandler }
        >
            <span className="selectable-value" style={{
                padding: "0",
                height: "20px"
            }}> </span>
            { selectables[mode].map((v, i) => <>
                <span className={ "selectable-value r" + ( ( selected[mode] === v.value ) ? " selected" : "" ) } style={{
                    padding: ( (i === 0) && selected[mode] === v.value ) && "12px 0px 0px 0px",
                    color: scrolling && "var(--theme-color-C)"
                }}>{ v.display }</span>
            </>) }
            <span className="selectable-value" style={{
                padding: "0",
                height: "70px"
            }}> </span>
        </div>
    </div>
}

function DateSelector({ className, inputValue, action }) {

    // selecter control
    const [ selected, setSelected ] = useState({});
    const [ updating, setUpdating ] = useState(false);

    const _dateErrorHandler = () => {
        console.log('Invalid Date');
    }

    // button control
    const [ submit_available, setSubmitAvailable ] = useState(false);
    
    useEffect(() => {
        let endpoint = inputValue.length;
        if (inputValue.includes("time")) endpoint++;
        if (inputValue.includes("date")) endpoint++;
        if ( Object.keys(selected).length === endpoint ) setSubmitAvailable(true);
    }, [ selected ]);

    return <>
        <div className={ className + " timeinfo_selector" } style={{
            // gridTemplateColumns: `repeat(${ inputValue.length }, 33%)`
        }}>
            { inputValue.includes("time") && <>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    mode="hour"
                />
                <span className="selector-separator">:</span>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    mode="minute"
                />
            </> }
            { inputValue.includes("date") && <>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    mode="month"
                />
                <span className="selector-separator">/</span>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    mode="day"
                />
            </> }
            { inputValue.includes("am/pm") && <>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    mode="ampm"
                />
            </> }
        </div>
        <MobileBtn className="selection" text={ ( !updating && submit_available ) ? "다음" : "기억나지 않아요" }
            type={ ( !updating && submit_available ) ? "0" : "1" }
            action={ action } 
        />
    </>;
}

export default DateSelector;