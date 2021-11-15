import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/Review.css";

// api
import { shop } from "../../../apis";

// img
import write_review from "../../../assets/img/menu_icon/write_review.svg";
import write_review_theme from "../../../assets/img/menu_icon/write_review_theme.svg";
import show_review from "../../../assets/img/menu_icon/show_review.svg";

// components
import ListSpec from "../../../components/ListSpec";
import ReviewSpec from './ReviewSpec';
import ReviewWrite from './ReviewWrite';

function Review({ swipeEvent, bottomCompHandler }) {

    const [ menu_title, setMT ] = useState("리뷰");
    const titleImgRef = useRef(<></>);
    const titleRef = useRef(<></>);

    const [ menu, _setMenu ] = useState(0);
    const [ is_open, setIsOpen ] = useState(true);
    const [ is_maximize, setIsMaximize ] = useState(false);

    const menus = [
        { img: write_review, title: "리뷰쓰기", onClick: () => setMenu(1)},
        { img: show_review, title: "리뷰보기", onClick: () => setMenu(2)},
    ];

    const sizes = {
        maximize: "10%",
        sub_maximize: "25%",
        default: "40%",
        sub_default: "30%",
        minimize: "75%"
    }

    const _swipeUpHandler = (direct_mode) => setIsOpen(prev => {
        _setMenu(ps => {
            if (ps || direct_mode == "max") {
                // maximize menu
                bottomCompHandler(sizes.maximize);
                setIsMaximize(true);
            } else if (!prev || direct_mode == "default") {
                // defaultize menu
                bottomCompHandler(sizes.default);
                setIsMaximize(false);
            }
            return ps;
        })
        return true;
    })

    const setMenu = (menu_id) => {
        _setMenu(menu_id);
        if (menu_id !== false) {
            titleRef.current.style.left = "50px";
            if (!menu_id) titleImgRef.current.src = null;
            else if (menu_id === 1) titleImgRef.current.src = write_review_theme;
            else titleImgRef.current.src = menus[Math.floor(menu_id-1)]?.img;
            setMT(menus[Math.floor(menu_id-1)].title);
            switch(menu_id) {
                // case 2:
                //     bottomCompHandler(sizes.sub_maximize);
                //     break;
                // case 1:
                // default:
                //     bottomCompHandler(sizes.sub_maximize);
                //     // _swipeUpHandler(sizes.maximize);
                //     break;
            }
        } else  {
            titleImgRef.current.src = "";
            titleRef.current.style.left = null;
            setMT("리뷰");
            bottomCompHandler("40%");
        }
    }

    return <div className="review-menu">
        <div className="title-area" onClick={() => setMenu(false)}>
            <img ref={titleImgRef}/>
            <span className="menu_title" ref={titleRef}>{ menu_title }</span>
        </div>
        {
            (menu == 0) && <div className="btns-wrap">
                { menus.map((v, i) => <div className="review-btn write-review" key={i} onClick={v.onClick} style={{
                    backgroundColor: (i%2) ? "white" : "var(--theme-color-C)"
                }}>
                    <img className="svg" src={v.img}/>
                    <span className="btn-title" style={{ color: (i%2) ? "var(--theme-color-C)" : "white" }}>{ v.title.split(" ").length > 1 ? v.title.split(" ")[0] + "..." : v.title }</span>
                </div>) }
            </div>
        }
        {
            (menu == 1) && <ReviewWrite
                extendReviewArea={() => bottomCompHandler("20%")}
                defaultizeReviewArea={() => bottomCompHandler("40%")}
            />
        }
        {
            (menu == 2) && <ReviewSpec 
                extendReviewArea={() => bottomCompHandler("20%")}
                defaultizeReviewArea={() => bottomCompHandler("40%")}
            />
        }
    </div>;
}

export default Review;