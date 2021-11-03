import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../css/Add.css";

// img
import edit_icon from "../../assets/img/menu_icon/edit.svg"

// component
import SearchInput from "../SearchInput";
import { SearchBlock } from "../ListBlock";
import InfoEdit from "../InfoEdit";
import Button from '../Button';

// api
import { shop } from "../../apis";

export const InfoDisplay = function({ editable, className, infokey, option, initVal, changeStats: [ [ change, setChange ], [ change_v, setChangeV ] ] }) {

    const _clickHandler = (e) => {
        if (!(editable === false)) setChange(infokey);
    }

    const _editEnd = (e) => {
        console.log(`edit ended`);
        setChange("");
    }

    return <div className={`info_display ${className || ""}`} onClick={_clickHandler}>
        <span className="value" style={{
            animationName: (change == infokey) ? "val_change_start" : "val_change_end",
            color: initVal ? "var (--theme-color-C" : "lightgray"
        }} onClick={_clickHandler} >{ (change == infokey) ? "" : initVal || "정보를 찾지 못했어요" }</span>
        { (change == infokey) && (
            option?.type == "string" ? <input style={{ 
                animationName: (change == infokey) ? "val_change_end" : "val_change_start",
             }} type="text" placeholder={initVal || "[값 입력]"} value={change_v} onChange={(e) => setChangeV(e.target.value)} onBlur={_editEnd}/>
            : option?.type == "string" ? <input type="text"/>
            : option?.type == "string" ? <input type="text"/>
            : option?.type == "string" ? <input type="text"/>
            : <></>
        ) }
        <div className="icon" onClick={_clickHandler}><img src={edit_icon}/></div>
    </div>
}

