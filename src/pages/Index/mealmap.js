/* eslint-disable */
import "../../css/Mealmap.css";

import axios from "axios";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as actions from '../../store/modules/map';

// global functions

import { initMenu, changeMenuUI, setTitler, getNowInfo, loadList } from "../../module/functions";
import { push } from "react-router-redux";

function MealMap({ init }) {
    
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const lTRef = useRef(null);
    let map = null;
    function setMap(v) {
        map = v;
    }

    const [ curLoc, setCurLoc ] = useState("아주대정문 삼거리");
    const [ sM , setSM ] = useState(0); // sort mode
    const [ sCT, setSCT ] = useState("위치기준 정렬");

    const state = useSelector(select => select);
    const { def: { blocks, boxSize, size, prev }, menu: { menu } } = state;

    // list

    const [ list, setList ] = useState([]);
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ filter, setFilter ] = useState([]);

    // listTitle

    function _setLT(mode) {
        if (mode == 1) {
            lTRef.current.style.opacity = 0;
            lTRef.current.style.marginTop = "-10px";
            setTimeout(() => {
                setSM(mode);
                let doc = document.getElementById("designCircle");
                doc.style.backgroundColor = "#005aae";
                setTimeout(() => {
                    lTRef.current.style.opacity = 1;
                    lTRef.current.style.color = "white";
                    lTRef.current.style.marginTop = "0px";
                }, 100);
            }, 100);
        } else {
            lTRef.current.style.opacity = 0;
            lTRef.current.style.marginTop = "-10px";
            setTimeout(() => {
                setSM(mode);
                let doc = document.getElementById("designCircle");
                doc.style.backgroundColor = "#005aae4f";
                doc.style.width = "100px";
                doc.style.height = "100px";
                setTimeout(() => {
                    lTRef.current.style.opacity = 1;
                    lTRef.current.style.color = "#005aae";
                    lTRef.current.style.marginTop = "0px";
                }, 100);
            }, 100);
        }
    }

    // map

    const markers = new function() {
        let t = this;
        this.length = 0;
        this.push = function(v) {
            console.log(`marker registered: total ${length+1}`);
            t[length++] = v;
        }
        this.initiate = function() {
            console.log(`initiate: ${t.length}`);
            for (var i = 0; i < t.length; i++) {
                t[i].setMap(map);
                t[i] = null;
                console.log(`removed markers: ${i}`);
            }
        }
    }

    function mapInit(i) {
        console.log(`try cnt: ${i}`);
        if (!map && window.kakao) {
            kakao.maps.load(() => {
                setMap(new kakao.maps.Map(mapRef.current || document.getElementById("mapSpreadPoint"), {
                    center: new kakao.maps.LatLng(37.27983974701925, 127.04362143912854),
                    level: 3
                }));
                setTimeout(() => {
                    if (mapRef.current) {
                        const childCnt = mapRef.current.children.length;
                        if (childCnt > 3) for (var i = childCnt-1; i >= 3; i--) {
                            console.log(".");
                            if(mapRef.current.lastElementChild) mapRef.current.removeChild(mapRef.current.firstElementChild);
                        }
                        setTimeout(() => {
                            if (map == null) {
                                alert("지도 맵핑 오류. 리렌더링");
                                mapInit(0);
                            }
                        }, 100);
                    }
                }, 1000);
            })
        } else setTimeout(() => {
            mapInit(i+1);
        }, 100);
    }

    function activateMarker(loc) {
        // 마커이미지 생성
        const markerImage = new kakao.maps.MarkerImage("https://item.kakaocdn.net/do/b6dce51288ee1df47f21d1b6cb22082fd0bbab1214a29e381afae56101ded106", new kakao.maps.Size(60, 60), {offset: new kakao.maps.Point(60, 0)});
        const markerPosition = new kakao.maps.LatLng(loc[0], loc[1]);

        // 마커 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition, 
            image: markerImage // 마커이미지 설정 
        });

        // 마커 활성화
        marker.setMap(map);  

        // 마커 저장
        markers.push(marker);
    }

    function deactivateMarker() {
        markers.initiate();
    }

    function moveMap(loc, locName) {
        if (map == null) {
            console.log("지도 맵핑 오류. 리렌더링");
            mapInit(0);
            // remove marker
            // deactivateMarker();
            markers.initiate();
            return setTimeout(() => kakao.maps.load(() => (moveMap(loc, locName))), 100);
        }
        // map.setLevel(4);
        setTimeout(() => {
            const moveLatLon = new kakao.maps.LatLng(loc[0], loc[1]);
            map.panTo(moveLatLon);
            setCurLoc(locName);
            setTimeout(() => {
                map.setLevel(2);
            }, 200);
        }, 100);

        activateMarker(loc);
    }

    // sort

    function arrPushTo(a, v, i) {
        for (var _i = a.length-1; _i >= i; _i--) a[_i+1] = a[_i];
        a[i] = v;
    }

    function sortChange(pos, mode) {
        setSCT("위치 탐색중..");
        console.log(pos);
        setSCT("위치 확인 완료");

        // const { latitude: lat, longitude: long } = pos.coords;
        const [lat, long] = [37.27977972741871, 127.04372392460941];
        
        const cngList = [];
        console.log(`location: ${lat}, ${long}`);

        console.log(`pos: ${pos}`);

        // sort
        if (mode == 0) {
            list.forEach((v, i) => {
                const { avg } = v.review;
                console.log(avg);
                var _i = 0;
                cngList.forEach((_v) => {
                    const { avg: _avg } = _v.review;
                    console.log(`compare: ${_avg} & ${avg} => ${_avg < avg}`);
                    if (_avg < avg) _i++;
                })
                console.log(`_i: ${_i}`);
                
                arrPushTo(cngList, v, _i);
            })
            setList(cngList);
            _setLT(mode);
        } else if (mode == 1) {
            list.forEach((v, i) => {
                console.log(v.loc);
                const dist = Math.sqrt(Math.pow((v.loc[0] - (lat*100000)), 2) + Math.pow((v.loc[1] - (long*100000)), 2));
                console.log(`Distance between current Location: ${dist}`);
                v.dist = dist;
                var _i = 0;
                cngList.forEach((_v) => {
                    console.log(`compare: ${_v.dist} & ${dist} => ${_v.dist < dist}`);
                    if (_v.dist < dist) _i++;
                })
                console.log(`_i: ${_i}`);
                
                arrPushTo(cngList, v, _i);
            })
    
            cngList.forEach(v => v.dist = null);
            setList(cngList);
            _setLT(mode);
        }
    }

    // --------

    useEffect(() => {
        console.log(list);
    }, [ list ]);
    
    useEffect(() => {
        if (!isLoaded) {
            setIsLoaded(true);
            const host = process.env.HOST || `http://localhost:3001`
            axios.get(`${host}/api/shopList`)
            .then(({ data }) => {
                console.log(data);
                setList(data.list);
            })
            .catch((e) => {
                console.error(e);
            })
        }
        console.log(`init: ${init[0]}`);
        // console.log(`menu: ${menu} || init: ${init[0]}`)
        if (menu != 1 && !init[0]) {
            console.log(`menu: ${menu} || init: ${init[0]}`)
            init[1](true);
            dispatch({ type: "menu/SETMENU", v: 1 });
            changeMenuUI(menu, history ? history.push : window.location.href, state);
        }
        console.log(`mapLayout: loaded`);
        // map initializing
        mapInit(0);
    }, [ ]);


    return (
        <div className="contentWrapMap menuComp">
            <div className="mapLayout">
                <div className="locTitle blockTitleCover">
                    <p className="serviceTitle title">현재위치: {curLoc}</p>
                </div>
                <div id="mapSpreadPoint" ref={mapRef}></div>
            </div>
            <div className="shopList">
                <div className="listTitle blockTitleCover"
                    onClick={(e) => {
                        if (sM == 1) {
                            e.stopPropagation();
                            // _setLT(0);
                            sortChange(null, 0);
                        }
                    }}
                >
                    <div className="designCircle" id="designCircle" style={{ left: "110%", width: "100px" }}></div>
                    <p className="serviceTitle title" ref={lTRef}>리스트 ({sM == 0 ? "평점순" : "거리순"})</p>
                    <div className="changeSort" 
                        onMouseEnter={(e) => {
                            e.stopPropagation();
                            let doc = document.getElementById("designCircle");
                            doc.style.left = (doc.style.left.split("%")[0]*1 - 5) + "%";
                        }}
                        onMouseLeave={(e) => {
                            e.stopPropagation();
                            let doc = document.getElementById("designCircle");
                            doc.style.left = (doc.style.left.split("%")[0]*1 + 5) + "%";
                        }}
                        onClick={() => {

                            if (sM == 0) {
                                // animation
                                let doc = document.getElementById("designCircle");
                                let cnt = 0;
                                doc.style.transition = "all .5s cubic-bezier(0.07, 0.76, 0.18, 0.96)";
                                doc.style.width = "50px";
                                setTimeout(() => {
                                    doc.style.width = "1000px";
                                    doc.style.height = "1000px";
                                }, 560);
    
    
                                // fnc
                                if (!navigator.geolocation) {
                                    alert("접속하신 시스템에서 위치정보 제공 시스템을 지원하지 않아 정렬을 변경할 수 없습니다.\n다른 시스템을 통해 접속해주세요.");
                                    return false;
                                } else setSCT("위치제공 동의요청중..");
                                navigator.geolocation.getCurrentPosition(p => sortChange(p, 1), () => {
                                    alert("위치정보 제공에 동의하지 않았거나 시스템에서 위치정보 제공을 거부하여 위치기반 정렬로 변경할 수 없습니다.");
                                    return false;
                                });
                            } else sortChange(null, 0);
                        }}
                    >
                        <p className="sortChangeText">{sCT}</p>
                    </div>
                </div>
                <div className="listBlocks">
                    {list.map((v, i) => {
                        return (
                            <div className="listBlock"
                                onClick={(e) => {
                                    moveMap(v.loc, v.name);
                                }}
                                style={{
                                    zIndex: i*100,
                                    top: (i != 0) && "1px"
                                }}
                            >
                                <p className="shopName">{v.name}</p>
                                <p className="GPA_avg">{v.review.avg}</p>
                                <p className="GPA_max">/ 10</p>
                                <p className="descripttionGPA">평균 평점</p>
                                <p className="shopStat" style={{ color: v.workTime.color || "gray" }}>{v.workTime.text}</p>
                                <p className="workTime">{v.workTime.totalTimes[getNowInfo().dayNumber]}</p>
                                <p className="isTrustGPA" style={{
                                    color: v.isTrustHigh ? "rgb(34, 92, 168)" : "rgb(154, 12, 12)"
                                }}>평점 신뢰도 {v.isTrustHigh ? "높음" : "낮음"}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="mobileBackgroud"></div>
        </div>
    )
}

export default MealMap;