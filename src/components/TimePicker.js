import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/TimePicker.css";

function Slider({ values }) {

    const sliderRef = useRef(<></>);

    const _handleScroll = (y) => {
        console.log("scrolled", y);
        // console.log(e);
        // console.log(e.layerY, e.offsetY);
        // console.log(document.querySelector(".number-display").getBoundingClientRect());
    }

    useEffect(() => {
        _swipeEvent.addEventListener("toUp", _handleScroll);
        _swipeEvent.addEventListener("toDown", _handleScroll);
        return () => {
            _swipeEvent.removeEventListener("toUp", _handleScroll);
            _swipeEvent.removeEventListener("toDown", _handleScroll);
        }
    }, []);

        // swipe detection
        const [ eventList, setEL ] = useState({
            toUp: {},
            toDown: {}
        });
        const [ eventTimeA, setETA ] = useState(0);
        const [ eventTimeB, setETB ] = useState(0);
        const [ swipe_start, setSS ] = useState(-100);

        const SWIPE_STD = 20;

        const _swipeStartHandler = (e) => {
            setSS(e.touches[0].clientY);
        }
    
        const _swipeEndHandler = (e) => {
            // console.log("end");
            // console.log();
            if (swipe_start < 0) return;
            let mp = null;
            if (swipe_start + SWIPE_STD - e.touches[0].clientY < 0) mp = "toDown";
            else if (swipe_start - SWIPE_STD - e.touches[0].clientY > 0) mp = "toUp";
            
            // console.log(mp);
            // console.log(eventList[mp]);
            const t = new Date().getTime();
            setETA({ mp, e, time: t });
            setTimeout(() => {
                setETB({ mp, e, time: t });
            }, 50);
            // else console.log("ignored");
        }
    
        useEffect(() => {
            const { time: eA } = eventTimeA;
            const { time: eB, mp, e } = eventTimeB;
            if (eA == eB) if (eventList[mp] && !(swipe_start < 0)) 
            Object.values(eventList[mp]).forEach((fnc, i) => {
                try {
                    fnc(
                        (mp === "toDown") ? (e.touches[0].clientY - swipe_start) :
                        (mp === "toUp") ? (swipe_start - e.touches[0].clientY) :
                        0
                    )
                } catch(e) {
                    console.log(`Event Listener: Error on ${i} | ${fnc.name}`);
                    console.error(e);
                }
            })
        }, [ eventTimeB ]);
    
        const _swipeEvent = new function() {
            this.addEventListener = function(event, fnc) {
                const _new = eventList;
                _new[event][fnc.name || Object.values(eventList[event]).length] = fnc;
                setEL(_new);
                // console.log(_new);
            }
            this.removeEventListener = function(event, fnc) {
                const _new = eventList;
                delete _new[event][fnc.name];
                setEL(_new);
                // console.log(_new);
            }
            return this;
        }

    return <div className="slider" 
            onTouchStart={_swipeStartHandler} 
            onTouchMove={_swipeEndHandler}
        >
        <div className="split-bar bar-A"></div>
        <div className="split-bar bar-B"></div>
        <div className="number-display" ref={sliderRef}>
            {/* <div className="selection-display" style={{
                height: `${40*2 + values.length*40}px`,
                gridTemplateRows: `repeat(${values.length}, 40px)`
            }}>
                { (values.splice(0, 0, "") && values.splice(values.length, 0, "")) && values.map(v => (v.length == 0) ? <div style={{ height: "40px" }}></div> : <span>{ v }</span>) }
            </div> */}
        </div>
    </div>
}

function TimePicker({ className, style }) {

    const { mealfriend: { meet_time, list } } = useSelector(state => state.mobile);
    const dispatch = useDispatch();

    const rotaterRef = useRef(<></>);
    const hourRef = useRef(<></>);
    const minuteRef = useRef(<></>);

    const [ startpoint, setSP ] = useState([-100, -100]);
    const [ angle_calced, setAC ] = useState(-100);
    const [ mode, setMode ] = useState(0);
    const selectable = [
        [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
        // [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60 ]
        [ 15, 30, 45, 60 ]
    ]


    const _moveHandler = (e) => {
        if (startpoint[0] < 0 || startpoint[1] < 0 || mode < 0) return;
        const y = startpoint[1] - e.touches[0].clientY;
        const x = e.touches[0].clientX - startpoint[0];
        const angle = -Math.atan(y/x)*(180/Math.PI) + (x < 0 ? 180 : 0);
        const angle_calc = angle + 90;
        setAC(angle_calc);
        const angle_per_cell = 360 / (selectable[mode].length)
        const angle_rotate = (Math.floor(angle_calc/angle_per_cell)+1)*angle_per_cell - 90;

        // vibration
        if( Math.floor(angle)%angle_per_cell === 0 && window.navigator.vibrate ) window.navigator.vibrate(10);

        document.querySelector(".onEditing").style.transform = `translate(0, -50%) rotate(${angle_rotate}deg)`;
    }

    const _moveStartHandler = (_mode) => {
        setMode(_mode);
        document.querySelector(".onEditing").classList.toggle("onEditing");
        document.querySelectorAll(".needle")[_mode].classList.toggle("onEditing");
        const v = rotaterRef.current.getBoundingClientRect();
        return setSP([(v.x + ((v.width)/2)), (v.y + ((v.height)/2))]);
    }

    const _moveEndHandler = () => {
        if (angle_calced < 0) return;
        const angle_per_cell = 360 / (selectable[mode].length);
        let angle_rotate = (Math.floor(angle_calced/angle_per_cell)+1)*angle_per_cell - 90;
        const angle_recalced = angle_rotate - angle_calced;
        if(angle_recalced > -45) angle_rotate -= angle_per_cell;
        document.querySelector(".onEditing").style.transform = `translate(0, -50%) rotate(${angle_rotate}deg)`;
        setAC(-100);
        return setSP([-100, -100]);
    }

    return <div className={(className || "") + " time-picker"} style={style}>
        <div className="rotater" ref={rotaterRef} onTouchMove={_moveHandler}>
            <div className="needle hour-needle onEditing" ref={hourRef}><div className="circle" onTouchStart={() => _moveStartHandler(0)} onTouchEnd={_moveEndHandler}></div></div>
            <div className="needle minute-needle" ref={minuteRef}><div className="circle" onTouchStart={() => _moveStartHandler(1)} onTouchEnd={_moveEndHandler}></div></div>
            {
                selectable[mode].map((_, i) => <div className="cell-cover" style={{
                    transform: `translate(0, -50%) rotateZ(${-90+(360 / (selectable[mode].length)*i)}deg)`,
                    animationDelay: `${i*0.05}s`
                }}><div className="cell"></div></div>)
            }
        </div>
        <div className="time-display">
            <div className="displayer hour-display">
                
            </div>
            <div className="displayer minute-display">

            </div>
        </div>
        {/* <Slider values={[ "오전", "오후" ]}/>
        <Slider values={[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]}/>
        <Slider values={[ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60 ]}/> */}
    </div>
}

export default TimePicker;