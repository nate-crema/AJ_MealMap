import { useEffect, useRef, useState } from "react";

// css
import "../css/Map.css";

// img
import alert_svg from "../assets/img/alert.svg";

// api resource
import json from "../keys/api.json";

function KakaoMap({ className, location }) {

    const [ init, setInit ] = useState(false);
    const [ map, setMap ] = useState(null);
    const mapRef = useRef(null);;

    useEffect(() => {
        if (!init) {

            // map import
            const APIKEY = json.kakao.web;

            const scriptMapBase = document.createElement('script');
            scriptMapBase.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIKEY}&autoload=false`;
            scriptMapBase.async = false;
            document.body.appendChild(scriptMapBase);

            const scriptMapLib = document.createElement('script');
            scriptMapLib.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIKEY}&libraries=services,clusterer,drawing&autoload=false`;
            scriptMapLib.async = false;
            document.body.appendChild(scriptMapLib);

            setInit(true);

            return () => {
                // document.body.removeChild(scriptMapBase);
                // document.body.removeChild(scriptMapLib);
            }
        } else setTimeout(() => {
            // eslint-disable-next-line
            kakao.maps.load(() => {
                console.log('map loaded');
                // eslint-disable-next-line
                const n_map = new kakao.maps.Map(mapRef.current, {
                    // eslint-disable-next-line
                    center: new kakao.maps.LatLng(location.lat, location.long),
                    level: 3
                })
                setMap(n_map);
            })
        }, 1000)
    }, [ init ]);

    // useEffect(() => setInit(true), [ ]);
    

    return (
        <div id="KakaoMap" className={ className } ref={ mapRef }>
            <div className="map_notdp" style={{
                display: map ? "none" : "block"
            }}>
                <img src={alert_svg} className="svg"/>
                <p className="msg">지도가 표시되지 않나요?</p>
                <p className="btn" onClick={() => setInit(false)}>클릭하여 다시 로드하기</p>
            </div>
        </div>
    )
}

export default KakaoMap;