import "../css/FilterBlock.css"
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";


function FilterBlock({ filterId, clickHandler, isActivated, children }) {

    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { filter: { list: filterList, activated: activatedG, deActivated: deActivatedG } } = state;

    // console.log(filterId);
    // console.log(filterList);
    // console.log(filterList[filterId]);

    let g_idx = -1;

    for(var i = 0; i < activatedG.length; i++) if (activatedG[i].filterUID == filterId) {
        g_idx = i; 
        break;
    }

    return (
        <div className={`filterBlock filter_${filterId}`} filterid={filterId} onClick={clickHandler} style={ isActivated ? {
            backgroundColor: "#005BAE",
            // width: "90%"
        } : {
            backgroundColor: "white",
            width: "100px"
        }}>
            <p className="filterName" style={isActivated ? {
                color: "white",
                left: "20px",
                transform: "translateY(-50%)"
            } : {
                color: "#005BAE"
            }}>{filterList[filterId].filterName}</p>
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