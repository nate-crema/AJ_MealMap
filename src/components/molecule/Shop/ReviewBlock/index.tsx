import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";

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
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                    <g>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M0.2,235.62h50.93L1.97,36.65l29.01-7.11l50.93,206.08h94.16l60.99-203.7h26.06l60.99,203.7h94.14
                            l50.93-206.08l29.03,7.11l-49.15,198.97H500v29.62h-58.63l-50.93,206.08h-26.06L302.2,265.24H197.97l-62.18,206.08h-26.04
                            L58.82,265.24H0.2V235.62z M123.95,406.78l42.65-141.54H89.03L123.95,406.78z M250.1,92.91l-43.23,142.71h86.44L250.1,92.91z
                            M410.56,265.24h-76.97l42.04,141.54L410.56,265.24z"/>
                    </g>
                </svg>
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
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                    <g>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M75.3,496.74c-20.95,0-74.98-125.11-74.98-153.14c0-20.03,7.79-38.86,21.95-53.02
                            c14.16-14.17,32.99-21.97,53.02-21.97c0,0,0.01,0,0.02,0c41.34,0,74.97,33.62,74.98,74.96v0.03
                            C150.29,371.62,96.25,496.74,75.3,496.74z M75.31,288.67c0,0-0.01,0-0.01,0c-14.67,0-28.46,5.72-38.83,16.09
                            c-10.37,10.37-16.08,24.16-16.07,38.83c0,26.63,38.78,104.43,54.91,128.32c16.13-23.9,54.92-101.69,54.92-128.32v-0.03
                            C130.21,313.3,105.57,288.67,75.31,288.67z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M425.01,227.76c-20.95,0-74.99-125.11-74.99-153.14c0-41.34,33.62-74.99,74.97-75c0,0,0.01,0,0.01,0
                            c41.34,0,74.98,33.63,74.99,74.97v0.03C500,102.65,445.97,227.76,425.01,227.76z M425.01,19.69C425,19.69,425,19.69,425.01,19.69
                            c-30.28,0.01-54.92,24.65-54.91,54.93c0,26.63,38.78,104.42,54.92,128.32c16.13-23.9,54.92-101.69,54.92-128.32v-0.03
                            C479.92,44.32,455.28,19.69,425.01,19.69z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M188.05,362.11c-5.23,0-9.64-4.06-10-9.35c-0.37-5.53,3.8-10.31,9.33-10.69c0.92-0.06,91.83-6.84,118.62-55.41
                            c2.76-5,3.56-8.87,2.38-11.5c-3.93-8.75-28.07-14.19-45.69-18.16c-23.7-5.35-44.16-9.96-51.18-23.72
                            c-2.09-4.11-3.8-10.82-0.05-19.52c18.26-42.42,96.4-61.4,105.25-63.42c5.44-1.26,10.78,2.14,12.02,7.54
                            c1.23,5.4-2.14,10.78-7.54,12.02c-21.3,4.89-79.21,23.73-91.3,51.8c-0.13,0.31-0.79,1.9-0.49,2.47
                            c2.73,5.36,23.78,10.11,37.71,13.25c25.34,5.71,51.53,11.62,59.58,29.51c3.91,8.7,2.86,18.6-3.11,29.42
                            c-32.1,58.18-130.66,65.46-134.84,65.73C188.5,362.1,188.27,362.11,188.05,362.11z"/>
                    </g>
                </svg>
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
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                    <path style={{ fill: "var(--theme-color-C)" }} d="M250,499.6c-125.94,0-233.27-100.07-249.65-232.76c-1.58-12.8,2.3-25.55,10.63-34.97
                        c7.8-8.83,18.44-13.69,29.96-13.69h418.13c11.51,0,22.15,4.86,29.96,13.69c8.33,9.43,12.21,22.17,10.63,34.97
                        C483.27,399.53,375.94,499.6,250,499.6z M40.93,245.01c-3.71,0-7.21,1.64-9.85,4.63c-3.24,3.67-4.74,8.73-4.09,13.9
                        C41.71,382.82,137.58,472.76,250,472.76s208.29-89.94,223.01-209.22c0.64-5.16-0.85-10.23-4.1-13.9c-2.64-2.99-6.14-4.63-9.85-4.63
                        H40.93z"/>
                    <path style={{ fill: "var(--theme-color-C)" }} d="M123.74,203.76c-0.04,0-0.09,0-0.13,0c-7.41-0.07-13.36-6.13-13.29-13.55c0.22-22.76-6.74-30.05-16.36-40.14
                        c-9.26-9.72-20.8-21.8-24.67-46.96c-8.28-53.72,41.18-85.48,43.29-86.8c6.29-3.94,14.56-2.04,18.5,4.22
                        c3.94,6.26,2.06,14.53-4.19,18.48c-1.61,1.03-36.64,23.93-31.08,60.01c2.59,16.82,9.21,23.74,17.57,32.52
                        c11.3,11.85,24.1,25.26,23.78,58.93C137.08,197.83,131.09,203.76,123.74,203.76z"/>
                    <path style={{ fill: "var(--theme-color-C)" }} d="M237.21,203.76c-0.04,0-0.09,0-0.13,0c-7.41-0.07-13.36-6.13-13.29-13.55c0.35-36.66,14.03-51.67,26.11-64.92
                        c6.85-7.52,12.77-14.01,16.26-24.86c11.28-35.09-19-71.66-19.31-72.03c-4.76-5.66-4.06-14.12,1.6-18.9
                        c5.65-4.79,14.08-4.1,18.88,1.55c1.65,1.95,40.26,48.18,24.39,97.6c-5.27,16.41-14.15,26.14-21.98,34.73
                        c-10.54,11.56-18.86,20.69-19.11,47.11C250.56,197.83,244.57,203.76,237.21,203.76z"/>
                    <path style={{ fill: "var(--theme-color-C)" }} d="M369.83,203.76c-4.46,0-8.83-2.22-11.37-6.28c-3.94-6.26-2.06-14.53,4.19-18.48
                        c1.61-1.03,36.64-23.93,31.08-60.01c-2.59-16.82-9.2-23.74-17.57-32.52c-11.3-11.85-24.1-25.26-23.77-58.93
                        c0.07-7.36,6.07-13.29,13.42-13.29c0.04,0,0.09,0,0.13,0c7.41,0.07,13.36,6.14,13.29,13.55c-0.22,22.76,6.73,30.05,16.35,40.14
                        c9.26,9.72,20.8,21.8,24.67,46.96c8.28,53.72-41.18,85.48-43.29,86.8C374.74,203.1,372.27,203.76,369.83,203.76z"/>
                </svg>
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