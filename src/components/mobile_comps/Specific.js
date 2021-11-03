import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../css/mobile_comp/Specific.css";

// api
import { shop } from "../../apis";

// components
import ListSpec from "../ListSpec";

function Specific({ swipeEvent, id }) {

    const dispatch = useDispatch();
    
    const [ info, setInfo ] = useState({});
    const [ tab_index, setTI ] = useState(1);

    const specBlockRef = useRef(<></>);
    const sliderRef = useRef(<></>);

    const getInfo = async () => {
        const info_data = await shop.findShopById(id);
        console.log(info_data);
        setInfo(info_data);
    }

    const _downHandler = () => {
        dispatch({ type: "mobile/SETCOMP", comp: null });
    }

    const _rightHandler = (x, i) => {
        // console.log(x);
        sliderRef.current.classList.toggle("onchangingR");
        setTimeout(() => {
            if (i) setTI(i);
            else setTI(prev => (prev-1 > 0) ? prev-1 : prev);
        }, 100);
        setTimeout(() => {
            sliderRef.current.classList.toggle("onchangingR");
        }, 500);
    }

    const _leftHandler = (x, i) => {
        // console.log(x);
        sliderRef.current.classList.toggle("onchangingL");
        setTimeout(() => {
            if (i) setTI(i);
            else setTI(prev => (prev+1 <= 3) ? prev+1 : prev);
        }, 100);
        setTimeout(() => {
            sliderRef.current.classList.toggle("onchangingL");
        }, 500);
    }

    const getTextLengthInPixel = function(txt, optFont) {
        var myId = 'my_span_ruler';
        var ruler = document.getElementById(myId);
        if (!ruler) {
            ruler = document.createElement('span');
            ruler.id = myId; // 안보이게 
            ruler.setAttribute('style', 'visibility:hidden; white-space:nowrap; position:absolute; left:-9999px; top: -9999px;');
            document.body.appendChild(ruler);
        } // 폰트 스타일
        ruler.style.font = (!optFont) ? document.body.style.font : optFont; ruler.innerText = txt;
        return ruler.offsetWidth;
    }
    
    useEffect(() => {
        getInfo();
        swipeEvent.addEventListener("toDown", _downHandler);
        swipeEvent.addEventListener("toRight", _rightHandler);
        swipeEvent.addEventListener("toLeft", _leftHandler);
        return () => {
            swipeEvent.removeEventListener("toDown", _downHandler);
            swipeEvent.removeEventListener("toRight", _rightHandler);
            swipeEvent.removeEventListener("toLeft", _leftHandler);
        }
    }, []);

    const taglist = [ "가성비", "맛집", "친절하심", "사장님이 친절", "인테리어" ];

    return <div className="mobile-specific">
        <div className="common-content">
            <span className="shop_name">{ info.name }</span>
            <span className="shop_cat">{ info.cat?.subcat }</span>
            <span className="shop_status" style={{ color: info.workTime?.color }} >{ info.workTime?.text || "확인할 수 없음" }</span>
        </div>
        <div className="inner-slider" ref={sliderRef}>
            {
                (tab_index == 1) && <ListSpec _ref={specBlockRef} className="spec_block" innerCont={{
                    tAreaOnClick: () => {},
                    shop_text: "",
                    info,
                    isOpen: true
                }} />
            }
            {
                (tab_index == 2) && <div className="reviews">
                    <div className="good">
                        <span className="cat_title">이런게 좋아요</span>
                        <div className="tag_list">
                            {/* { taglist.slice(0, 3).concat([`+ ${taglist.length-3}개`]).map(tag => <> */}
                            { info.review?.taglist?.slice(0, 3).concat([`+ ${taglist.length-3}개`]).map(tag => <>
                                <div className="review_tag tag_good" style={{
                                    width: `${getTextLengthInPixel(tag, "17px") + 20}px`
                                }}>
                                    <span>{ tag }</span>
                                </div>
                            </>) }
                            { (!info.review?.taglist) && <span className="tag_unavail">리뷰가 적어 태그를 표시할 수 없습니다.</span> }
                        </div>
                    </div>
                    <div className="bad">
                        <span className="cat_title">이건 별로에요</span>
                        <div className="tag_list">
                            {/* { taglist.slice(0, 3).concat([`+ ${taglist.length-3}개`]).map(tag => <> */}
                            { info.review?.taglist?.slice(0, 3).concat([`+ ${taglist.length-3}개`]).map(tag => <>
                                <div className="review_tag tag_bad" style={{
                                    width: `${getTextLengthInPixel(tag, "17px") + 20}px`
                                }}>
                                    <span>{ tag }</span>
                                </div>
                            </>) }
                            { (!info.review?.taglist) && <span className="tag_unavail">리뷰가 적어 태그를 표시할 수 없습니다.</span> }
                        </div>
                    </div>
                </div>
            }
            {
                (tab_index == 3) && <div className="reservation">
                    <span className="tab_title">예약</span>
                    <span className="not-ready">아직 지원하지 않아요</span>
                </div>
            }
        </div>
        <div className="dots">
            <div className="dot dotA" onClick={() => (tab_index > 1) ? _rightHandler(null, 1) : _leftHandler(null, 1)}style={{ backgroundColor: tab_index == 1 ? "var(--theme-color-C)" : null }}></div>
            <div className="dot dotB" onClick={() => (tab_index > 2) ? _rightHandler(null, 2) : _leftHandler(null, 2)}style={{ backgroundColor: tab_index == 2 ? "var(--theme-color-C)" : null }}></div>
            <div className="dot dotC" onClick={() => (tab_index > 3) ? _rightHandler(null, 3) : _leftHandler(null, 3)}style={{ backgroundColor: tab_index == 3 ? "var(--theme-color-C)" : null }}></div>
        </div>
    </div>;
}

export default Specific;