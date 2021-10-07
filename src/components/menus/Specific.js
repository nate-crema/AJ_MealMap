import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../../css/Specific.css";

// components
import ListSpec from "../ListSpec";
import { Statistics } from "../Review";

function Specific() {

    // Global Variable
    const { content: spec } = useSelector(state => state.specific);
    const dispatch = useDispatch();

    const specRef = useRef(<></>);
    const specBlockRef = useRef(<></>);

    const _closeSpec = () => {
        specRef.current.style.animationName = "spec_out";
        setTimeout(() => {
            dispatch({ type: "spec/SETSPEC", content: null });
        }, 500);
    }


    return <div className="specific_wrap" ref={specRef}>
        <header className="specific_header">
            <span className="specific_title">"{ spec.name }" 상세정보</span>
            <span className="return" onClick={_closeSpec}>{"<"} 검색으로 돌아가기</span>
        </header>
        <ListSpec _ref={specBlockRef} className="spec_block" innerCont={{
            tAreaOnClick: () => {},
            shop_text: "",
            info: spec,
            isOpen: true
        }} />
        <div className="statistic_wrap">
            <span className="review_stats_title">리뷰 통계</span>
            <Statistics className="review_stats_block"/>
        </div>
    </div>
}

export default Specific;