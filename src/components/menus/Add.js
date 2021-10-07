import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../css/Add.css";

// component
import SearchInput from "../SearchInput";
import { SearchBlock } from "../ListBlock";
import Button from '../Button';

function Add() {

    // Global Variable
    const gstate = useSelector(state => state);
    const dispatch = useDispatch();

    // STAGE - COMMON

    const [ mentA, _setMentA ] = useState("");
    const [ ment_oA, setMentOpA ] = useState(1);
    const [ mentB, _setMentB ] = useState("");
    const [ ment_oB, setMentOpB ] = useState(0);

    const [ stage, setStage ] = useState(0);

    // btn click hander
    const _clickHandler = [
        (info) => {
            // console.log(info);
        }
    ]

    // setting ment
    const setMent = (pointer, _ment) => {
        const mentSetter = [ [ _setMentA, setMentOpA ], [ _setMentB, setMentOpB ] ];
        for (var i = 0; i < mentSetter.length; i++) mentSetter[i][1](0);
        setTimeout(() => {
            mentSetter[pointer%mentSetter.length][0](_ment);
            mentSetter[pointer%mentSetter.length][1](1);
        }, 300);
    }

    // ObjectArray -> Array (using specific key)
    const oaToArray = (OA, key) => {
        const ret = [];
        OA.forEach(v => ret.push(v[key]));
        return ret;
    }
    
    // ment setter (by stage)
    useEffect(() => {
        const ment_list = [
            "추가할 상호명을 입력해주세요",
            "혹시 여기 아닌가요?",
            "검색된 위치들 중 맞는 위치가 있다면 선택해주세요",
            "위치를 지도에 직접 클릭해주세요",
            "정보가 맞는지 확인해주세요\n올바르지 않은 정보라면 클릭하여 수정해주세요",
            "등록이 완료되었습니다!\n지금부터 '검색'에서 이 식당에 대한 정보들을 볼 수 있어요"
        ]
        if (stage == 0) setMent(0, ment_list[stage]);
        else setMent(1, ment_list[stage]);
    }, [ stage ]);

    // STAGE 0

        // add place information
        const [ shop_name, setShopName ] = useState("");
        const [ shop_iblock, setShopIBlock ] = useState(false);
        const [ shop_sres, _setSR ] = useState([]);
        const [ shopsr_updated, setSU ] = useState([]);

        useEffect(() => {
            setTimeout(() => {
                _setSR(shopsr_updated);
            }, 300);
        }, [ shopsr_updated ]);

        useEffect(() => {
            // map list update
            dispatch({ type: "map/SETLIST", list: [] });
            const list = [];
            shop_sres.forEach(v => {
                list.push({
                    cat: {
                        cat: v.category_group_name,
                        subcat: v.category_name.split(" > ").pop()
                    },
                    loc: {
                        lat: v.y,
                        long: v.x 
                    },
                    name: v.shop_name,
                    overlay: false
                })
            })
            setTimeout(() => {
                dispatch({ type: "map/SETLIST", list });
            }, 150);
        }, [ shop_sres ])

        // search position

        const shop_search_mealmap = (kw) => {
            
        }

        /* eslint-disable */
        const shop_search_kakao = (kw) => {
            const places = new kakao.maps.services.Places();
            places.keywordSearch(
                kw, 
                (res, stat) => (stat === kakao.maps.services.Status.OK ) && setSU(res),
                { location: new kakao.maps.LatLng(37.27983974701925, 127.04362143912854), radius: 1000, category_group_code: "FD6" }
            );
        }
        /* eslint-enable */
        
        useEffect(() => {
            if (shop_name.length > 0) shop_search_kakao(shop_name);
            else {
                setSU([]);
                dispatch({ type: "map/SETLIST", list: [] });
            }
        }, [ shop_name ]);

    return <div className="add_menu">
        <span className="ment_a">{ mentA }</span>
        { <SearchInput className="search_inp" valueState={[ shop_name, setShopName ]} disabled={shop_iblock}/> }
        {
            // stage 0
            (stage == 0) && (
                <>
                    <div className="search_results" style={{
                        height: shop_sres.length == 0 ? "0" : `${ 170 * shop_sres.length > 200 ? "400" : 170 * shop_sres.length }px`,
                        overflowY: "auto"
                    }}>
                        {
                            shop_sres.map((v, i) => <SearchBlock key={i} info={{ ...v , i }} style={{
                                listBlock: {
                                    background: shopsr_updated.length,
                                    transition: "all .2s ease",
                                    height: !oaToArray(shopsr_updated, "place_url").includes(v.place_url) ? "0px" : "120px",
                                    overflow: "hidden",
                                    marginTop: "20px"
                                }
                            }} _moveMap={_clickHandler[stage]} />)
                        }            
                    </div>
                    <Button style={{
                        width: "100%",
                        height: "50px",
                        position: "relative",
                        top: "80px",
                        textAlign: "left"
                    }} styletype="B">일치하는 상호가 없어요!</Button>
                </>
            )
        }
    </div>;
}

export default Add;