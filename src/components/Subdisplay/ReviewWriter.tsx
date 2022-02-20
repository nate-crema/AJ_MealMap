import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter.css';

// api
import { APIResult, getRestaurantList, getReviewQuestion } from "@api/service";

// constant
import { AnswerID, QuestionID, RestaurantWhereQuestionID, ReviewQuestionPreAnswerTypes } from "@interfaces/ReviewWriter";

// components
import ServiceTitler from "../ServiceTitler";
import Restaurants from "../Restaurants";
import Selector from "./ReviewWriter/Selector";

// interfaces
import { ComponentOpenState } from "@interfaces/Subdisplay";
import { ReviewAnswer, ReviewQuestion } from "@interfaces/ReviewWriter";
import { RestaurantCompInfo, RestaurantID, RestaurantList } from "@src/interfaces/Restaurant";
import MapSelector from "./ReviewWriter/MapSelector";

const ReviewWriter: React.FC = () => {

    // review common control
    const [ review_state, setReviewState ] = useState( 0 );
    const [ review_display, setReviewDisplay ] = useState<boolean>( true );
    const [ ment, setMent ] = useState<string>("");

    useEffect(() => {
        setReviewDisplay( false );
        setTimeout(() => {
            setReviewDisplay( true );
        }, 300);
    }, [ review_state ]);
    
    // review info control

    const [ question_list, setQuestionList ] = useState<Array<ReviewQuestion>>([]);
    const [ question_result, setQuestionResult ] = useState<Array<ReviewAnswer>>([]);

    const { lat, long } = useRecoilValue( states.location );

    const answerHandler = useCallback( ( value: any ) => {
        const { qid, answer: { type, selection } } = question_list[ review_state ];
        console.log( "answerHandler", qid, value );

        if ( type === "writing" ) pushQuestionResult( { qid, answer: value as string } );
        else if ( [ "selection-date", "selection-location" ].includes( type ) ) pushQuestionResult( { qid, answer: value } );
        else pushQuestionResult( { qid, aid: value as AnswerID | null } );

        setReviewState( p => ( p > 0 ) ? p+1 : p );
    }, [ question_list, review_state ] );

    const pushQuestionResult = ( value: ReviewAnswer ) => {
        return setQuestionResult( p => [ ...p, value ] );
    }

    useEffect(() => {
        if ( review_state !== 0 ) return;
        const restaurant_id: RestaurantID | undefined = question_result.find( v => ( v.qid === RestaurantWhereQuestionID ) )?.aid || "" as RestaurantID;
        console.log( restaurant_id );
        if ( restaurant_id ) ( async () => {
            const qlist_result = await getReviewQuestion( restaurant_id );
            console.log(qlist_result);
            if ( qlist_result.result === APIResult.SUCCEED ) setQuestionList( qlist_result.data );
            setReviewState( 1 );
        } )()
        else ( async () => {
            setQuestionList([
                {
                    qid: "QID_RESTAURANT_QUESTION",
                    ment: "어디를 다녀오셨나요?",
                    size: "LARGE",
                    answer: { type: "selection-restaurant" }
                },
            ]);
        } )()
    }, [ review_state, question_result ]);

    useEffect(() => console.log( question_list, question_result ), [ question_list, question_result ]);


    // ment control
    useEffect( () => {
        if ( question_list.length > 0 ) setMent(question_list[ review_state ].ment);
        else setMent("");
    }, [ review_state, question_list ] );



    return <div className="review-writer-area">
        <ServiceTitler
            className="review-writer-titler"
            title="리뷰 추가하기" titleStyle={{ fontSize: "20px", fontWeight: "700" }}
            ment={ ment } mentStyle={{ fontSize: "16px" }}
        />
        <div className={ "review-writer-stagecomp " + ( review_display ? "displayIn" : "displayOut" ) }>
            {
                ( question_list.length > 0 ) ?
                    question_list[ review_state ].answer.type === "selection-restaurant" ?
                        <Restaurants mode="review" onBlockClick={ answerHandler }/>
                    : 
                    question_list[ review_state ].answer.type === "selection" ?
                        <Selector 
                            selections={ question_list[ review_state ].answer?.selection || [] }
                            onAnswered={ answerHandler }
                        />
                    : 
                    question_list[ review_state ].answer.type === "selection-location" ?
                        <MapSelector onAnswered={ answerHandler } />                   
                    : <></>
                : <></>
            }
        </div>
    </div>
};

export default ReviewWriter