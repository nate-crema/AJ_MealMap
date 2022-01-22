import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/AlergicBlock.css";

// component
import FilterIcon from '../mobile/components/FilterIcon';

function AlergicBlock({ filterInfo, assign_count, auth }) {


    return <div className="filter-block">
        <div className="filter-icon-wrap" style={{
            boxShadow: assign_count === 0 ? "rgb(0 108 255 / 50%) 0px 2px 5px" : "rgb(190 51 51 / 50%) 0px 2px 5px"
        }}>
            <FilterIcon className="filter-icon" id={ filterInfo.type } color={ assign_count === 0 ? "var(--theme-color-C)" : "#BE3333" }/>
        </div>
        <span className="filter-name">{ filterInfo.name } { ( assign_count === 0 ) ? "허용" : "제외" }</span>
    </div>;
}

export default AlergicBlock;