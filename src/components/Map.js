/* eslint-disable */

import { useEffect, useRef, useState } from "react";

// css
import "../css/Map.css";

// img
import alert_svg from "../assets/img/alert.svg";
import marker_img from "../assets/img/marker.svg";

// api resource
import json from "../keys/api.json";

function KakaoMap({ 
    parentMapState: [ map, setMap ] = useState(null), // kakao map object
    parentOverlayDisplayer: [ ro, setRO ] = useState(() => {}),
    parentMarkersCtrl: [ marked, setMarked ] = useState([]), // marked marker objects
    className, location, stat, display 
}) {

    // map load manage
    const [ map_loaded, setMapStat ] = stat; // map load state
    const [ init, setInit ] = useState(false); // map init state
    const mapRef = useRef(null); // map reference

    // map marking manage

    function revealOverlay(i) {
        try {
            const { overlay, marker: map_marker } = marked[i];
            let map_po = overlay.getMap();
            if(map_po == null) {
                // enable overlay
                overlay.setMap(map);
                // move center
                map.setCenter(map_marker.getPosition());
            }
            else overlay.setMap(null); // disable overlay
        } catch(e) {
            // console.error(e);
        }
    }

    

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
            kakao.maps.load(() => {
                console.log('map loaded');
                const n_map = new kakao.maps.Map(mapRef.current, {
                    center: new kakao.maps.LatLng(location.lat, location.long),
                    level: 3
                })
                setMap(n_map);
                let marked_marker = [];
                marked.forEach(v => marked_marker.push(v.marker));
                setMapStat(true);
                setRO(revealOverlay);
            })
        }, 1000)
    }, [ init ]);

    useEffect(() => {

        if (init && map) {
            let prev_markers = marked;
            display.forEach( (mark_info, i) => {

                console.log(`marker loading: ${i}`, mark_info)
                
                // create marker
                let map_marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng( mark_info.loc.lat, mark_info.loc.long ),
                    image: new kakao.maps.MarkerImage( marker_img, new kakao.maps.Size(51, 55) )
                });

                console.log("map_marker", map_marker)

                map_marker.setMap(map);

                let overlay = new kakao.maps.CustomOverlay({
                    content: mark_info.overlay,
                    map,
                    position: map_marker.getPosition()
                });

                overlay.setMap(null);

                // marker click handling
                kakao.maps.event.addListener(map_marker, 'click', () => revealOverlay(i));

                prev_markers.push( { marker: map_marker, overlay } );
            } )
            setMarked(prev_markers);
        }
    }, [ display, init ]);

    // useEffect(() => setInit(true), [ ]);
    

    return (
        <div id="KakaoMap" className={ className } ref={ mapRef }>
            <div className="map_notdp" style={{
                display: map ? "none" : "block"
            }}>
                <img src={alert_svg} className="svg"/>
                <p className="msg">지도가 표시되지 않나요?</p>
                <p className="btn" onClick={() => {
                    setInit(false)
                    setTimeout(() => {
                        if (!map) window.location.reload();
                    }, 5000);
                }}>클릭하여 다시 로드하기</p>
            </div>
        </div>
    )
}

export default KakaoMap;