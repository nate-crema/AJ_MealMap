import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter.css';

// api
import { APIResult, getReviewQuestion } from "@api/service";

// constant
import { AnswerID, BaseInfoQuestionID, BaseInfoSelectionFormat, QuestionID, ShopWhereQuestionID, ReviewPresetAnswerTypes, ReviewSelectionFormat } from "@interfaces/ReviewWriter";

// components
import ServiceTitler from "../../../molecule/Titler";
import ShopList from "../../../organism/Shop/ShopList";
import Selector from "./Selector";
import DateSelector from "../../../molecule/Selectors/DateSelector";
import MapSelector from "./MapSelector";
import BaseInfoSelector from "./BaseInfoSelector";

// interfaces
import { ComponentOpenState } from "@components/pages/Subdisplay/Subdisplay";
import { ReviewAnswer, ReviewQuestion } from "@interfaces/ReviewWriter";
import ReviewDateSelector from "./ReviewDateSelector";
import { useNavigate } from "react-router-dom";
import { ShopIDType } from "@interfaces/service/service.data.types/Shop";

const ReviewWriter: React.FC = () => {

    // global alert control
    const setGlobalAlert = useSetRecoilState( states.alert );

    // useEffect(() => {
    //     setTimeout(() => {
    //         setGlobalAlert({
    //             active: true,
    //             title: { text: "test-title" },
    //             descriptions: [
    //                 { text: "test description: paragraph A", style: { color: "var(--theme-color-C)" } },
    //                 { text: "test description: paragraph B", style: { color: "#22ffff" } },
    //                 { text: "test description: paragraph C", style: { color: "black" } },
    //             ],
    //             buttons: [
    //                 { text: "확인" }
    //             ],
    //             size: "half"
    //         } as alertOption)
    //     }, 1000)
    // }, [  ])

    // review common control
    const setSubdisplaySize = useSetRecoilState<ComponentOpenState>( states.subdisplayDisplaySize );
    const navigate = useNavigate();

    const [ review_state, setReviewState ] = useState( 0 );
    const [ review_display, setReviewDisplay ] = useState<boolean>( true );
    const [ ment, setMent ] = useState<string>("");

    const [ review_finished, setReviewFinished ] = useState<boolean>( false );

    useEffect(() => {
        setReviewDisplay( false );
        setTimeout(() => {
            setReviewDisplay( true );
        }, 300);
    }, [ review_state ]);
    

    // review info control
    const [ question_list, setQuestionList ] = useState<Array<ReviewQuestion>>([]);
    const [ question_result, setQuestionResult ] = useState<Array<ReviewAnswer>>([]);

    const answerHandler = useCallback( ( value: any ) => {
        const { qid, answer: { type, selection } } = question_list[ review_state ];
        console.log( "ReviewWriter: answerHandler", qid, value );

        if ( type === "writing-single" ) pushQuestionResult( { qid, answer: value as string } );
        else if ( type === "writing-multiple" ) pushQuestionResult( { qid, answer: value as Array<string> } );
        else if ( type === "base-info" ) pushQuestionResult( { qid, subAnswers: value } );
        else if ( [ "selection-date", "selection-location" ].includes( type ) ) pushQuestionResult( { qid, answer: value } );
        else pushQuestionResult( { qid, aid: value as AnswerID | null } );

        updateReviewStage();
    }, [ question_list, review_state ] );

    const pushQuestionResult = ( value: ReviewAnswer ) => {
        return setQuestionResult( p => [ ...p, value ] );
    }

    const updateReviewStage = useCallback( () => {
        if ( 
            question_list[ review_state + 1 ] && 
            review_state > 0
        ) setReviewState( review_state + 1 );
        else if ( review_state > 0 ) {
            setQuestionList([]);
            setTimeout(() => {
                setMent("리뷰해주셔서 감사합니다! 잘 정리해서 통계에 반영할게요");
                setSubdisplaySize( "MEDIUM" );
                setReviewFinished( true );
                setTimeout(() => {
                    navigate("/");
                    setSubdisplaySize( "LARGE" );
                }, 2000);
            }, 100);
        }
    }, [ question_list, review_state ] );

    useEffect(() => {
        if ( review_state !== 0 ) return;
        const Shop_id: ShopIDType | undefined = question_result.find( v => ( v.qid === ShopWhereQuestionID ) )?.aid || "" as ShopIDType;
        console.log( Shop_id );
        if ( Shop_id ) ( async () => {
            const qlist_result = await getReviewQuestion( Shop_id );
            console.log(qlist_result);
            if ( qlist_result.result === APIResult.SUCCEED ) setQuestionList( qlist_result.data );
            setReviewState( 1 );
        } )()
        else ( async () => {
            setQuestionList([
                {
                    qid: "QID_Shop_QUESTION",
                    ment: "어디를 다녀오셨나요?",
                    size: "LARGE",
                    answer: { type: "selection-Shop" }
                },
            ]);
        } )()
    }, [ review_state, question_result ]);

    // useEffect(() => console.log( question_list, question_result ), [ question_list, question_result ]);


    // ment control
    useEffect( () => {
        if ( question_list.length > 0 ) {
            setMent(question_list[ review_state ].ment);
            setSubdisplaySize( question_list[ review_state ].size );
        }
        else setMent("");
    }, [ review_state, question_list ] );



    return <div className="review-writer-area">
        <ServiceTitler
            className="review-writer-titler"
            style={{ height: review_finished ? "90px" : undefined  }}
            title="리뷰 추가하기" titleStyle={{ fontSize: "20px", fontWeight: "700" }}
            ment={ ment } mentStyle={{ fontSize: "16px" }}
        />
        <div className={ "review-writer-stagecomp " + ( review_display ? "displayIn" : "displayOut" ) }>
            {
                ( question_list.length > 0 ) ?
                    question_list[ review_state ].answer.type === "selection-Shop" ?
                        <ShopList mode="review" onBlockClick={answerHandler}/>
                    : 
                    question_list[ review_state ].answer.type === "selection" ?
                        <Selector 
                            selections={ ( question_list[ review_state ].answer?.selection || [] ) as Array<ReviewSelectionFormat> }
                            onAnswered={ answerHandler }
                        />
                    : 
                    question_list[ review_state ].answer.type === "selection-location" ?
                        <MapSelector 
                            onSelected={ () => setMent("위치가 이곳인가요?") }
                            onAnswered={ answerHandler }
                        />                   
                    : 
                    question_list[ review_state ].answer.type === "selection-time" ?
                        <ReviewDateSelector
                            onAnswered={ answerHandler }
                        />
                    :
                    question_list[ review_state ].answer.type === "base-info" ?
                        <BaseInfoSelector 
                            selection={ ( question_list[ review_state ].answer.selection || [] ) as Array<BaseInfoSelectionFormat> }
                            onSelected={ ( ment: string ) => setMent( ( ment === "[default]" ) ? question_list[ review_state ].ment : ment ) }
                            onAnswered={ answerHandler }
                        />
                    : <></>
                : ( review_finished ) ? <></>
                : <></>
            }
        </div>
    </div>
};

export default ReviewWriter