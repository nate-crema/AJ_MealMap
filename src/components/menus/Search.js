import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../../css/Menus/Search.css"

// components
import SearchInput from "../SearchInput";
import Block from "../ListBlock";

// menu component
import Specific from "./Specific";

// api
import { shop } from "../../apis";

function Search() {

    const { specific: { content: spec_info }, menu: { menu }  } = useSelector(state => state);
    const dispatch = useDispatch();

    // SEARCH
    
    // search states
    const [ kw, setKW ] = useState(""); // search keyword
    const [ onsearch, setOS ] = useState(false); // searching state
    const [ res, setRes ] = useState([]); // search result
    const [ relates, setRelates ] = useState([]); // relate keyword
    const [ relates_open, setRelatesOpen ] = useState(false); // relate keyword open
    const search_interval = 2000;

    // search
    const _search = async (keyword) => {
        setOS(true);
        const searched = await shop.findShopList(keyword);
        setRes(searched);
        setOS(false);
    }
    
    // const _relateKeywords = async (keyword) => {
    //     const keywords = await shop.getRelateKeywords(keyword);
    // }

    useEffect(() => {
        // enter detection & search
        const isEnterPress = (e) => {
            if (e.keyCode == 13 && kw.length > 0 && document.activeElement == document.getElementById("search_input")) {
                // enter
                _search(kw);
            }
        }
        document.addEventListener("keydown", isEnterPress);
        
        // relate keywork manage
        // setRelates(_relateKeywords(kw));
        
        return () => {
            document.removeEventListener("keydown", isEnterPress);
        }
    }, [ kw ]);

    const _moveMap = (info) => {
        dispatch({ type: "map/SETMAPLOC", loc: "" });
        setTimeout(() => {
            dispatch({ type: "map/SETMAPLOC", loc: info._id });
            dispatch({ type: "spec/SETSPEC", content: info });
        }, 10);
    }

    return <div className="search_menu">
        <SearchInput className="search_input" valueState={[ kw, setKW ]}/>
        {/* <div className="relate_results">
            <div className="titles">
                <span className="relate_title">혹시 여기찾으세요?</span>
                <span className="close_relates" onClick={() => setRelatesOpen(!relates_open)}>{relates_open ? "닫기" : "보기"}</span>
            </div>
            {<></>}
        </div> */}
        <div className="search_results" style={{
            height: relates_open ? `calc(100% - ${( 30 * relates.length + 150 )}px)` : `calc(100% - 150px)`
        }}>
            {
                res.map((v, i) => <Block key={i} info={{ ...v , i }} _moveMap={_moveMap} />)
            }            
        </div>
    </div>
}

export default Search;
