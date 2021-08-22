import { useState, useEffect, useRef } from "react";

function ListSpec({ _ref, style, innerCont: { tAreaOnClick, shop_text } }) {
    useEffect(() => {
        console.log(_ref.current);
    }, []);
    return <div className="specArea mealmapArea" ref={_ref} style={{
        ...style,
        height: "50px",
        top: "30px"
    }}>
        <div className="textArea" onClick={() => tAreaOnClick()}>
            <p className="list_text innerText">가게정보</p>
            <zz></zz>
            <p className="btn_cngSort">{ shop_text }</p>
        </div>
    </div>
}

export default ListSpec;