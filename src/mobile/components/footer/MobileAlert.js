import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/MobileAlert.css";

function AlertInnerBtn({ options, closeAlert }) {

    return <div className="alert-inner-btn" style={{ ...options?.style }} onMouseUp={() => setTimeout(() => {
        let alert_close = true;
        if (options?.onClick) alert_close = options.onClick();
        if ( alert_close !== false ) closeAlert();
    }, 200)}>
        <span>{ options.text }</span>
    </div>;
}

function MobileAlert() {

    const { mobile: { alert_object } } = useSelector(state => state);
    const dispatch = useDispatch();

    const [ isActive, setIsActive ] = useState(false);

    const closeAlert = () => {
        setIsActive(false);
        return dispatch({ type: "mobile/SETALERT", alert_object: null });
    }

    const _alertBackgroundClickHandler = ( event, alert_info ) => {
        if (alert_info?.onBackgroundClick) alert_info.onBackgroundClick( closeAlert );
    }

    useEffect(() => {
        console.log(alert_object);
        if (alert_object) setIsActive(true);
    }, [ alert_object ]);

    // test
    /*

    useEffect(() => {
        dispatch({ type: "mobile/SETALERT", alert_object: {
            type: "selectable",
            title: "선택한 n명의 친구들을 삭제할까요?",
            ment: "삭제한 친구는 회원님 목록과 삭제한 친구들의 ‘주변친구’ 목록에서만 지워져요.",
            style: {
                alerter_height: "350px",
                titleColor: "#aa2200"
            },
            selection: [
                { text: "취소", style: { color: "black" }, focus: true, onClick: () => {} },
                { text: "삭제", style: { color: "white", backgroundColor: "#aa2200" }, focus: true, onClick: () => {} },
            ]
        } })
    }, [])
    
    */

    return <>
        <div className="mobile-alert-background" style={{
            opacity: isActive ? "1" : "0",
            display: isActive ? "unset" : "none",
        }} onClick={ ( e ) => _alertBackgroundClickHandler( e, alert_object ) } ></div>
        <div className="mobile-alert" style={{
            bottom: isActive ? "0" : "-100px",
            height: isActive ? ( alert_object?.style?.alerter_height || "300px" ) : "0px"
        }}>
            {
                (isActive && alert_object) && <div className="mnoti-contents">
                    <p className="title" style={{ color: alert_object?.style?.titleColor }}>{ alert_object.title }</p>
                    <span className="ment" style={{ color: alert_object?.style?.mentColor }}>{ alert_object.ment }</span>
                    {
                        ( alert_object?.type == "component" ) && 
                            <div className="subrender-component">
                                { alert_object.component }
                            </div>
                    }

                    { 
                        // ( alert_object?.type == "selectable" ) ?
                        ( alert_object?.selection ) &&
                            <div className="btns" style={{
                                gridTemplateColumns: `repeat(${alert_object?.selection.length}, calc(${ 100 / alert_object?.selection.length }% - 6px))`
                            }}>
                                { alert_object?.selection.map(options => <AlertInnerBtn options={options} closeAlert={closeAlert}/>) }
                            </div>
                    }
                    
                </div>
            }
        </div>
    </>;
}

export default MobileAlert;