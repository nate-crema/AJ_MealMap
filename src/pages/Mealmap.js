import { useEffect, useState } from "react";
import axios from "axios";

// css
import "../css/Mealmap.css";

// components
import KakaoMap from "../components/Map";


function Mealmap() {

    const [ location_text, setLocText ] = useState("핀 위치: 아주삼거리");
    const [ sort_text, setSortText ] = useState("평점순");

    const [ filter, setFilter ] = useState([]);
    const [ location, setLoc ] = useState({ lat: 37.27983974701925, long: 127.04362143912854 });

    // load list

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_BACKEND_HOST}/api/shopList`)
        .then(({ data }) => {
            console.log(data);
        })
    }, []);


    
    return <div className="mealmap serviceArea">
        <div className="mapArea mealmapArea">
            <div className="textArea">
                <p className="location_text innerText">{ location_text }</p>
            </div>
            <KakaoMap filter={filter} location={location} className="mapArea"/>
        </div>
        <div className="listArea mealmapArea">
            <div className="textArea">
                <p className="list_text innerText">리스트 ({ sort_text })</p>
                <p className="btn_cngSort">위치순 정렬</p>
            </div>
            <div className="shopList">
                
            </div>
        </div>
    </div>

}


export default Mealmap;