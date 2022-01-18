import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/Search.css";

// component
import ListBlock from '../../../components/ListBlock';

function Search({ swipeEvent, results }) {

    const { search: { keyword, result } } = useSelector(state => state);
    const dispatch = useDispatch();

    const [ ment, setMent ] = useState("음식점의 이름이나 초성, 카테고리를 검색할 수 있어요!");
    
    const _swipeDownHandler = (direct_mode) => {
        dispatch({ type: "mobile/SETCOMP", comp: { mode: null } });
    }

    useEffect(() => {
        if (keyword) setMent(`검색어 '${keyword}'로 검색중이에요...`);
    }, [ keyword ]);

    useEffect(() => {
        if ((keyword.length > 0) && result && (result.length > 0)) setMent(`“${keyword}”에 대한 검색결과를 ${result.length}개 찾았어요!`);
        else if ((keyword.length > 0) && result && (result.length == 0)) setMent(`“${keyword}”에 대한 검색결과가 없어요 ㅠㅠ`);
    }, [ result ]);

    // swipe events: registration
    useEffect(() => {
        swipeEvent.addEventListener("toDown", _swipeDownHandler);
        return () => {
            swipeEvent.removeEventListener("toDown", _swipeDownHandler);
        }
    }, []);

    // click handler
    const _blockClickHandler = (info) => {
        const { lat, long } = info?.loc;
        // move map position
        dispatch({ type: "map/SETMAPTO", loc: [ lat, long ] });
        // remove markers (except selected)
        dispatch({ 
            type: "map/SETLIST", 
            list: [{
                loc: { lat, long },
                overlay: false,
                _id: info._id || Math.floor((lat+long)*10000)
            }]
        })
        dispatch({ type: "search/SETOPEN", open: false });
        dispatch({ type: "mobile/SETCOMP", comp: { mode: "specific", value: info._id } });
    }

    return <div className="search-menu">
        <span className="ment">{ ment }</span>
        <div className="list-wrapper">
            { result.map((shop, i) => <ListBlock key={i} className="result-block" info={shop} _moveMap={_blockClickHandler}/>) }
            <div className="not-found result-block">
                <span>원하는 결과를 못찾았어요</span>
            </div>
        </div>
    </div>;
}

export default Search;