import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../css/Add.css";

// component
import SearchInput from "../SearchInput";
import { SearchBlock } from "../ListBlock";
import Button from '../Button';

// api
import { shop } from "../../apis";

function Add() {

    // Global Variable
    const { map: { customClickedPo } } = useSelector(state => state);
    const dispatch = useDispatch();

    // DESIGN ASSET
    const loc_svg = <></>

    // STAGE - COMMON
        const [ shop_name, setSN ] = useState(""); // 등록할 음식점 이름
        const [ shop_info, setSI ] = useState(null); // 검색된 음식점 정보
        const [ init, setInit ] = useState(false);

        useEffect(() => {
            setTimeout(() => {
                setInit(true);
            }, 100);
        }, []);
        
        // stage managemnt
        const [ stage, setStage ] = useState(0); // 등록단계
        const mentRef = useRef();
        const nameSearchRef = useRef();

        const ment_list = [
            "추가할 상호명을 입력해주세요",
            "입력이 멈추면 바로 검색할게요",
            "혹시 여기 아닌가요?",
            "위치를 지도에서 클릭해주세요!",
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
    
    // STAGE - 1
        const [ kw, setKw ] = useState(""); // 검색어
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

        // Not Found Btn Handler
        const _nFound = () => {
            setStage(3);
            dispatch({ type: "map/SETMCLICK", active: true });
        }

        useEffect(() => {
            setSI({
                setted: false,
                loc: {
                    lat: customClickedPo[0],
                    long: customClickedPo[1]
                }
            })
        }, [ customClickedPo ])

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
                if (kw == shop_name && kw.length > 0) {
                    setStage(2);
                    searchKakaoMap(kw);
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
        

    return <div className="add_menu">
        <span className="ment" style={{}} ref={mentRef}></span>
        <SearchInput 
            className="name_search"
            valueState={[ shop_name, setSN ]}
            disabled={shop_info?.setted}
            svg={(shop_info?.setted) && loc_svg}
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
                        _moveMap={() => {}}
                    />)}               
                </div>
                <Button className="not_found_button" styletype="B" style={{ textAlign: "left" }} onClick={_nFound}>이중에 없어요 ㅠㅠ</Button>
            </>
        }
    </div>
}

export default Add;