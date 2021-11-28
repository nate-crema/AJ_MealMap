/* eslint-disable */

import { useState, useEffect, useRef } from "react";
import axios from "../connection/requester";

// components
import Button from "./Button";
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

function ListBlock({ className, style, info, _moveMap }) {

    const [ distance, setDistance ] = useState("계산중");

    const getPosition = async ({ coords }) => {
        try {
            console.log(coords);
            const { latitude, longitude } = coords;
            
            // const latitude = 37.27599431933007, longitude = 127.04515308567923

            // eslint-disable
            const startWCONG = new kakao.maps.LatLng( latitude, longitude );
            const endWCONG = new kakao.maps.LatLng( info.loc.lat, info.loc.long );
            // console.log(`lat: ${latitude}, long: ${longitude} => x: ${WCongNaMul.toCoords().getX()}, y: ${WCongNaMul.toCoords().getY()}`);
            const { data: s_distance } = await axios.post(`/shop/distance`, {
                shop_id: info._id,
                coords: {
                    SLatLong: {
                        lat: latitude,
                        long: longitude
                    },
                    ELatLong: {
                        lat: info.loc.lat,
                        long: info.loc.long
                    },
                    SWCongNaMul: {
                        x: startWCONG.toCoords().getX(),
                        y: startWCONG.toCoords().getY()
                    },
                    EWCongNaMul: {
                        x: endWCONG.toCoords().getX(),
                        y: endWCONG.toCoords().getY()
                    }
                }
            })
            console.log(s_distance);

            const { long: { avg: long }, time: { avg: time } } = s_distance;

            setDistance(long == 'too_long' ? '너무 멂' : `${Math.floor(long)}m`)
            // eslint-enable
        } catch(e) {
            console.error(e);
            // alert("거리 조회중 오류가 발생하였습니다. 다시 시도해주세요");
            setDistance("알 수 없음");
        }
    }

    const _distanceCalcHandler = () => {
        if (navigator.geolocation) {
            setDistance("계산중");
            navigator.geolocation.getCurrentPosition(getPosition, () => {
                // alert("위치정보 이용을 거부하여 거리를 표시할 수 없습니다.");
                setDistance('다시계산');
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 1
            })
        } else {
            // alert("위치정보를 사용할 수 없는 기기입니다. 다른 브라우저나 기기에서 접속해주세요.");
        }
    }

    useEffect(() => {
        _distanceCalcHandler();
    }, []);


    return <div className={ className + " listBlock" } style={style?.listBlock || style || {}} onClick={() => _moveMap( info )}>
        <div className="cont-wrapper">
            <div className="top-line">
                <span className="shopName" style={style?.shopName || {}}>{ info.name }</span>
                <span className="distance" onClick={(e) => {
                    e.stopPropagation();
                    _distanceCalcHandler();
                }} style={style?.distance || {}}>{ distance }</span>
            </div>
            <div className="gpa">
                <span className="GPA_avg" style={style?.GPA_avg || {}}>{ info.review?.avg || "?" }</span>
                <span className="GPA_max" style={style?.GPA_max || {}}>/ 10</span>
            </div>
            { [0, 7].includes(info.workTime?.status) ? 
                <span className="workTime" style={style?.workTime || {}}>{ info.workTime?.totalTimes[new Date().getDay()].split("     ")[0] }</span>
                : <span className="shopStat" style={style?.shopStat || {}} style={{ color: info.workTime?.color }}>{ info.workTime?.text }</span>
            }
        </div>
        {/* <p className="workTime">{ info.workTime?.totalTimes[new Date().getDay()].split("     ").map(text => <>{text}<br/></>) }</p> */}
    </div>
}

export default ListBlock;

export const SearchBlock = function ({ style, info, _moveMap }) {
    return <div className="listBlock" style={style?.listBlock || style || {}} onClick={() => _moveMap( info )}>
        <p className="shopName" style={style?.shopName || {}}>{ info.place_name }</p>
        <p className="shopAddr" style={style?.shopAddr || {}}>{ info.address_name }</p>
    </div>
}