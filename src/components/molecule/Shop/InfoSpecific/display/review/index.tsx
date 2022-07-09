import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { CategorizedReviewType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import ReviewBlock from "@molecule/Shop/ReviewBlock";
import ReviewSpecBlock from "./ReviewSpecBlock";
import InfoSpecificButton from "../InfoSpecificButton";

// interfaces
type ReviewInfoSpecificProps = {
    info: ShopServiceType
}

// components

const ReviewInfoSpecific: React.FC<ReviewInfoSpecificProps> = ({ info }) => {

    // 리뷰 통계정보 처리
    const cat_list = useMemo<Array<CategorizedReviewType & { cat_keyname: string }>>( () => 
        Object.keys( info.reviews?.categorized || [] )
        .map( v => Object.assign(
            { cat_keyname: v },
            (info.reviews.categorized as unknown as { [ key in string ]: CategorizedReviewType })[ v ]
        ) ),
        [ info ]
    ); // 통계종목
    
    useEffect(() => {
        console.log("review", cat_list);
    }, [ cat_list ]);
    

    return <div className="shop-specinfo-review">
        <div className="review-stats-wrap">
            <ReviewBlock info={ info } className="review-brief"/>
            { ( info.reviews.categorized ) && cat_list.map( ( category, index ) => <>
                <ReviewSpecBlock cat={ category } key={ index } i={ index }/>
            </> )  }
        </div>
        <InfoSpecificButton className="review-edit-btn" type="plus">영업시간이 이상해요</InfoSpecificButton>
    </div>
};

export default ReviewInfoSpecific