import { useState, useEffect, useRef, MouseEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import SvgManager from "@assets/svg";

// interfaces
type ReviewBlockProps = {
    className?: string
}

// components


const ReviewBlock: React.FC<ReviewBlockProps> = ({ className }) => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );

    return <div className={ "shop-reviews" + ( className ? ` ${ className }` : "" ) }>
        <div className="score-statistics">
            <span className="avg-score">{ info.reviews.score || "NA" }</span>
            <span className="review-cnt">리뷰 { info.reviews.review_cnt }개</span>
        </div>
        <div className="cat-price cat-statisticed-review">
            <div className="cat-icn">
                <SvgManager svg_type="price" style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
            </div>
            <span className="cat-title">가격</span>
            <span className="cat-statvalue">{
                ( info.reviews.categorized?.price ) ?
                    `${ info.reviews.categorized.price.score } (${ info.reviews.categorized.price.cnt }명)`
                    :
                    "리뷰 집계중"
            }</span>
        </div>
        <div className="cat-dist cat-statisticed-review">
            <div className="cat-icn">
            <SvgManager svg_type="distance" style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
            </div>
            <span className="cat-title">거리</span>
            <span className="cat-statvalue">{
                ( info.reviews.categorized?.price ) ?
                    `${ info.reviews.categorized.price.score } (${ info.reviews.categorized.price.cnt }명)`
                    :
                    "리뷰 집계중"
            }</span>
        </div>
        <div className="cat-taste cat-statisticed-review">
            <div className="cat-icn">
            <SvgManager svg_type="taste" style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
            </div>
            <span className="cat-title">맛</span>
            <span className="cat-statvalue">{
                ( info.reviews.categorized?.price ) ?
                    `${ info.reviews.categorized.price.score } (${ info.reviews.categorized.price.cnt }명)`
                    :
                    "리뷰 집계중"
            }</span>
        </div>
    </div>
};

export default ReviewBlock