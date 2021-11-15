/* eslint-disable */

import { useEffect, useRef, useState } from "react";

// api resource
import json from "../../keys/api.json";

function MI() {

    const mapRef = useRef(null);
    const [ init, setInit ] = useState(false); // map init state

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

            setTimeout(async () => {
                await alert(kakao);
                setInit(true);
            }, 1000);


            return () => {
                // document.body.removeChild(scriptMapBase);
                // document.body.removeChild(scriptMapLib);
            }
        } else setTimeout(() => {
            kakao.maps.load(() => {
                console.log('map loaded');
                const n_map = new kakao.maps.Map(mapRef.current, {
                    center: new kakao.maps.LatLng(37.27983974701925, 127.04362143912854),
                    level: 3
                })
            })
        }, 1000)
    }, [ init ]);
    return <div className="MMap" ref={ mapRef } style={{ width: "100%", height: "100%" }}></div>
}

export default MI;