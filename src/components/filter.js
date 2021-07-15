import "../css/Filter.css";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import FilterBlock from "./FilterBlock";

// global functions

import { initMenu, changeMenuUI, setTitler, getNowInfo, loadList } from "../module/functions";


function Filter() {

    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { filter: { active, list: filterList, activated: activatedG, deActivated: deActivatedG } } = state;

    const [ activated, setActivated ] = useState([]);

    const filterRef = useRef(null);
    const btnRef = useRef(null);
    const contRef = useRef(null);
    
    const addActivated = (filterUID, filterVal) => {
        const setVal = [
            ...activated,
            filterUID
        ]
        setActivated(setVal)
        dispatch({ type: "filter/ACTIVATEFILTER", v: {
            filterUID,
            filterVal
        } })
    }

    const rmActivated = (filterUID) => {
        let setVal = [];
        activated.map((v) => (v != filterUID) && setVal.push(v));
        setActivated(setVal);
        dispatch({ type: "filter/DEACTIVATEFILTER", UID: filterUID });
    }

    const _filterActiveClickHandler = (e) => {
        e.stopPropagation();
        const filterId = e.currentTarget.getAttribute("filterid") * 1;
        const setStyle = filterList[filterId].setStyle;
        // console.log(e.currentTarget);
        console.log(filterId);
        // open option
        // console.log(filterList[filterId]);
        if (filterList[filterId].isOptionNeed) {
            setTimeout(() => {
                document.querySelector(`div[filterid='${filterId}']`).style.width = (setStyle && setStyle.width) ? setStyle.width : "90%";
                document.querySelector(`div[filterid='${filterId}']`).style.height = (setStyle && setStyle.height) ? setStyle.height : "210px";
                document.querySelector(`div[filterid='${filterId}']`).children[0].style.top = (setStyle && setStyle.top) ? setStyle.top : "22%";
                document.querySelector(`div[filterid='${filterId}']`).children[0].style.left = (setStyle && setStyle.left) ? setStyle.left : "30px";
                document.querySelector(`div[filterid='${filterId}']`).children[0].style.fontWeight = (setStyle && setStyle.fontWeight) ? setStyle.fontWeight : "500";
                document.querySelector(`div[filterid='${filterId}']`).children[0].style.fontSize = (setStyle && setStyle.fontSize) ? setStyle.fontSize : "17px";
            }, 100);
        } else {
            console.log("Option not needed");
        }
        addActivated(filterId);
    }

    const _filterDeActiveClickHandler = (e) => {
        e.stopPropagation();
        const filterId = e.currentTarget.getAttribute("filterid") * 1;
        if (e.currentTarget.style.height != "") {
            e.currentTarget.style.width = null;
            e.currentTarget.style.height = null;
            e.currentTarget.children[0].style.top = null;
            e.currentTarget.children[0].style.left = "20px";
            e.currentTarget.children[0].style.fontWeight = null;
            e.currentTarget.children[0].style.fontSize = null;
            setTimeout(() => {
                rmActivated(filterId);
            }, 200);
        } else rmActivated(filterId);
        // console.log(e.currentTarget);
    }

    useEffect(() => {
        // console.log(filterRef);
        filterRef.current.style.display = "block";
        setTimeout(() => {
            filterRef.current.style.opacity = 1;
        }, 500);
    }, [])

    useEffect(() => {
        if (active) {
            btnRef.current.style.left = "30%";
            btnRef.current.style.backgroundColor = "#005BAE";
            setTimeout(() => {
                filterRef.current.style.top = "calc(60% - 260px)";
                setTitler(null, false, document.querySelector("p.titler"));
                contRef.current.style.display = "block";
                setTimeout(() => contRef.current.style.opacity = "1", 150);
            }, 300);
        } else {
            btnRef.current.style.left = "0%";
            btnRef.current.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
            setTimeout(() => {
                filterRef.current.style.top = null;
                setTitler(null, true, document.querySelector("p.titler"));
                contRef.current.style.opacity = "0";
                setTimeout(() => contRef.current.style.display = "none", 150);
            }, 300);
        }
    }, [ active ])

    

    return (
        <div className="filter" ref={filterRef}>
            <p className="areaTitle">필터</p>
            <div className="ONOFF_filter">
                <div className="DOT" ref={btnRef} onClick={() => dispatch({ type: "filter/FILTERONOFF" })}>
                    <p className="text">{active ? "ON" : "OFF"}</p>
                </div>
            </div>
            <div className="fBlocks" ref={contRef}>    
                {
                    activatedG.map((v) => {
                        const { filterUID } = v;
                        return <FilterBlock 
                            filterId={filterUID}
                            isActivated={true}
                            clickHandler={_filterDeActiveClickHandler}    
                        />
                    })
                }
                {
                    deActivatedG.map((v) => {
                        const { filterUID, isSelectable } = v;
                        // console.log(v);
                        if (isSelectable && !activated.includes(filterUID)) return <FilterBlock
                            filterId={filterUID}
                            isActivated={false}
                            clickHandler={_filterActiveClickHandler}
                        />
                        else return <></>
                    })
                }
            </div>
        </div>
    )
}

export default Filter;