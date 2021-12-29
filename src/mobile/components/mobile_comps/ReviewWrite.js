import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/ReviewWrite.css";

// api
import { review, shop } from '../../../apis';

// component
import SearchInput from '../../../components/SearchInput';

function ReviewWrite({ extendReviewArea, defaultizeReviewArea }) {

    const ments = [
        "어떤 식당을 다녀오셨나요?"
    ];
    const [ stage, setStage ] = useState(0);
    const [ ment, _setMent ] = useState(ments[stage]);
    const [ shop_info, setSI ] = useState({});
    const mentRef = useRef(<></>);

    const setMent = (v) => {
        if (mentRef.current) {
            mentRef.current.style.opacity = 0;
            mentRef.current.style.marginTop = "10px";
            setTimeout(() => {
                _setMent(v);
                setTimeout(() => {
                    if (mentRef.current) {
                        mentRef.current.style.opacity = 1;
                        mentRef.current.style.marginTop = "0px";
                    }
                }, 100);    
            }, 200);
        } else _setMent(v);
    }

    const [ mode, setMode ] = useState(0);

    // mode: 0 (search)

    const [ kw, setKw ] = useState("");
    const [ search_result, setSR ]=  useState([]);
    const [ reviews, setRV ] = useState([]);
    const [ prevres_close, setPC ] = useState(false);

    useEffect(() => {
        setMent(ments[stage]);
    }, [ stage ]);

    const _updateSearchResult = async (v) => {
        // update ui
        if (v.length > 0) extendReviewArea();
        
        // search keyword
        setTimeout(() => setKw(pv => {
            if (v !== pv || v.length <= 0) {
                setPC(true);
                setTimeout(() => {
                    setSR([]);
                    setPC(false);
                }, 150);
                return pv;
            }
            const { findShopList } = shop;
            findShopList(v)
            .then(res => {
                setPC(true);
                setTimeout(() => {
                    setSR(res);
                    setPC(false);
                }, 150);
            });
            return pv;
        }), 200);
    }

    const _blurHandler = (v) => {
        // update ui
        if (v.length <= 0) defaultizeReviewArea();
    }

    const _resultClickHandler = (info) => {
        setSI(info);
        setMent(`'${info?.name}'에 대한 질문을 가져오고 있어요..`);
        setMode(1);
        getQuestions(info._id);
    }

    const getQuestions = async (id) => {
        try {
            const reviews_raw = await review.getQuestions(id);
            
        } catch(e) {
            console.error(e);
        }
    }

    // mode: 1 (specific)

    const days = [ "일", "월", "화", "수", "목", "금", "토" ];

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

    return <div className="review-specific">
        <span className="ment" ref={mentRef}>{ ment }</span>
        {
            (mode == 0) && <>
                <SearchInput className="review-searcher" valueState={[ kw, setKw ]} placeholder="상호명 검색" onChange={_updateSearchResult} onBlur={_blurHandler}/>
                <div className="search_results">
                    { search_result.map(v => <div className="result-block" onClick={(e) => _resultClickHandler(v)} style={{
                        animationName: prevres_close ? "result-block-out" : "result-block-in"
                    }}>
                        <span className="shopname">{ v.name }</span>
                        <span className="location">{ v?.loc?.addr }</span>
                    </div>) }
                </div>   
            </>
        }
        {
            (mode == 1) && <></>
        }
    </div>;
}

export default ReviewWrite;