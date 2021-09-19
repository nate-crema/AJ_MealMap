import axios from "../connection/requester";
import { useState, useEffect, useRef } from "react";

// css
import "../css/ListSpec.css";

function ListSpec({ _ref, style, innerCont: { isOpen, tAreaOnClick, shop_text, info } }) {

    const [ distance, setDistance ] = useState( info.loc?.distance || "위치접근을 활성화해주세요!" );
    const [ mapbtn_text, setMBT ] = useState( "주소 보기" );

    const getPosition = async ({ coords }) => {
        try {
            console.log(coords);
            const { latitude, longitude } = coords;
            
            // const latitude = 37.27599431933007, longitude = 127.04515308567923

            // eslint-disable-next-line
            const startWCONG = new kakao.maps.LatLng( latitude, longitude );
            // eslint-disable-next-line
            const endWCONG = new kakao.maps.LatLng( info.loc.lat, info.loc.long );
            // console.log(`lat: ${latitude}, long: ${longitude} => x: ${WCongNaMul.toCoords().getX()}, y: ${WCongNaMul.toCoords().getY()}`);
            const { data: s_distance } = await axios.post(`/shop/distance`, {
                shop_id: info._id,
                coords: {
                    SLatLong: {
                        lat: latitude,
                        long: longitude
                    },
                    ELatLong: {
                        lat: info.loc.lat,
                        long: info.loc.long
                    },
                    SWCongNaMul: {
                        x: startWCONG.toCoords().getX(),
                        y: startWCONG.toCoords().getY()
                    },
                    EWCongNaMul: {
                        x: endWCONG.toCoords().getX(),
                        y: endWCONG.toCoords().getY()
                    }
                }
            })
            console.log(s_distance);

            const { long: { avg: long }, time: { avg: time } } = s_distance;

            setDistance( time == "soon" ? "3분 이내" : time == "too_long" ? "너무 멂" : `약${ time.m == 0 ? "" : ` ${time.m}분` } | ${Math.floor(long)}m`)

        } catch(e) {
            console.error(e);
            alert("거리 조회중 오류가 발생하였습니다. 다시 시도해주세요");
            setDistance("위치접근을 활성화해주세요!");
        }
    }

    const cngLocIView = async () => {
        if (distance == `${info.loc?.addr}`) {
            setMBT("주소 보기");
            setDistance("위치접근을 활성화해주세요!");
        }
        else {
            setMBT("소요시간 보기");
            setDistance(`${info.loc?.addr}`);
        }
    }

    useEffect(() => {
        console.log(_ref.current);
        console.log(info);
    }, []);

    return <div className="specArea mealmapArea" ref={_ref} style={{
        ...style,
        height: "50px",
        top: "30px"
    }}>
        <div className="textArea" onClick={() => tAreaOnClick()} style={{
            display: isOpen ? "none" : "block"
        }}>
            <p className="list_text innerText">가게정보</p>
            <zz></zz>
            <p className="btn_cngSort">{ shop_text }</p>
        </div>
        <div className="basic_infos">
            <span className="shop_name">{ info.name }</span>
            <span className="shop_cat">{ info.cat?.subcat }</span>
            <span className="shop_status" style={{ color: info.workTime?.color }} >{ info.workTime?.text || "확인할 수 없음" }</span>
            <div className="shop_number info_dp">
                <div className="service_icn">
                    <svg version="1.1" className="icn" id="icn_call" x="0px" y="0px" viewBox="0 0 482.6 482.6" style={{
                        enableBackground:"new 0 0 482.6 482.6"
                    }}>
                        <g>
                            <path d="M98.339,320.8c47.6,56.9,104.9,101.7,170.3,133.4c24.9,11.8,58.2,25.8,95.3,28.2c2.3,0.1,4.5,0.2,6.8,0.2
                            c24.9,0,44.9-8.6,61.2-26.3c0.1-0.1,0.3-0.3,0.4-0.5c5.8-7,12.4-13.3,19.3-20c4.7-4.5,9.5-9.2,14.1-14
                            c21.3-22.2,21.3-50.4-0.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2c-12.8,0-25.1,5.6-35.6,16.1l-35.8,35.8
                            c-3.3-1.9-6.7-3.6-9.9-5.2c-4-2-7.7-3.9-11-6c-32.6-20.7-62.2-47.7-90.5-82.4c-14.3-18.1-23.9-33.3-30.6-48.8
                            c9.4-8.5,18.2-17.4,26.7-26.1c3-3.1,6.1-6.2,9.2-9.3c10.8-10.8,16.6-23.3,16.6-36s-5.7-25.2-16.6-36l-29.8-29.8
                            c-3.5-3.5-6.8-6.9-10.2-10.4c-6.6-6.8-13.5-13.8-20.3-20.1c-10.3-10.1-22.4-15.4-35.2-15.4c-12.7,0-24.9,5.3-35.6,15.5l-37.4,37.4
                            c-13.6,13.6-21.3,30.1-22.9,49.2c-1.9,23.9,2.5,49.3,13.9,80C32.739,229.6,59.139,273.7,98.339,320.8z M25.739,104.2
                            c1.2-13.3,6.3-24.4,15.9-34l37.2-37.2c5.8-5.6,12.2-8.5,18.4-8.5c6.1,0,12.3,2.9,18,8.7c6.7,6.2,13,12.7,19.8,19.6
                            c3.4,3.5,6.9,7,10.4,10.6l29.8,29.8c6.2,6.2,9.4,12.5,9.4,18.7s-3.2,12.5-9.4,18.7c-3.1,3.1-6.2,6.3-9.3,9.4
                            c-9.3,9.4-18,18.3-27.6,26.8c-0.2,0.2-0.3,0.3-0.5,0.5c-8.3,8.3-7,16.2-5,22.2c0.1,0.3,0.2,0.5,0.3,0.8
                            c7.7,18.5,18.4,36.1,35.1,57.1c30,37,61.6,65.7,96.4,87.8c4.3,2.8,8.9,5,13.2,7.2c4,2,7.7,3.9,11,6c0.4,0.2,0.7,0.4,1.1,0.6
                            c3.3,1.7,6.5,2.5,9.7,2.5c8,0,13.2-5.1,14.9-6.8l37.4-37.4c5.8-5.8,12.1-8.9,18.3-8.9c7.6,0,13.8,4.7,17.7,8.9l60.3,60.2
                            c12,12,11.9,25-0.3,37.7c-4.2,4.5-8.6,8.8-13.3,13.3c-7,6.8-14.3,13.8-20.9,21.7c-11.5,12.4-25.2,18.2-42.9,18.2
                            c-1.7,0-3.5-0.1-5.2-0.2c-32.8-2.1-63.3-14.9-86.2-25.8c-62.2-30.1-116.8-72.8-162.1-127c-37.3-44.9-62.4-86.7-79-131.5
                            C28.039,146.4,24.139,124.3,25.739,104.2z" />
                        </g>
                    </svg>
                </div>
                <span className="text" style={{ cursor: "pointer" }} onClick={() => window.location.href=`tel:${info.number?.default}`}>{ info.number?.default }</span>
            </div>
            <div className="shop_distance info_dp">
                <div className="service_icn">
                    <svg version="1.1" className="icn" id="icn_pin" x="0px" y="0px" viewBox="0 0 368.16 368.16" style={{
                        enableBackground: "new 0 0 368.16 368.16"
                    }}>
                        <g>
                            <g>
                                <g>
                                    <path d="M184.08,0c-74.992,0-136,61.008-136,136c0,24.688,11.072,51.24,11.536,52.36c3.576,8.488,10.632,21.672,15.72,29.4
                                        l93.248,141.288c3.816,5.792,9.464,9.112,15.496,9.112s11.68-3.32,15.496-9.104l93.256-141.296
                                        c5.096-7.728,12.144-20.912,15.72-29.4c0.464-1.112,11.528-27.664,11.528-52.36C320.08,61.008,259.072,0,184.08,0z
                                        M293.8,182.152c-3.192,7.608-9.76,19.872-14.328,26.8l-93.256,141.296c-1.84,2.792-2.424,2.792-4.264,0L88.696,208.952
                                        c-4.568-6.928-11.136-19.2-14.328-26.808C74.232,181.816,64.08,157.376,64.08,136c0-66.168,53.832-120,120-120
                                        c66.168,0,120,53.832,120,120C304.08,157.408,293.904,181.912,293.8,182.152z"/>
                                    <path d="M184.08,64.008c-39.704,0-72,32.304-72,72c0,39.696,32.296,72,72,72c39.704,0,72-32.304,72-72
                                        C256.08,96.312,223.784,64.008,184.08,64.008z M184.08,192.008c-30.872,0-56-25.12-56-56s25.128-56,56-56s56,25.12,56,56
                                        S214.952,192.008,184.08,192.008z"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <span className="text" style={{
                    fontSize: !info.loc?.distance && "16px",
                    width: !info.loc?.distance && "200px",
                    cursor: !info.loc?.distance && "pointer"
                }} onClick={() => {
                    if (navigator.geolocation) {
                        setDistance("현재위치 조회중...");
                        navigator.geolocation.getCurrentPosition(getPosition, () => {
                            alert("위치정보 이용을 거부하여 해당 정보를 표시할 수 없습니다. 다시 시도해주세요.");
                            setDistance("위치접근을 활성화해주세요!");
                        }, {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 1
                        })
                    } else alert("위치정보를 사용할 수 없는 기기입니다. 다른 브라우저나 기기에서 접속해주세요.");
                }}>{ distance }</span>
                <span className="text f_button" onClick={cngLocIView} >{ mapbtn_text }</span>
            </div>
            <div className="shop_send info_dp">
                <div className="service_icn">
                    <svg version="1.1" className="icn" id="Layer_1" x="0px" y="0px"
                        viewBox="0 0 500 500" style={{
                            enableBackground: "new 0 0 500 500"
                        }}>
                    {/* <style type="text/css">
                        .st0{fill:#FFFFFF;stroke:#000000;stroke-width:10;stroke-miterlimit:10;}
                    </style> */}
                        <path class="st0" style={{
                            fill: "#FFFFFF",
                            // stroke: "var(--theme-color-C)",
                            stroke: "#000000",
                            strokeWidth: "15",
                            strokeMiterlimit: "10"
                        }} d="M126.5,365.63V134.37c0-31.96,25.91-57.87,57.87-57.87h131.26c31.96,0,57.87,25.91,57.87,57.87v231.26
                            c0,31.96-25.91,57.87-57.87,57.87H184.37C152.41,423.5,126.5,397.59,126.5,365.63z"/>
                        <g>
                            <g>
                                <path style={{
                                    fill: "#FFFFFF",
                                    // stroke: "var(--theme-color-C)",
                                    stroke: "#000000",
                                    strokeWidth: "12",
                                    strokeMiterlimit: "10",
                                }} d="M303.11,235.4l-41.74-30.84c-6.21-4.59-15.01-0.15-15.01,7.57v15.04c-22.88,3.97-55.45,47.98-53.17,67.83
                                    c0.3,2.64,3.93,3.16,4.95,0.7c6-14.41,24.15-34.01,48.22-36.23v14.34c0,7.73,8.79,12.16,15.01,7.57l41.74-30.84
                                    C308.2,246.78,308.2,239.17,303.11,235.4z"/>
                            </g>
                        </g>
                    </svg>
                </div>
                <span className="text" style={{ cursor: "not-allowed" }} >이 { info.cat?.cat } 공유하기</span>
            </div>
        </div>
    </div>
}

export default ListSpec;