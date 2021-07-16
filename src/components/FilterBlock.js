import "../css/FilterBlock.css"
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import filter from "../store/modules/filter";


function FilterBlock({ filterInfo, clickHandler, isActivated, children }) {

    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { filter: { list: filterList, activated: activatedG, deActivated: deActivatedG } } = state;
    const { filterUID: filterId, isSelectable } = filterInfo;

    const [ selOpen, setSelOpen ] = useState(false);
    const [ isSelected, setSelected ] = useState(false);
    const [ displayText, setDPT ] = useState("");

    useEffect(() => {
        if (isSelected) setSelOpen(false);
    }, [ isSelected ]);

    useEffect(() => {
        if (filterInfo.isOptionNeed) setSelOpen(true)
        else setSelected(true);
    }, [])

    return (
        <div className={`filterBlock filter_${filterId}`} filterid={filterId} isactivated={isActivated ? 1 : 0} onClick={clickHandler} style={ (isActivated && isSelected) ? {
            backgroundColor: "#005BAE",
            width: "90%",
            height: "50px"
        } : {
            backgroundColor: "white",
            width: "100px"
        }}>
            <p className="filterName" style={ (isActivated && isSelected) ? {
                color: "white",
                top: "50%",
                left: "30%",
                transform: "translate(-50%, -50%)",
                fontWeight: "500"
            } : {
                color: "#005BAE"
            }}>{filterInfo.filterName}</p>
            { (selOpen && isActivated) ? (
                <div className="optionSelector">
                    {(filterInfo && filterInfo[filterInfo.optionType]) && (
                        <div className="selections">
                            { filterInfo[filterInfo.optionType].option.map((v, i) => (
                                <div className="filter_select" option_index={i} optionid={v.id} onClick={(e) => {
                                    e.stopPropagation();
                                    let pos = e.currentTarget
                                    console.log(pos);
                                    pos.style.borderColor = null;
                                    pos.style.backgroundColor = "#005BAE";
                                    let prv = pos.children[0].innerText;
                                    pos.children[0].style.color = "white";
                                    pos.children[0].innerText = "✓";
                                    setTimeout(() => {
                                        pos.style.backgroundColor = null;
                                        pos.style.borderColor = null;
                                        pos.children[0].innerText = prv;
                                        pos.children[0].style.color = null;
                                        setDPT(prv);
                                        setSelected(true);
                                    }, 300);
                                }}>
                                    <p className="innerText">{v.text}</p>
                                </div>
                            )) }
                        </div>
                    )}
                </div>
            ) : isActivated && (
                <p className="optionValue">{displayText}</p>
            ) }
            {/* {
                (isActivated && filterList[filterId].isOptionNeed && !activatedG[g_idx].optionVal) && <>
                    <div className="optionInput">

                    </div>
                </>
            } */}
        </div>
    )
}

export default FilterBlock;