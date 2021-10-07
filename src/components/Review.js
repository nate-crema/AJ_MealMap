import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

// css
import "../css/Review.css";
import "../css/TagBlock.css";

const TagBlock = function({ style, block_id }) {
    const id_name_list = [
        "가성비",
        "음식맛",
        "친절도",
        "인테리어"
    ];

    return <div style={style || {}} className="tag_block">
        <span>{ id_name_list[block_id] }</span>
    </div>
    
}

export const Statistics = function ({ style, className }) {

    // Global Variable
    const { content } = useSelector(state => state.specific);
    const dispatch = useDispatch();

    // tmp
    // const tagList = [
    //     { id: 0, val: 0 },
    //     { id: 1, val: 0 },
    //     { id: 2, val: 0 },
    //     { id: 3, val: 2 },
    // ]

    return <div className={`statistics ${className || ""}`}>
        <span className="avg_title">별점 평균</span>
        <div className="avg_calced">
            <span className="calced">{content?.review?.avg || "?"}</span>
            <span className="avg_max">/10</span>
        </div>
        <span className="avg_trustworthy" style={{
            color: (content?.review?.isTrustHigh) ? "var(--theme-color-C)" : "#ae0000"
        }}>신뢰도 { (content?.review?.isTrustHigh) ? "높음" : "낮음" }</span>
        <div className="good-things tag_group">
            <span className="group_title">이런게 좋아요</span>
            <div className="tags">
                { content?.review?.tagList ?
                    content?.review?.tagList.filter( tag => tag.val == 0 ).map((tag, i) => <TagBlock style={{ backgroundColor: "var(--theme-color-C", left: `${80 * i + (i != 0 && (i * 12))}px` }} block_id={tag.id}/>)
                    :
                    <span className="tag_disabled">리뷰가 적어 태그를 표시할 수 없습니다</span>
                }
            </div>
        </div>
        <div className="bad-things tag_group">
            <span className="group_title" style={{ color: "lightgray" }}>이건 별로에요</span>
            <div className="tags">
                { content?.review?.tagList ?
                    content?.review?.tagList.filter( tag => tag.val == 2 ).map((tag, i) => <TagBlock style={{ backgroundColor: "lightgray", left: `${80 * i + (i != 0 && (i * 12))}px` }} block_id={tag.id}/>)
                    :
                    <span className="tag_disabled">리뷰가 적어 태그를 표시할 수 없습니다</span>
                }
            </div>
        </div>
    </div>
}