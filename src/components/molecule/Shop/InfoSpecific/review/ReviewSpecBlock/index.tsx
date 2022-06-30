import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { CategorizedReviewType } from "@interfaces/service/service.data.types/Shop";
import SvgManager from "@assets/svg";

// interfaces
type ReviewSpecBlockProps = {
    cat: CategorizedReviewType & { cat_keyname: string }
}

// components


const ReviewSpecBlock: React.FC<ReviewSpecBlockProps> = ({ cat }) => {
    return <div className="review-category-specblock">
        <div className="cat-icon">
            <SvgManager svg_type={ cat.cat_keyname || "" }/>
        </div>
        <span className="cat-name">{ cat.name }</span>
        <span className="review-rate">{ cat.cnt }명 질문 { cat.midcnt ? `(${ cat.midcnt }명 중도응답)` : "" }</span>
        <div className="review-percentbar">
            { ( cat.spec_score ) ? <>
                <div className="bar-value reviewed_good" style={{
                    width: `${ ( cat.spec_score.good.value === 0 ) ? "5px" : `${ ( (cat.spec_score.good.value || 0) / ( cat.cnt * 2 ) ) * 100 }%` }`
                }}>
                    <div className="full-colored"/>
                    <div className="pointer"/>
                    <span>{ cat.spec_score.good.value }</span>
                </div>
                <div className="bar-value reviewed_bad" style={{
                    width: `${ ( cat.spec_score.bad.value === 0 ) ? "5px" : `${ ( (cat.spec_score.bad.value || 0) / ( cat.cnt * 2 ) ) * 100 }%` }`
                }}>
                    <div className="full-colored"/>
                    <div className="pointer"/>
                    <span>{ cat.spec_score.bad.value }</span>
                </div>
            </> : <>
                <span className="refuse-display">응답이 적어 지금은 표시할 수 없어요</span>
            </>
            }
        </div>
        <div className="selection-title">
            <div className="selection left">{ cat.spec_score?.good.name }</div>
            <div className="selection right">{ cat.spec_score?.bad.name }</div>
        </div>
    </div>
};

export default ReviewSpecBlock