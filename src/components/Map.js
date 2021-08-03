import { useEffect, useRef, useState } from "react";

// api resource
import json from "../keys/api.json";

function KakaoMap({ className, location }) {

    const [ init, setInit ] = useState(false);
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
                const map = new kakao.maps.Map(mapRef.current, {
                    // eslint-disable-next-line
                    center: new kakao.maps.LatLng(location.lat, location.long),
                    level: 3
                })
            })
        }, 1000)
    }, [ init ]);

    // useEffect(() => setInit(true), [ ]);
    

    return (
        <div id="KakaoMap" className={ className } ref={ mapRef }></div>
    )
}

export default KakaoMap;