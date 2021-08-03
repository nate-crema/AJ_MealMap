import { useEffect, useState } from "react";
import axios from "axios";

// css
import "../css/Mealmap.css";

// components
import KakaoMap from "../components/Map";

function ShopCore({ info }) {
    return <div className="listBlock">
        <p className="shopName">{ info.name }</p>
        <p className="GPA_avg">{ info.review.avg }</p>
        <p className="GPA_max">/ 10</p>
        <p className="shopStat">{ info.workTime.text }</p>
        <p className="workTime">{ info.workTime.totalTimes[new Date().getDay()] }</p>
        <p className="isTrustGPA" style={{
            color: info.review.isTrustHigh ? "var(--theme-color-D)" : "#AE0000"
        }} >평점 신뢰도 { info.review.isTrustHigh ? "높음" : "낮음" }</p>
    </div>
}


function Mealmap({ window }) {

    // display text manage
    const [ location_text, setLocText ] = useState("핀 위치: 아주삼거리");
    const [ sort_text, setSortText ] = useState("평점순");

    // filter manage
    const [ filter, setFilter ] = useState([]);

    // map initial location manage
    const [ location, setLoc ] = useState({ lat: 37.27983974701925, long: 127.04362143912854 });

    // map list manage
    const [ list, setList ] = useState([]);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_HOST}/api/shopList`)
        .then(({ data }) => setList(data.list))
        .catch(e => alert("정보를 불러오지 못했습니다. 다시 시도해주세요.", e));
    }, []);

    useEffect(() => console.log("list: changed", list), [ list ]);


    
    return <div className="style-background-mobile"> {/* css on Wrapper.css */}
        <div className="mealmap serviceArea" id="serviceArea">
            { (window.width > 700) ? <div className="mapArea mealmapArea">
                <div className="textArea">
                    <p className="location_text innerText">{ location_text }</p>
                </div>
                <KakaoMap filter={filter} location={location} className="mapArea"/>
            </div> : <></> }
            <div className="listArea mealmapArea">
                <div className="textArea">
                    <p className="list_text innerText">리스트 ({ sort_text })</p>
                    <p className="btn_cngSort">거리순 정렬</p>
                </div>
                <div className="listBlocks">
                    { list.map((v, i) => <ShopCore info={v} key={i} />) }
                </div>
            </div>
        </div>
    </div>

}


export default Mealmap;