export default function Add() {

    // Global Variable
    const { map: { customClick, customClickedPo } } = useSelector(state => state);
    const dispatch = useDispatch();

    // DESIGN ASSET
    const loc_svg = <svg version="1.1" id="loupe" x="0px" y="0px" viewBox="0 0 30.8 47.3" style={{ enableBackground: "new 0 0 30.8 47.3" }}>
        <g id="Group_262" transform="translate(-167.829 -275.34)">
        <path id="Path_52" style={{ fill: "var(--theme-color-C)" }} d="M183,275.3c-8.4,0.1-15.1,6.9-15.2,15.3c0,2.8,0.8,5.6,2.2,8c4,6.5,7.6,13.3,10.8,20.4l1.3,2.9
            c0.3,0.6,1,0.9,1.6,0.6c0.3-0.1,0.5-0.3,0.6-0.6l1.1-2.5c3.2-7.2,6.9-14.1,11-20.8c1.4-2.4,2.2-5.1,2.2-7.9
            c0-8.5-6.9-15.4-15.4-15.4C183.1,275.3,183.1,275.3,183,275.3z M183.2,295.8c-3.6,0-6.5-2.9-6.5-6.5l0,0c0-3.6,2.9-6.5,6.5-6.5l0,0
            c3.6,0,6.5,2.9,6.5,6.5l0,0C189.7,292.9,186.8,295.8,183.2,295.8L183.2,295.8L183.2,295.8z"/>
        <circle id="Ellipse_10" style={{ fill: "#FFFFFF" }} cx="183" cy="289" r="7"/>
        </g>
    </svg>

    // STAGE - COMMON
        const [ shop_name, setSN ] = useState(""); // 등록할 음식점 이름
        const [ shop_info, setSI ] = useState(null); // 검색된 음식점 정보
        const [ init, setInit ] = useState(false);

        useEffect(() => {
            setTimeout(() => {
                setInit(true);
            }, 100);
        }, []);

        useEffect(() => {
            console.log("shop_info", shop_info);
        }, [ shop_info ]);
        
        // stage managemnt
        const [ stage, setStage ] = useState(0); // 등록단계
        const mentRef = useRef();
        const nameSearchRef = useRef();

        const reg_infos_list = {
            name: { display: "상호명", editable: false, valtype: "string" },
            cat: { display: "업종", valtype: "list-select", list: [  ], question: "" },
            loc: { display: "위치", editable: false, valtype: "loc_object", question: "" },
            worktime: { display: "근무시간", valtype: "date-select", question: "" },
            deliverable: { display: "배달여부", valtype: "boolean", question: "" },
            number: { display: "전화번호", valtype: "string", question: "" },
            registerable: { display: "예약가능여부", valtype: "boolean", question: "" }
        };

        const ment_list = [
            "추가할 상호명을 입력해주세요",
            "입력이 멈추면 바로 검색할게요",
            "혹시 여기 아닌가요?",
            "위치를 지도에서 클릭해주세요!",
            "아래 정보들 중 아는 정보들을 입력해주세요!",
            "정보가 맞지 않다면 클릭하여 수정할 수 있습니다 ;)"
        ];
        
        useEffect(() => {
            console.log(`stage: `, stage);
            // stage 0-setting blocker
            if (stage == 0 && shop_name.length > 0) setStage(2);

            // style change
            if (stage > 0) {
                mentRef.current.style.top = "100px";
                nameSearchRef.current.style.top = "10px";
            } else {
                mentRef.current.style.top = "10px";
                nameSearchRef.current.style.top = "70px";
            }

            // ment setter
            if (mentRef.current) {
                mentRef.current.style.animationName = "ment_change";
                setTimeout(() => {
                    mentRef.current.innerText = ment_list[stage];
                    setTimeout(() => {
                        mentRef.current.style.animationName = "";
                    }, 200);
                }, 150);
            }

            // stage 1&2: active event listener
            if ([1, 2].includes(stage)) {
                const enterReader = (e) => {
                    if (e.key == "Enter") nameSearchRef.current.children[1].blur(); // focus disable
                }
                document.addEventListener("keydown", enterReader);
                return () => {
                    document.removeEventListener("keydown", enterReader);
                }
            }
        }, [ stage ]);
    
    // LEVEL - 1 (stage: 0~3)
        const [ kw, setKw ] = useState(""); // 검색어
        const [ snedit, setSNE ] = useState(true); // 음식점 이름 입력가능여부
        const [ search_result, _setSR ] = useState([]);
        const [ search_result_temp, setSR ] = useState([]);

        // SEARCH

        /* eslint-disable */
        const searchKakaoMap = (keyword) => {
            console.log("search: ", keyword);
            // search
            const places = new kakao.maps.services.Places();
            places.keywordSearch(keyword, (res, stat) => {
                if(stat === kakao.maps.services.Status.OK) {
                    setSR(res);
                }
            }, { location: new kakao.maps.LatLng(37.282857175308095, 127.04644412955818), radius: 1100, category_group_code: "FD6" });
        }
        /* eslint-enable */

        // JSON Array -> Array (specific key)
        const extractKey = (objectArray, key) => {
            const ret = [];
            objectArray.forEach(v => ret.push(v[key]));
            return ret;
        }

        // SUM & AVG returner
        const calc = (arr) => {
            let sum = 0;
            arr.forEach(v => sum += (v*1));
            return [ sum, sum/arr.length ];
        }

        // User Action Handler

            // List Shop Click Handler
            const _listClick = (info) => {
                // console.log(info);
                setShopLoc(info.place_name, info.y, info.x, {
                    number: info.phone,
                    loc: {
                        addr: info.road_address_name?.split("경기 수원시 ")[1]?.split("구 ")[1] || info.road_address_name || info.addresss_name,
                        lat: info.y,
                        long: info.x
                    }
                });
            }

            // Not Found Btn Handler
            const _nFoundClick = () => {
                setStage(3);
                dispatch({ type: "map/SETMCLICK", active: true });
            }

            useEffect(() => {
                if (customClick) {
                    // console.log(`position detected: ${customClickedPo[0]}, ${customClickedPo[1]}`)
                    setShopLoc(shop_name, customClickedPo[0], customClickedPo[1]);
                    dispatch({ type: "map/SETMCLICK", active: false });
                }
            }, [ customClickedPo ])

            // Set Adding shop location
            const setShopLoc = (name, lat, long, infos) => {
                // set informations
                setSI({ setted: false, name, loc: { lat, long }, ...infos });
                // remove markers (except selected)
                dispatch({ 
                    type: "map/SETLIST", 
                    list: [{
                        loc: { lat, long },
                        overlay: false,
                        _id: new Date().getTime()
                    }]
                })
                // move map position
                dispatch({ type: "map/SETMAPTO", loc: [ lat, long ] });

                // disable shop name edit
                setSNE(false);

                // update stage
                setStage(4);
            }

        // search keyword change detection
            useEffect(() => {
                if (shop_name.length > 0){
                    setTimeout(() => {
                        setKw(shop_name);
                    }, 500);
                }
                else if (init) {
                    setSR([]);
                    setStage(1);
                }
            }, [ shop_name ]);

            useEffect(() => {
                // keyword searchpoint detection
                if (kw == shop_name && kw.length > 0) {
                    setStage(2);
                    searchKakaoMap(kw);
                    nameSearchRef.current.children[1].blur(); // focus disable
                } else {
                    dispatch({ type: "map/SETLIST", list: [] });
                }
            }, [ kw ]);

        // temp => search_result
        useEffect(() => {
            setTimeout(() => {
                // display to map
                try {
                    const list_markerset = [];
                    search_result_temp.forEach(v => list_markerset.push({
                        loc: {
                            lat: v.y,
                            long: v.x
                        },
                        overlay: false,
                        _id: v.id
                    }));
                    dispatch({ type: "map/SETLIST", list: list_markerset })
                    _setSR(search_result_temp);
                    console.log(calc(extractKey(search_result_temp, "y"))[1])
                    dispatch({ type: "map/SETMAPLOC", loc: [ calc(extractKey(search_result_temp, "y"))[1], calc(extractKey(search_result_temp, "x"))[1] ] })
                } catch(e) {
                    console.error(e);
                }
            }, 300);
        }, [ search_result_temp ]);

    // LEVEL 2 (stage 4 ~ )

        // ment change ( 4 -> 5 )
        useEffect(() => {
            if (stage == 4) setTimeout(() => setStage(5), 2000);
        }, [ stage ]);
        

    return <div className="add_menu">
        <span className="ment" style={{}} ref={mentRef}></span>
        <SearchInput 
            className="name_search"
            valueState={[ shop_name, setSN ]}
            disabled={!snedit}
            svg={!snedit && loc_svg}
            placeholder="상호명을 입력해주세요"
            onFocus={() => setStage(1)}
            onBlur={() => setStage(0)}
            _ref={nameSearchRef}
        />
        {
            ([1, 2].includes(stage)) && <>
                <div className="searched_list" style={{
                    height: ((search_result.length * 180) > 400 ? 400 : (search_result.length * 180 + 10)) + "px"
                }}>
                    { search_result.map((shop, i) => <SearchBlock 
                        style={{
                            listBlock: {
                                marginTop: "10px",
                                marginBottom: "5px",
                                height: extractKey(search_result_temp, "id").includes(shop.id) ? "130px" : "0px",
                                transition: "all .2s ease",
                                overflow: "hidden",
                            }
                        }}
                        key={i}
                        info={{...shop, i}}
                        _moveMap={_listClick}
                    />)}               
                </div>
                <Button className="not_found_button" styletype="B" style={{ textAlign: "left" }} onClick={_nFoundClick}>이중에 없어요 ㅠㅠ</Button>
            </>
        }
        { 
            ([4, 5].includes(stage)) && <InfoEdit infos_list={reg_infos_list} infos={[ shop_info, setSI ]} className="infos_wrap"/>
        }
    </div>
}