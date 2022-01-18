import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/SearchNear.css";

function ShopList({ info, history }) {

    const dispatch = useDispatch();
    
    const _clickHandler = (e) => {
        history.push(`/specific?shopId=${ info._id }`);
        dispatch({ type: "mobile/SETCOMP", comp: { mode: "specific", value: info._id } });
    }

    return <div className="shop-block" onClick={_clickHandler}>
        <div className="block-contents">
            <span className="shop-name">{ info?.name || "???" }</span>
            <span className="shop-point">평점 { info?.review?.avg || (info?.review?.avg == "?") && false || "집계중" }</span>
            <span className="shop-endtime" style={{
                color: info?.workTime?.color || "lightgray"
            }}>{ info?.workTime?.text || "정보없음"}</span>
        </div>
    </div>
}

function SearchNear({ results, history }) {
    
    const [ data, setData ] = useState([]);
    const [ msg, setMsg ] = useState("");
    
    useEffect(() => {
        setData(results);
        if (results.length > 0) setMsg(`주변 음식점 ${results.length}개를 찾았어요!`);
        else setMsg(`검색된 주변 음식점이 없어요 ㅠㅠ..`);
    }, [])

    return <div className="search_results">
        <div className="user_msg">
            <span>{ msg }</span>
        </div>
        <div className="shop-blocks">
            { data.map((info, key) => <>
                <ShopList info={info} key={key} history={history}/>
            </>)}
        </div>
    </div>;
}

export default SearchNear;