import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { CategorizedReviewType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import ReviewStatistic from "@molecule/[F]InfoMenu/ReviewStatistic";
import ReviewBlock from "@molecule/[F]Blocks/ReviewBlock";
import InfoSpecAddButton from "@molecule/[F]Buttons/InfoSpecAddButton";

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
            <ReviewStatistic info={ info } className="review-brief"/>
            { ( info.reviews.categorized ) && cat_list.map( ( category, index ) => <>
                <ReviewBlock cat={ category } key={ index } i={ index }/>
            </> )  }
        </div>
        <InfoSpecAddButton className="review-edit-btn" type="plus" specinfo_type="REVIEW">리뷰 추가하기</InfoSpecAddButton>
    </div>
};

export default ReviewInfoSpecific