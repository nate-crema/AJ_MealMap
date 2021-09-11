import { useEffect, useState, useRef } from "react";
import axios from "../connection/requester";

// css
import "../css/Mealmap.css";

// components
import KakaoMap from "../components/Map";
import KakaoMapInit from "../components/MapInit";
import Mobile from "../components/Mobile";
import ListSpec from "../components/ListSpec";
import ShopCore from "../components/ShopCore";

// api
import { shop } from "../apis";


function Mealmap({ window }) {

    // MAP

    // Map Component - Parental Management
    const [ map, setMap ] = useState(null); // kakao map object
    const [ marked, setMarked ] = useState([]); // marked marker objects
    const [ revealOverlay, setRO ] = useState(() => {}); // map overlay displayer

    // map status manage
    const [ map_loaded, setMapStat ] = useState(false);

    // map initial location manage
    const [ location, setLoc ] = useState({ lat: 37.27983974701925, long: 127.04362143912854 });

    // map list manage
    const [ list, setList ] = useState([]);

    useEffect(async () => {
        const shop_list = await shop.getShopList();
        setList(shop_list);
    }, []);

    // useEffect(() => console.log("list: changed", list), [ list ]);

    // map list content click handling

    const _moveMap = (info) => {
        if (!map) {
            specOpen(info);
            return;
        }
        const { loc, i } = info;
        // map position move
        // console.log(`moveTo: ${loc.lat}, ${loc.long}`)
        map.setLevel(1);
        setTimeout(() => {
            // eslint-disable-next-line
            map.panTo(new kakao.maps.LatLng(loc.lat, loc.long));

            // open ovelay layer (will run after specific area open)
            setTimeout(() => {
                // console.log(revealOverlay);
                if (revealOverlay) revealOverlay(i);
            }, 100);

            // open specific area (will run before overlay area open)
            specOpen(info);

        }, 300);
    }

    // 

    // map marker manage
    const [ mapMarkers, setMarkers ] = useState([]);

    useEffect(() => {
        if (map_loaded) {
            let markers = [];
            for (var i = 0; i < ( list.length > 10 ? 10 : list.length ); i++) {
                // map custom overlay

                

                const overlay = `
                    <div class="custom_overlay_mmap" id="mmap_overlay" >
                        <span class="shop_name">${ list[i].name }</span>
                        <span class="shop_cat">${ list[i].cat?.subcat }</span>
                        <span class="shop_GPA">${ list[i].review?.avg }</span>
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
                        <div class="btn_fnc btn_info" id="btn_info_overlay_${list[i]._id}" style="cursor: ${'pointer'}">
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
                            <img class="shop_img" src="${ list[i].img || "" }"/>
                        </div>
                    </div>
                `;
                markers.push({
                    loc: list[i].loc,
                    overlay
                });
            }
            // console.log("markers", markers);
            setMarkers(markers);
        }
    }, [ map_loaded ]);

    // ----------------------

    // LIST

    // display text manage
    const [ location_text, setLocText ] = useState("핀 위치: 아주삼거리");
    const [ sort_text, setSortText ] = useState("평점순");
    const [ shop_text, setShopText ] = useState("가게를 선택하세요!");

    // filter manage
    const [ filter, setFilter ] = useState([]);

    // list specific area open handler

    const listAreaRef = useRef(null);
    const specAreaRef = useRef(null);

    const [ spec_opened, setSO ] = useState(false);
    const [ spec_info, setSI ] = useState(null);

    const specOpen = (info) => {
        if (!spec_opened) { 
            if (spec_info) setSO(true);
            else if ( !info ) return false;
            else {
                // set spec information & open
                setSI(info);
                setShopText(info.name);
                setSO(true);
            }
        } else setSO(false);
    }

    useEffect(() => {
        // console.log("listAreaRef.current", listAreaRef.current);
        // console.log("specAreaRef.current", specAreaRef.current);
        if (listAreaRef.current && specAreaRef.current) {
            if (spec_opened) {
                listAreaRef.current.style.height = "50px";
                specAreaRef.current.style.height = "calc(100% - 80px)";
                specAreaRef.current.children[0].style.top = "unset";
                specAreaRef.current.children[0].style.transform = "translate(-50%)";
            } else {    
                listAreaRef.current.style.height = "calc(100% - 80px)";
                specAreaRef.current.style.height = "50px";
                specAreaRef.current.children[0].style.top = "50%";
                specAreaRef.current.children[0].style.transform = "translate(-50%, -50%)";
            }
        }
    }, [ spec_opened ]);

    // registration block manage
    const [ registerobj_list, setRLState ] = useState([]);
    
    const addRL = () => {
        if (registerobj_list.length == 0) setRLState([
            {
                _id: new Date().getTime(),
                name: "",
                GPA: "",
                loc: { LatLong: { lat: 0, long: 0 }, WCongNaMul: { x: 0, y: 0 } }
            },
            ...registerobj_list
        ])
        else return;
    }

    const remRL = (_i) => {
        // console.log(registerobj_list);
        const rol = registerobj_list.filter((v, i) => v._id != _i);
        // console.log(rol);
        setRLState(rol);
    }
    
    return <Mobile>
        <div className="mealmap serviceArea" id="serviceArea">
            { (window.width > 1000) ? <div className="mapArea mealmapArea">
                <div className="textArea">
                    <p className="location_text innerText">{ location_text }</p>
                </div>
                <KakaoMap 
                    parentMapState={[ map, setMap ]}
                    parentOverlayDisplayer={[ revealOverlay, setRO ]}
                    parentMarkersCtrl={[ marked, setMarked ]}
                    parentSpeclistOpen={specOpen}
                    filter={filter}
                    location={location}
                    className="mapArea"
                    stat={[ map_loaded, setMapStat ]}
                    display={ mapMarkers }
                />
            </div> : <KakaoMapInit/> }
            <div className="infosArea">
                <div className="listArea mealmapArea" ref={listAreaRef} style={{
                    height: "calc(100% - 80px)"
                }}>
                    <div className="textArea" onClick={() => specOpen()}>
                        <p className="list_text innerText">음식점 리스트 ({ sort_text })</p>
                        <zz></zz>
                        <p className="btn_cngSort">거리순 정렬</p>
                    </div>
                    <div className="searchArea" onClick={(e) => {
                        e.currentTarget.children[2].focus();
                    }}>
                        <p className="innerText">검색</p>
                        <div className="stylebar"></div>
                        <input type="text" placeholder="메뉴나 가게명 입력" onFocus={(e) => {
                            e.currentTarget.placeholder = "";
                        }} onBlur={(e) => {
                            e.currentTarget.placeholder = "메뉴나 가게명 입력";
                        }}/>
                    </div>
                    <div className="listBlocks">
                        { registerobj_list.map((v, i) => <ShopCore type="register" key={i} info={{ ...v , i }} remFnc={remRL} map_objs={ {
                            map_obj: map,
                            marker_state: [ mapMarkers, setMarkers ],
                            map_marked: [ marked, setMarked ]
                        } } />)  }
                        { list.map((v, i) => <ShopCore type="display" info={{ ...v, i }} key={i} _moveMap={_moveMap} />) }
                    </div>
                    <div className="addBtn" style={{
                        display: spec_opened ? "none" : "block",
                        backgroundColor: registerobj_list.length == 0 ? "white" : "var(--theme-color-C)",
                        color: registerobj_list.length == 0 ? "var(--theme-color-C)" : "white",
                    }} onClick={() => addRL()}>
                        <span className="text">음식점 추가하기</span>
                    </div>
                </div>
                <ListSpec _ref={specAreaRef} innerCont={{
                    tAreaOnClick: () => specOpen(),
                    shop_text,
                    info: spec_info || {},
                    isOpen: spec_opened
                }} />
            </div>
        </div>
    </Mobile>

}


export default Mealmap;