import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay/InfoMenu/ReviewBrief.css';

// components

// interfaces
import { RestaurantReview, ReviewCategory, ReviewType } from "@interfaces/Restaurant/Review";

type ReviewTagCompProps = {
    tag_name: ReviewCategory
}

type BriefCompProps = {
    type: ReviewType
    reviews: Array<ReviewCategory>
}

type ReviewBriefProps = {
    reviews: Array<RestaurantReview>
}

type ReviewTagStatistic = {
    key: ReviewCategory
    value: number
} | any;

type ReviewTagsDisplay = {
    [ keys in ReviewCategory ]: string
};

const ReviewTagComp: React.FC<ReviewTagCompProps> = ({ tag_name }) => {

    const reviewtags_dp: ReviewTagsDisplay = {
        "price": "가격",
        "taste": "맛",
        "amount": "양",
        "kind": "친절함",
        "interior": "인테리어",
        "distance": "거리",
        "enter_waiting": "입장 대기시간",
        "food_waiting": "음식 대기시간"
    }

    return <div className="review-tag">{ reviewtags_dp[ tag_name ] }</div>
}

const BriefComp: React.FC<BriefCompProps> = ({ type, reviews }) => {

    const COMP_TITLE = useMemo( () => 
        type === "good" ? {
            style: { color: "var(--theme-color-C)" },
            text: "이런게 좋아요"
        }
        : {
            style: { color: "gray" },
            text: "이건 별로에요"
        }
    , [ type ]);

    return <div className={ "review-comp" + ` review-comp-type-${ type }` }>
        <span className="comp-title" style={ COMP_TITLE.style }>{ COMP_TITLE.text }</span>
        <div className="tag-lists">
            { reviews.map( ( tag_name: ReviewCategory, i: number )  => <ReviewTagComp key={ i } tag_name={ tag_name }/> ) }
        </div>
    </div>
}

const ReviewBrief: React.FC<ReviewBriefProps> = ({ reviews }) => {

    const tags: Array<ReviewTagStatistic> = useMemo(() => {
        const tag_statistics: any = {};
        reviews
        .map( review => review.tag_list )
        .reduce( ( prev, curr ) => prev.concat( curr ) )
        .forEach( tag => {
            if ( !tag_statistics[ tag.value ] ) tag_statistics[ tag.value ] = 0;
            if ( tag.type === "good" ) tag_statistics[ tag.value ]++;
            else if ( tag.type === "bad" ) tag_statistics[ tag.value ]--;
        } );

        return Object.keys( tag_statistics ).map( tag_name => ({ key: tag_name, value: tag_statistics[ tag_name ] }) );
    }, [ reviews ]); 

    return <div className="review-brief">
        <BriefComp type="good" reviews={ tags.filter( cnt => cnt.value > 0 ).map( tag => tag.key ) } />
        <BriefComp type="bad" reviews={ tags.filter( cnt => cnt.value < 0 ).map( tag => tag.key ) } />
    </div>
}

export default ReviewBrief;