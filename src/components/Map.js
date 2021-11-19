/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../css/Map.css";
import "../css/MapOverlay.css";

// img
import alert_svg from "../assets/img/alert.svg";
import marker_img from "../assets/img/marker.svg";

// api resource
import json from "../keys/api.json";

function Map({ 
    mapObject: [ map, setMap ] = useState(null), // kakao map object
    parentMarkersCtrl: [ marked, setMarked ] = useState([]), // marked marker objects
    stat: [ map_loaded, setMapStat ] = useState(false), // map load state
    init: [ init, setInit ] = useState(false), // map init state
    className, location, display 
}) {

    // Global Variable
    const { updated: marker_list_upoint, mapto: remote_movepoint, raw: marker_list_raw, display: marker_list_display, customClick, customClickedPo } = useSelector(state => state.map);
    const dispatch = useDispatch();

    // MAP |-------------
        const mapRef = useRef(null);
        
        // load initial map library
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
                    if (map == null) {
                        const n_map = new kakao.maps.Map(mapRef.current || document.getElementById("KakaoMap"), {
                            center: new kakao.maps.LatLng(location.lat, location.long),
                            level: 3
                        })
                        console.log(n_map.addListener);
                        setMap(n_map);
                        let marked_marker = [];
                        marked.forEach(v => marked_marker.push(v.marker));
                        setMapStat(true);
                        dispatch({ type: "map/SETMSTAT", stat: true });
                    }
                })
            }, 1000)
        }, [ init ]);

    // MAP - Position Remote Move
    
        useEffect(() => {
            if (map_loaded) {
                const info = marker_list_raw.find(v => v._id == remote_movepoint);
                const displayed = getMarkers(marker_list_display, remote_movepoint);
                if (info) {
                    const moveLatLon = new kakao.maps.LatLng(info.loc.lat, info.loc.long);
                    map.setLevel(1);
                    map.panTo(moveLatLon);

                    // open overlay
                    displayed.overlay.setMap(map);
                }
            }
        }, [ remote_movepoint ]);

    // MAP - Restrict |------------

        // Out-Of-Range Notification Handler

        const harversine = (lat, long) => {
            return 2 * 6371 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat[1]-lat[0])/2), 2) + (Math.cos(lat[1]) * Math.cos(lat[0]) * Math.pow(Math.sin((long[1]-long[0])/2), 2))))
        }

        useEffect(() => {
            if (map_loaded) {
                kakao.maps.event.addListener(map, 'dragend', function() {        
                
                    // 지도 중심좌표를 얻어옵니다 
                    const latlng = map.getCenter(); 
                    const lat = latlng.getLat();
                    const lng = latlng.getLng();
                    // console.log(harversine([ (lat*1) * (Math.PI/180), (37.282857175308095) * (Math.PI/180) ], [ (lng*1) * (Math.PI/180), (127.04644412955818) * (Math.PI/180) ]));
        
                    if (harversine([ (lat*1) * (Math.PI/180), (37.282857175308095) * (Math.PI/180) ], [ (lng*1) * (Math.PI/180), (127.04644412955818) * (Math.PI/180) ]) > 1.05) {
                        dispatch({ type: "noti/ADDNOTIFICATION", noti: {
                            type: 0,
                            display: "timeout",
                            time: 5,
                            content: "[경고] 지도에서 밀맵 지원범위를 벗어났습니다. \n푸른색으로 표시되지 않은 지역에서 이용해주세요.",
                            option: {
                                text: "per-line"
                            },
                            keys: new Date().getTime()
                        } })
                    }
                    
                });
            }    
        }, [ map_loaded ]);

        // Color Wrapper Handler

        useEffect(() => {
            if (map_loaded) {
                const ban = [
                    new kakao.maps.LatLng(0, 180),
                    new kakao.maps.LatLng(0, 0),
                    new kakao.maps.LatLng(90, -180),
                    new kakao.maps.LatLng(90, 0)
                ]
                const allow = [
                    new kakao.maps.LatLng(37.292150923689306, 127.04671254886877),
                    new kakao.maps.LatLng(37.28595454452496, 127.03908556724028),
                    new kakao.maps.LatLng(37.28505365392358, 127.03863403264188),
                    new kakao.maps.LatLng(37.283684133605824, 127.03845290835254),
                    new kakao.maps.LatLng(37.28278313845068, 127.03831713341029),
                    new kakao.maps.LatLng(37.2822426745258, 127.03782070233348),
                    new kakao.maps.LatLng(37.28069305859922, 127.03727867576553),
                    new kakao.maps.LatLng(37.27975593482548, 127.037413524701),
                    new kakao.maps.LatLng(37.27881869575131, 127.03790919541098),
                    new kakao.maps.LatLng(37.2778095022654, 127.03799889439149),
                    new kakao.maps.LatLng(37.277124769698666, 127.03781814165832),
                    new kakao.maps.LatLng(37.276764252419504, 127.03813367474189),
                    new kakao.maps.LatLng(37.27607872945015, 127.04034330296625),
                    new kakao.maps.LatLng(37.27510447150301, 127.04354494902292),
                    new kakao.maps.LatLng(37.27427439985684, 127.04647599909195),
                    new kakao.maps.LatLng(37.273805210342275, 127.04809931617807),
                    new kakao.maps.LatLng(37.27524568615779, 127.05094159639897),
                    new kakao.maps.LatLng(37.27650694721778, 127.05139346394216),
                    new kakao.maps.LatLng(37.278705287487384, 127.05184598929524),
                    new kakao.maps.LatLng(37.28090364510721, 127.05225343667033),
                    new kakao.maps.LatLng(37.28220080046888, 127.05302112119728),
                    new kakao.maps.LatLng(37.28349770335458, 127.0543301031416),
                    new kakao.maps.LatLng(37.284722487147654, 127.05568418360136),
                    new kakao.maps.LatLng(37.2851547511993, 127.05618067826455),
                    new kakao.maps.LatLng(37.28670558622614, 127.05392643871616),
                    new kakao.maps.LatLng(37.28829228124738, 127.05198789276228),
                    new kakao.maps.LatLng(37.29020362076905, 127.04932772143783),
                    new kakao.maps.LatLng(37.29193465685529, 127.04675752613119)
                ];
                const color_wrapper = new kakao.maps.Polygon({
                    map,
                    path: [ ban, allow ],
                    strokeWidth: 2,
                    strokeColor: "var(--theme-color-C)",
                    strokeOpacity: 0.7,
                    fillColor: "var(--theme-color-C)",
                    fillOpacity: 0.2
                })
            }
        }, [ map_loaded ])
        
    // MAP - ClickEventHandler |--------------

        const _customClick = function(e) {
            dispatch({ type: "map/SETMCPO", lat: e.latLng.toString().slice(1, -1).split(", ")[0]*1, lng: e.latLng.toString().slice(1, -1).split(", ")[1]*1 });
        }

        useEffect(() => {
            if (map_loaded && init) {
                console.log(`custom click status: ${customClick}`);
                if (customClick) {
                    console.log(`active map click listener`);
                    kakao.maps.event.addListener(map, 'click', _customClick);
                } else {
                    console.log(`deactive map click listener`);
                    kakao.maps.event.removeListener(map, 'click', _customClick);
                }
            }
        }, [ customClick ]);

    // MAP - Marker |-------------

        // data -> custom marker object
        function dataToCustomMarker(datas) {
            const ret = [];
            datas.forEach((data, i) => {
                ret.push({
                    loc: data.loc,
                    overlay: data.overlay == false ? null : `
                        <div class="custom_overlay_mmap" id="mmap_overlay" >
                            <span class="shop_name">${ data.name }</span>
                            <span class="shop_cat">${ data.cat?.subcat }</span>
                            <span class="shop_GPA">${ data.review?.avg }</span>
                            <span class="GPA_max">/10</span>
                            <div class="btn_fnc btn_cmp" style="cursor: ${'pointer'}">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                        viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
                                    <style type="text/css">
                                        .st0{fill:none;stroke:#000000;stroke-width:13;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
                                    </style>
                                    <g>
                                        <polyline class="st0" points="146.72,121.09 243.08,217.44 147.69,312.83 	"/>
                                        <polyline class="st0" points="353.42,379.07 257.06,282.72 352.45,187.33 	"/>
                                    </g>
                                </svg>
                            </div>
                            <div class="btn_fnc btn_stm" style="cursor: ${'not-allowed'}">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                        viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
                                    <style type="text/css">
                                        .st0{fill:#FFFFFF;stroke:#000000;stroke-width:10;stroke-miterlimit:10;}
                                    </style>
                                    <path class="st0" d="M126.5,365.63V134.37c0-31.96,25.91-57.87,57.87-57.87h131.26c31.96,0,57.87,25.91,57.87,57.87v231.26
                                        c0,31.96-25.91,57.87-57.87,57.87H184.37C152.41,423.5,126.5,397.59,126.5,365.63z"/>
                                    <g>
                                        <g>
                                            <path class="st0" d="M303.11,235.4l-41.74-30.84c-6.21-4.59-15.01-0.15-15.01,7.57v15.04c-22.88,3.97-55.45,47.98-53.17,67.83
                                                c0.3,2.64,3.93,3.16,4.95,0.7c6-14.41,24.15-34.01,48.22-36.23v14.34c0,7.73,8.79,12.16,15.01,7.57l41.74-30.84
                                                C308.2,246.78,308.2,239.17,303.11,235.4z"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div class="btn_fnc btn_info" id="btn_info_overlay_${data._id}" style="cursor: ${'pointer'}">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
                                    <style type="text/css">
                                        .st0{fill:#FFFFFF;stroke:#000000;stroke-width:13;stroke-miterlimit:10;}
                                    </style>
                                    <g>
                                        <circle class="st0" cx="246.08" cy="248.68" r="171.73"/>
                                        <g>
                                            <path d="M258.43,182.04c0.23,6.8-4.76,12.24-12.7,12.24c-7.03,0-12.02-5.44-12.02-12.24c0-7.03,5.22-12.47,12.47-12.47
                                                C253.67,169.57,258.43,175.01,258.43,182.04z M236.21,317.87V217.59c0-2.61,2.11-4.72,4.72-4.72h10.5c2.61,0,4.72,2.11,4.72,4.72
                                                v100.28c0,2.61-2.11,4.72-4.72,4.72h-10.5C238.33,322.59,236.21,320.48,236.21,317.87z"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div class="shop_img_cover">
                                <img class="shop_img" src="${ data.img || "" }"/>
                            </div>
                        </div>
                    `,
                    marker_id: data._id
                });
            })
            return ret;
        }

        // custom marker object -> kakao marker object
        function customMarkerToKMarker(display, cmarkers) {
            const return_markers = [];
            cmarkers.forEach( (mark_info, i) => {
                // create marker
                let map_marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng( mark_info.loc.lat, mark_info.loc.long ),
                    image: new kakao.maps.MarkerImage( marker_img, new kakao.maps.Size(51, 55) )
                });
                let overlay = new kakao.maps.CustomOverlay({
                    content: mark_info.overlay,
                    map,
                    position: map_marker.getPosition()
                });
                // overlay display disable
                overlay.setMap(null);

                // add kmarker to return array
                return_markers.push( { marker: map_marker, overlay, marker_id: (mark_info.marker_id || new Date().getTime()) } );
            } )
            return return_markers;
        }

        // set marker overlay
        const setMarkerOverlay = (display, kMarker) => {
            const { marker: map_marker, overlay, marker_id } = kMarker;
            // marker click handling
            kakao.maps.event.addListener(map_marker, 'click', () => revealOverlay(display, marker_id));
        }

        // create markers
        function createMarker(gstate, remove_prev) {

            const { marker_list_raw: raw, marker_list_display: display } = gstate;

            console.log('createMarker', raw, display);

            // remove all markers (optional)
            if (remove_prev == true) {
                console.log(`marker removing progress: ${display.length}`);
                display.forEach(v => {
                    removeMarker(display, v);
                });
            }

            if (!raw) return;
 
            // create markers
            const markerobj_custom = dataToCustomMarker(raw);
            const kMarkers = customMarkerToKMarker(display, markerobj_custom);
            dispatch({ type: "map/SETDISPLAY", display: kMarkers });

            kMarkers.forEach(v => displayMarker(v.marker));
            
            // display all marker in user window
            const bounds = new kakao.maps.LatLngBounds();
            raw.forEach(v => bounds.extend(new kakao.maps.LatLng(v?.loc?.lat, v?.loc?.long)));

            // move map to markers position
            if (raw.length > 0) map.setBounds(bounds);
        }

        // get markers
        function getMarkers(position, marker_id) {
            let res = position.find(v => v.marker_id == marker_id);
            return res;
        }

        // remove markers
        function removeMarker(display, marker) {
            try {
                console.log('remove marker', marker.marker_id);
                const { marker: kakao_marker } = getMarkers(display, marker.marker_id);
                undisplayMarker(kakao_marker);
                return true;
            } catch(e) {
                console.error(e);
                return false;
            }
        }

        // display markers (display list not affected)
        function displayMarker(kakao_marker) {
            // console.log("kakao marker displaying");
            kakao_marker.setMap(map);
        }

        // undisplay markers (display list not affected)
        function undisplayMarker(kakao_marker) {
            kakao_marker.setMap(null);
        }

        // map marking manage
        function revealOverlay(display, marker_id) {
            try {
                const marker = getMarkers(display, marker_id);
                const { overlay, marker: map_marker } = marker;
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

        // create markers
        useEffect(() => {
            if (map_loaded) {
                createMarker({ marker_list_raw, marker_list_display }, init);
            }
        }, [ marker_list_raw, map_loaded ]);

        // active marker click action
        useEffect(() => {
            marker_list_display.forEach(v => setMarkerOverlay(marker_list_display, v));
        }, [ marker_list_display ]);

    // MAP - AreaEdit |---------------

        // useEffect(() => {
        //     if (map_loaded) {
        //         kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
        //             // 클릭한 위도, 경도 정보를 가져옵니다 
        //             var latlng = mouseEvent.latLng; 
        //             console.log(latlng.getLat(), latlng.getLng());
        //         });
        //     }
        // },[ map_loaded ]);

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

export default Map;