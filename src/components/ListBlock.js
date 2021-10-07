/* eslint-disable */

import { useState, useEffect, useRef } from "react";
import axios from "../connection/requester";

// components
import Button from "../components/Button";
import PBar from "../components/PBar"

// api
import { shop } from "../apis";

// css
import "../css/ListBlock.css";

// img
import marker1 from "../assets/img/num_marker/1.svg";
import marker2 from "../assets/img/num_marker/2.svg";
import marker3 from "../assets/img/num_marker/3.svg";
import marker4 from "../assets/img/num_marker/4.svg";
import marker5 from "../assets/img/num_marker/5.svg";
import marker6 from "../assets/img/num_marker/6.svg";
import marker7 from "../assets/img/num_marker/7.svg";
import marker8 from "../assets/img/num_marker/8.svg";
import marker9 from "../assets/img/num_marker/9.svg";
import marker10 from "../assets/img/num_marker/10.svg";
import marker_def from "../assets/img/marker.svg";



const marker_img = [
    marker1,
    marker2,
    marker3,
    marker4,
    marker5,
    marker6,
    marker7,
    marker8,
    marker9,
    marker10
];

function ListBlock({ style, info, _moveMap }) {
    return <div className="listBlock" style={style?.listBlock || style || {}} onClick={() => _moveMap( info )}>
        <p className="shopName" style={style?.shopName || {}}>{ info.name }</p>
        <p className="GPA_avg" style={style?.GPA_avg || {}}>{ info.review?.avg || "?" }</p>
        <p className="GPA_max" style={style?.GPA_max || {}}>/ 10</p>
        <p className="shopStat" style={style?.shopStat || {}} style={{ color: info.workTime?.color }}>{ info.workTime?.text }</p>
        {/* <p className="workTime">{ info.workTime?.totalTimes[new Date().getDay()].split("     ").map(text => <>{text}<br/></>) }</p> */}
        <p className="workTime" style={style?.workTime || {}}>{ info.workTime?.totalTimes[new Date().getDay()].split("     ")[0] }</p>
        <p className="isTrustGPA" style={style?.isTrustGPA || {}} style={{
            color: info.review?.isTrustHigh ? "var(--theme-color-D)" : "#AE0000"
        }} >{info.review?.avg ? `평점 신뢰도 ${ info.review?.isTrustHigh ? "높음" : "낮음"}` : "평점정보 없음" }</p>
    </div>
}

export default ListBlock;

export const SearchBlock = function ({ style, info, _moveMap }) {
    return <div className="listBlock" style={style?.listBlock || style || {}} onClick={() => _moveMap( info )}>
        <p className="shopName" style={style?.shopName || {}}>{ info.place_name }</p>
        <p className="shopAddr" style={style?.shopAddr || {}}>{ info.address_name }</p>
    </div>
}