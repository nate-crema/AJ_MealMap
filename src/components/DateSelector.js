import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/DateSelector.css";

// components
import MobileBtn from '../mobile/components/mobile_comps/MobileBtn';

function ScrollSelector({ 
    // scroll selector initials
    select_state, mode, updating, displayInvalidity,
    // language control settings
    lang = "en",
    // edit control settings
    editable_state,
    // initial value settings
    init = {}, init_assign = true,
}) {

    const selectables = {
        hour: {
            en: [ 
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
            ko: [ 
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
            ]
        },
        minute: {
            en: [ 
                { value: 0, display: "00" }, 
                { value: 10, display: "10" }, 
                { value: 20, display: "20" }, 
                { value: 30, display: "30" }, 
                { value: 40, display: "40" }, 
                { value: 50, display: "50" }
            ],
            ko: [ 
                { value: 0, display: "00" }, 
                { value: 10, display: "10" }, 
                { value: 20, display: "20" }, 
                { value: 30, display: "30" }, 
                { value: 40, display: "40" }, 
                { value: 50, display: "50" }
            ]
        },
        month: {
            en: [ 
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
            ko: [ 
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
            ]
        },
        day: {
            en: [ 
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
            ko: [ 
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
        },
        ampm: {
            en: [ 
                { value: 1, display: "AM" }, 
                { value: 2, display: "PM" }
            ],
            ko: [ 
                { value: 1, display: "오전" }, 
                { value: 2, display: "오후" }
            ]
        },
    }
    const [ selected, setSelected ] = select_state;
    const [ editable, setEditable ] = editable_state;

    // swiping-selector handler
        
    const auto_scroll = useRef(false);
    const [ scrolling, setScrolling ] = useState(false);
    const [ selection_area, setSelectionArea ] = useState(0);

    useEffect(() => {
        // calculate selection_aera_size
        const h = document.querySelector("span.selectable-value.r").getBoundingClientRect().height;
        setSelectionArea(h);
    }, [])

    useEffect(() => {
        // assign initial value scrollUI
        console.log(init[mode]);
        if ( init_assign && init[mode] !== undefined ) {
            const v = selectables[mode][lang].find(_v => _v.value === init[mode]); 
            setTimeout(() => {
                updateScrollUI(selectables[mode][lang].indexOf(v), selection_area);
            }, 300);
        }
    }, [ init_assign, selection_area ])

    const swipeRef = useRef();
    const lscrolled = useRef(new Date().getTime());

    const _scrollHandler = ( e, selection_area_size ) => {
        setScrolling(true);
        const timestamp = new Date().getTime();
        lscrolled.current = timestamp;
        return setTimeout(() => {
            _scrollAction( timestamp, e, selection_area_size ) ;
        }, 300);
    }

    const _scrollAction = ( timestamp, e, selection_area_size ) => {
        // check is scroll action ends
        if ( lscrolled.current !== timestamp || auto_scroll.current ) return;

        // get scroll position
        let scroll_position = Math.round(e.target.scrollTop/selection_area_size);
        // console.log(scroll_position, selectables[mode]);
        if ( selectables[mode][lang].length < (scroll_position + 1) ) scroll_position = selectables[mode][lang].length-1;
        // console.log(scroll_position);
        
        const scrolled = updateScrollUI( scroll_position, selection_area_size );

        // check value validity
        if ( (["month", "day"].includes(mode) && selected.month && selected.day ) && !checkValidity( selected.month, selected.day ) ) 
            displayInvalidity();
    }

    const updateScrollUI = ( scroll_position, selection_area_size ) => {
        // adjust scroll position
        auto_scroll.current = true;
        console.log("selection_area_size", selection_area_size)
        // if (selection_area_size === 0) selection_area_size = document.querySelector("div.selectable-value.r").clientHeight;
        let scroll_value = scroll_position * selection_area_size - 12
        console.log('update scroll to: ', scroll_value);
        swipeRef.current.scrollTop = scroll_value;
        auto_scroll.current = false;

        // update current selected state
        console.log(selectables, mode, lang, scroll_position);
        setSelected(prev => ({ ...prev, [ mode ]: selectables[mode][lang][scroll_position].value }));
        setScrolling(false);

        console.log( swipeRef?.current, swipeRef?.current?.scrollTop, scroll_value, scroll_position === 0 );

        setTimeout(() => {
            if ( scroll_position === 0 ) return;
            if ( swipeRef?.current && ( swipeRef?.current?.scrollTop !== scroll_value ) ) {
                updateScrollUI( scroll_position, selection_area_size );
            }
        }, 300);

        return scroll_value;
    }

    const checkValidity = ( v1, v2 ) => {
        // console.log(v1, v2);
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
            onScroll={ (e) => _scrollHandler(e, selection_area) }
            style={{
                overflowY: editable ? null : "hidden"
            }}
        >
            <span className="selectable-value" style={{
                padding: "0",
                height: "25px"
            }}> </span>
            { selectables[mode][lang].map((v, i) => <>
                <span key={i} className={ "selectable-value r" + ( ( selected[mode] === v.value ) ? " selected" : "" ) } style={{
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

function DateSelector({ 
    // date-selector defalut props
    inputValue, 
    // inner button action when clicked
    action,
    // outer action when all values inputed
    onValueSucceed,
    // for-css options
    className,
    // language settings
    displayKO,
    // value editing control
    editable: _editable = true, 
    // button display settings
    button,
    // initial value settings
    init, 
    // animation timing settings
    init_assign
}) {

    // selecter control
    const [ selected, setSelected ] = useState({});
    const [ updating, setUpdating ] = useState(false);
    const [ editable, setEditable ] = useState(true);

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

    // run outer action when value succeed
    useEffect(() => {
        if ( !submit_available ) return;
        if ( onValueSucceed ) return onValueSucceed( selected );
    }, [ submit_available ]);

    useEffect(() => {
        // set editable state
        if (_editable !== undefined) setEditable(_editable);
    }, [ _editable ]);

    return <>
        <div className={ className + " timeinfo_selector" } style={{
            // gridTemplateColumns: `repeat(${ inputValue.length }, 33%)`
        }}>
            { inputValue.includes("time") && <>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    editable_state={[ editable, setEditable ]}
                    init={ ( init && "hour" in init) ? { hour: init["hour"] } : {} }
                    init_assign={ init_assign }
                    mode="hour"
                />
                <span className="selector-separator">:</span>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    editable_state={[ editable, setEditable ]}
                    init={ ( init && "minute" in init) ? { minute: init["minute"] } : {} }
                    init_assign={ init_assign }
                    mode="minute"
                />
            </> }
            { inputValue.includes("date") && <>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    editable_state={[ editable, setEditable ]}
                    init={ ( init && "month" in init) ? { month: init["month"] } : {} }
                    init_assign={ init_assign }
                    mode="month"
                />
                <span className="selector-separator">/</span>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    editable_state={[ editable, setEditable ]}
                    init={ ( init && "day" in init) ? { day: init["day"] } : {} }
                    init_assign={ init_assign }
                    mode="day"
                />
            </> }
            { inputValue.includes("am/pm") && <>
                <ScrollSelector 
                    updating={[ updating, setUpdating ]}
                    select_state={[ selected, setSelected ]}
                    displayInvalidity={ _dateErrorHandler }
                    editable_state={[ editable, setEditable ]}
                    init={ ( init && "ampm" in init) ? { ampm: init["ampm"] } : {} }
                    init_assign={ init_assign }
                    mode="ampm"
                    lang={ displayKO ? "ko" : "en" } 
                />
            </> }
        </div>
        { (button !== false) && <MobileBtn className="selection" text={ ( !updating && submit_available ) ? "다음" : "기억나지 않아요" }
            type={ ( !updating && submit_available ) ? "0" : "1" }
            action={ action } 
        /> }
    </>;
}

export default DateSelector;