/* eslint-disable */

import { useState, useEffect, useRef } from "react";
import axios from "../connection/requester";

// components
import Button from "../components/Button";
import PBar from "../components/PBar"

// api
import { shop } from "../apis";

// css
import "../css/ShopCore.css";

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

function ShopCore({ type, info, _moveMap, remFnc, map_objs }) {
    const blockRef = useRef(null);

    // REGISTER_MODE

        // question state management
        const qRef = useRef(<></>);
        const [ question, setQ ] = useState("Q. 등록할 음식점 이름이 뭔가요?");
        const setQuestion = async ( q ) => {
            qRef.current.style.opacity = 0;
            qRef.current.style.marginTop = "10px";
            setTimeout(() => {
                setQ(q);
                setTimeout(() => {
                    qRef.current.style.opacity = 1;
                    qRef.current.style.marginTop = "0px";
                }, 150);
            }, 150);
        }
        const [ loc_manual, setLM ] = useState("일치하는 장소가 없나요?");
        const [ reg_stage, setRegStage ] = useState(0); 

        // input state mangement
        const [ name, setName ] = useState("");
        const [ loc, setLoc ] = useState({});
        const [ extra, setExtra ] = useState(null);
        const [ pref, setPref ] = useState(0);
        
        // temp markers state management
        const [ tmarkers, setTM ] = useState([]);

        // register mode end handler
        const regmode_end = (e) => {

            revertMarkers();

            // move map to default location
            moveMap();
            
        }

        // STAGE: 0

            const _iAnswerFocus = (e) => {
                // input styling
                e.currentTarget.placeholder = "";
                e.currentTarget.style.fontSize = "20px";
                
                // question area change
                setQuestion("입력후 Enter를 눌러주세요");
            }

            const _iAnswerBlur = (e) => {
                if (e.target.value == "") setQuestion("Q. 등록할 음식점 이름이 뭔가요?");
                else setQuestion("입력이 끝났다면 Enter를 눌러주세요");
                
                // input styling
                e.currentTarget.placeholder = "음식점명"
                e.currentTarget.style.fontSize = "16px";
                
                // _blurHandler(e);
            }

            const _iAnswerKeyDown = (e) => {
                // input key diagnose
                if ( e.key == "Enter" && e.target.value != "" ) try {
                    // value-changing disable
                    e.target.style.opacity = "0.2";
                    e.target.disabled = true;

                    // set question message
                    setQuestion("사업장을 찾는 중입니다..");

                    const places_obj = new kakao.maps.services.Places();

                    places_obj.keywordSearch(e.target.value, searchDP, {
                        location: new kakao.maps.LatLng(37.27983974701925, 127.04362143912854),
                        radius: 5000
                    });

                } catch(e) {
                    console.error(e);
                }
            }

        // STAGE: 1.X

            // remove temp markers & reveal shop lists marker
            const revertMarkers = (markers = tmarkers) => {
                // remove temp markers
                console.log(markers);
                markers.forEach(marker => marker.setMap(null))
                setTM([]);

                // reveal org markers
                const { map_obj: map, map_marked: [ marked, setMarked ]  } = map_objs;
                for (var i = 0; i < marked.length; i++) marked[i].marker.setMap(map);

            }

            // move to default location
            const moveMap = (lat, long, level) => {
                const { map_obj: map } = map_objs;
                // map.setLevel(3, {animate: true});
                const latlng = new kakao.maps.LatLng(lat || 37.27983974701925, long || 127.04362143912854);
                map.setLevel(level || 2, { anchor: latlng });
                map.panTo(latlng);
            }

            // search result display handler
            const searchDP = async (result, stat) => {
                try {

                    console.log(result, result.length, stat);
                    if (stat === kakao.maps.services.Status.OK) {

                        if ( result.length > 0 ) {
                            const { map_obj: map, marker_state: [ mapMarkers, setMarkers ], map_marked: [ marked, setMarked ]  } = map_objs;
                
                            // LatLng Bounds object (make markers display in one-size map)
                            var bounds = await new kakao.maps.LatLngBounds();
                            
                            let tmp_markers = [];
                
                            console.log(tmp_markers);
                            for (var i = 0; i < (result.length > 10 ? 10 : result.length); i++) {
                                const { y: lat, x: long } = result[i];
                                // create latlng object
                                const loc_obj = new kakao.maps.LatLng( lat, long );
                                const map_marker = await new kakao.maps.Marker({
                                    position: loc_obj,
                                    image: new kakao.maps.MarkerImage( marker_img[i], new kakao.maps.Size(51, 55) )
                                }); // create marker object
                                tmp_markers.push(map_marker); // add markers to temp markers list
                                console.log(tmp_markers);
                                await bounds.extend(loc_obj); // add markers to LatLng Bounds object
                            }
    
                            setTM(tmp_markers);
                            
                            for (var j = 0; j < tmp_markers.length; j++) {
                                const _i = j;
                                // display marker
                                tmp_markers[_i].setMap(map);
                                kakao.maps.event.addListener(tmp_markers[_i], 'click', () => selectLocation(_i, tmp_markers, result[_i]));
                            }
                            
                            // set map display all markers in one-size maps
                            map.setBounds(bounds);
                
                            // set question message
                            setQuestion(`가게 위치를 선택해주세요.`);
                
                            // disable marker views temporarily
                            for (var i = 0; i < marked.length; i++) marked[i].marker.setMap(null);
                
                            // change registration state
                            setRegStage(1);
                        } else {
                            // set question message
                            setQuestion(`검색 결과를 찾지 못했습니다. 위치를 수동으로 지정해주세요`);

                            setTimeout(() => {
                                setLocManual();
                            }, 1000);
                        }

                    } else if (stat === kakao.maps.services.Status.ZERO_RESULT) {
                        // set question message
                        setQuestion(`검색 결과를 찾지 못했습니다. 위치를 수동으로 지정해주세요`);

                        setTimeout(() => {
                            setLocManual();
                        }, 1000);
                    }
                } catch(e) {
                    console.error(e);
                }
            }

            // location select handler
            const selectLocation = (i, markers, data) => {
                console.log(i, markers, data);
                setExtra(data);
                revertMarkers(markers);
                level1XEnd(data.y, data.x, data.road_address_name || data.address_name);
            }

            // location manualize selecting setter
            const setLocManual = async () => {
                const { map_obj: map, marker_state: [ mapMarkers, setMarkers ], map_marked: [ marked, setMarked ]  } = map_objs;

                // disable temp markers display
                tmarkers.forEach( m => m.setMap(null) );
                setTM([]);

                moveMap();

                // set question message
                setRegStage(1.5);
                setQuestion("사업장 위치를 지도에서 클릭해주세요");

                kakao.maps.event.addListener(map, 'click', manualClickControl);

                // remove all markers
            }

            // manual location click control
            const manualClickControl = (e) => {
                const { map_obj: map, marker_state: [ mapMarkers, setMarkers ], map_marked: [ marked, setMarked ]  } = map_objs;

                // disable additional click
                kakao.maps.event.removeListener(map, 'click', manualClickControl);
                
                // get lat & long
                const lat = e.latLng.getLat();
                const long = e.latLng.getLng();

                // convert latlng to address
                const geocoder = new kakao.maps.services.Geocoder();

                geocoder.coord2Address(long, lat, (res, stat) => {
                    if (stat === kakao.maps.services.Status.OK) {
                        console.log(res);

                        // save selected location to state
                        setLoc({ lat, long, address: res[0].road_address?.address_name || res[0].address?.address_name })

                        // set display address
                        setLM(res[0].road_address?.address_name || res[0].address?.address_name || "지도의 마커 위치를 참고해주세요");
                    } else setLM("지도의 마커 위치를 참고해주세요");
                })

                const loc_obj = new kakao.maps.LatLng( lat, long ); // create location object
                const map_marker = new kakao.maps.Marker({
                    position: loc_obj,
                    image: new kakao.maps.MarkerImage( marker_def, new kakao.maps.Size(51, 55) )
                }); // create marker object
                
                map_marker.setMap(map); // set marker display on map
                setTM([ ...tmarkers, map_marker ])

                // move map location to clicked position
                moveMap(lat, long, 1);

                setQuestion(`여기가 "${name}"의 위치가 맞나요?`); // question to user
                setRegStage(1.7); // set stage: 1.5 -> 1.7
            }

            const manualLocConfirmed = (e) => {
                level1XEnd()
            }

            // move to next level
            const level1XEnd = (lat = loc?.lat, long = loc?.long, address = loc?.address) => {
                if (tmarkers.length != 0) revertMarkers();
                moveMap();
                setLoc({ lat, long, address });

                // set stage
                setRegStage(2);

                // set question
                setQuestion(`'${name}'은(는) 몇점정도 인가요?`);
                
            }

        // STAGE: 2.X
            
            // preference input end handler
            const prefInputed = async () => {
                console.log(`Info Input Complete: \nShop: ${name} | Rate ${pref}\nExtra: ${extra && JSON.stringify(extra)}`);

                // disable user changing value
                setQuestion("음식점을 추가해주셔서 감사합니다! 지금 바로 등록할게요 ;)");
                setRegStage(3);
                
                // send review
                await shop.regShopPref(name, pref, loc, extra);

                // reload shoplist
                const shop_list = await shop.getShopList();
                console.log(shop_list);
                // setList(shop_list);
            }

    switch(type) {
        case "register":
            return <div className="listBlock register-mode" ref={ blockRef }>
                <span className="question" ref={qRef}>{ question }</span>
                <span className="location_manualize" style={{
                    display: (reg_stage == 1 || reg_stage == 1.7) ? "block" : "none",
                }} onClick={setLocManual} >{ loc_manual }</span>
                <input className="answer" placeholder="음식점명" style={{
                    display: reg_stage == 0 ? "block" : "none",
                }} onFocus={_iAnswerFocus} onBlur={_iAnswerBlur} onKeyDown={_iAnswerKeyDown} value={name} onChange={(e) => setName(e.target.value)} type="text"/>
                { 
                    reg_stage == 1.7 ? <>
                        <Button styletype="A" animation={true} className="btn_manTf btn_manTf_true" onClick={manualLocConfirmed}>네</Button>
                        <Button styletype="B" animation={true} className="btn_manTf btn_manTf_false" onClick={setLocManual}>아니요</Button>
                    </> :
                    
                    reg_stage == 2 && <>
                        <PBar className="pref_pbar" state={[ pref, setPref ]} onEnd={prefInputed} />
                        <p className="GPA_avg">{ pref }</p>
                        <p className="GPA_max">/ 10</p>
                    </>
                    
                }
                <div className="cancel" onClick={() => {
                    regmode_end();
                    blockRef.current.style.animationName = "registerblock_out";
                    setTimeout(() => {
                        remFnc(info._id);
                    }, 230)
                }}>
                    <svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style={{
                        enableBackground: "new 0 0 512.001 512.001"
                    }}>
                        <g>
                            <g>
                                <path d="M284.286,256.002L506.143,34.144c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L256,227.717
                                    L34.143,5.859c-7.811-7.811-20.475-7.811-28.285,0c-7.81,7.811-7.811,20.475,0,28.285l221.857,221.857L5.858,477.859
                                    c-7.811,7.811-7.811,20.475,0,28.285c3.905,3.905,9.024,5.857,14.143,5.857c5.119,0,10.237-1.952,14.143-5.857L256,284.287
                                    l221.857,221.857c3.905,3.905,9.024,5.857,14.143,5.857s10.237-1.952,14.143-5.857c7.811-7.811,7.811-20.475,0-28.285
                                    L284.286,256.002z"/>
                            </g>
                        </g>
                    </svg>
                </div>
                {/* <p className="shopStat" style={{ color: info.workTime.color }}>{ info.workTime.text }</p>
                <p className="workTime">{ info.workTime.totalTimes[new Date().getDay()] }</p>
                <p className="isTrustGPA" style={{
                    color: info.review.isTrustHigh ? "var(--theme-color-D)" : "#AE0000"
                }} >{info.review.avg ? `평점 신뢰도 ${ info.review.isTrustHigh ? "높음" : "낮음"}` : "평점정보 없음" }</p> */}
        </div>
        default:
            return <div className="listBlock" onClick={() => _moveMap( info )}>
            <p className="shopName">{ info.name }</p>
            <p className="GPA_avg">{ info.review.avg || "?" }</p>
            <p className="GPA_max">/ 10</p>
            <p className="shopStat" style={{ color: info.workTime.color }}>{ info.workTime.text }</p>
            <p className="workTime">{ info.workTime.totalTimes[new Date().getDay()] }</p>
            <p className="isTrustGPA" style={{
                color: info.review.isTrustHigh ? "var(--theme-color-D)" : "#AE0000"
            }} >{info.review.avg ? `평점 신뢰도 ${ info.review.isTrustHigh ? "높음" : "낮음"}` : "평점정보 없음" }</p>
        </div>
    }
}

export default ShopCore;