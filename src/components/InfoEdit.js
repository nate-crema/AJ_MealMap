import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/InfoEdit.css";

// img
import icn from "../assets/img/menu_icon/edit.svg";

function Switch({ enumerates, value, onChange, className, style }) {
    return <div className={"enum_switch " + (className || "")} style={style || {}}>
        { enumerates && enumerates.map((v, i) => <>
            <span className="enum_key" key={i}>{ v }</span>
        </>) }
    </div>
}

function DateSelector({ placeholder, onBlur, className, value, onChange }) {

    const [ area_splitunit, setASUnit ] = useState(24);
    const [ time_start, setTS ] = useState([0, 0]);
    const [ time_end, setTE ] = useState([0, 0]);
    const [ setter_active, setSA ] = useState(false);
    const obj = useRef(<></>);

    const [ ment, setMent ] = useState("이때부터 시작이에요:");

    return <div className="date-selector">
        <span className="title">{ ment }</span>
        <Switch enumerates={[ "오전", "오후" ]}/>
    </div>;
}

function InfoEdit({ className, infos: [ infos, updateInfos ], infos_list }) {

    // change management
    const [ mode, setMode ] = useState(false); // mode activation management
    const [ key, setKey ] = useState(""); // editing value's key
    const [ updated, setUpdated ] = useState(null); // updated value tmp savepoint

    const _changeEnd = () => {
        const update_obj = {};
        Object.keys(infos_list).map((info_key, i) => {
            const { valtype: type, list } = infos_list[info_key];
            if (key !== info_key) update_obj[info_key] = infos[info_key];
            else {
                switch(type) {
                    case "string": update_obj[info_key] = updated; break;
                    case "list-select": update_obj[info_key] = list[updated]; break;
                    case "date-select": update_obj[info_key] = null; break;
                    case "loc_object": update_obj[info_key] = updated; break;
                    case "boolean": update_obj[info_key] = updated; break;
                }
            }
        });
        updateInfos(update_obj);
        setUpdated(null);
        setKey("");
        setMode(false);
        console.log("change end");
    }


    return <div className={"infos_edit " + (className || "")} style={{
        height: "320px",
        overflowX: "hidden",
        overflowY: "auto",
        gridTemplateRows: `repeat(${ Object.values(infos_list).length }, 70px)`
    }}>
        { Object.keys(infos_list).map((info_key, i) => {
            const info = infos[info_key];
            let display;
            const { valtype: type, editable } = infos_list[info_key];
            switch(type) {
                case "string": display = info; break;
                case "list-select": display = typeof info == "string" ? info : null; break;
                case "date-select": display = typeof info == "string" ? info : null; break;
                case "loc_object": display = info.address; break;
                case "boolean": display = (info || false); break;
            }
            return <div className="info_row">
                <span className="col_title">{ infos_list[info_key].display }</span>

                {/* information display */}
                
                <span className="col_value" onClick={() => {
                    console.log(type);
                    if (type !== false) {
                        setKey(info_key);
                        setMode(type);
                    }
                }} style={{
                    cursor: (editable === false) ? "not-allowed" : "pointer",
                    color: !display && "lightgray",
                    animationName: (key === info_key) ? "val_change_start" : "val_change_end"
                }}>{ display || "확인된 정보 없음" }</span>
                
                {/* information edit */}
                { (mode !== false && key === info_key) && (
                    (mode === "string") ? <>
                        <input type="text" placeholder={ display || `'${infos_list[info_key].display}' 입력` } autoFocus={true} onBlur={_changeEnd} className="edit_string" value={updated} onChange={(e) => setUpdated(e.target.value)}/>
                    </>
                    : (mode === "number") ? <>
                        <input type="number" placeholder={ display || `'${infos_list[info_key].display}' 입력` } autoFocus={true} onBlur={_changeEnd} className="edit_string" value={updated} onChange={(e) => setUpdated(e.target.value)}/>
                    </>
                    : (mode === "date-select") ? 
                        <>
                            <DateSelector 
                                placeholder={ info }
                                onBlur={_changeEnd}
                                className="edit_string"
                                value={updated}
                                onChange={(e) => setUpdated(e.target.value)}
                            />
                        </>
                    : (mode === "list-select") ? <></>
                    : <></>
                ) }
                <img className="icon" src={icn}/>
            </div>
        } ) }
    </div>;
}

export default InfoEdit;