import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/AlergicBlock.css";

// component
import FilterIcon from '../mobile/components/FilterIcon';

export const AlergicBlock = function({ filterInfo, assign_count, disable_count, state, auth, onClick }) {


    return <div className="filter-block" onClick={ () => onClick( filterInfo ) } >
        { auth === false && <>
            <div className="filter-click-blocker">
                <span>해제 불가</span>
            </div>
        </> }
        <div className="filter-icon-wrap" style={{
            boxShadow: ( assign_count === 0 || assign_count === disable_count ) ? "rgb(0 108 255 / 50%) 0px 2px 5px" : "rgb(190 51 51 / 50%) 0px 2px 5px"
        }}>
            <FilterIcon className="filter-icon" id={ filterInfo.type } color={ ( assign_count === 0 || assign_count === disable_count ) ? "var(--theme-color-C)" : "#BE3333" }/>
        </div>
        <span className="filter-name" style={{
            bottom: ( assign_count > 1 && disable_count > 0 ) ? "20px" : "10px"
        }}>{ filterInfo.name } { ( assign_count === 0 || assign_count === disable_count ) ? "허용" : "제외" }</span>
        { ( assign_count > 1 && disable_count > 0 ) && <span className="filter-disable-status">{ disable_count }/{ assign_count } 동의함</span> }
    </div>;
}

export const AlergicBlockList = function({
    meeting_info,
    mode,
    onClick, onAlergicFilterClick
}) {
    
    return <div className="filters-aligner" style={{
        width: `${ ( 80 + 20 ) * meeting_info.filter.length + 20 }px`
    }}>
        { meeting_info.filter.map( ({ cat, filterInfo, assign_count, disable_count, auth, state }) =>
        <AlergicBlock
            onClick={ 
                ( filter_info ) => 
                    ( cat === "alergic" ) ? 
                        onAlergicFilterClick ? 
                            onAlergicFilterClick( filter_info )
                            : onClick( filter_info )
                        : onClick( filter_info )
            }
            filterInfo={ filterInfo }
            disable_count={ disable_count }
            assign_count={ assign_count }
            auth={ mode === "edit" ? auth : true }
            state={ state }
        /> ) }
    </div>
}