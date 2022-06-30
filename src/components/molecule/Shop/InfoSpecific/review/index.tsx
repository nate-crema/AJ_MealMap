import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { CategorizedReviewType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import ReviewBlock from "@molecule/Shop/ReviewBlock";
import ReviewSpecBlock from "./ReviewSpecBlock";

// interfaces
type ReviewInfoSpecificProps = {}

// components

const ReviewInfoSpecific: React.FC<ReviewInfoSpecificProps> = ({}) => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );

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
        <ReviewBlock className="review-brief"/>
        { ( info.reviews.categorized ) && cat_list.map( ( category, index ) => <>
            <ReviewSpecBlock cat={ category } key={ index }/>
        </> )  }
    </div>
};

export default ReviewInfoSpecific