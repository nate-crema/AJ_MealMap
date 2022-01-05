import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/ReviewWrite.css";

// api
import { review, shop } from '../../../apis';

// component
import SearchInput from '../../../components/SearchInput';
import MobileBtn from './MobileBtn';
import DateSelector from '../../../components/DateSelector';

function ReviewWrite({ extendReviewArea, defaultizeReviewArea }) {

    const [ ment, _setMent ] = useState("어떤 식당을 다녀오셨나요?");
    const [ shop_info, setSI ] = useState({});
    const mentRef = useRef(<></>);

    const setMent = (v) => {
        if (mentRef.current) {
            mentRef.current.style.opacity = 0;
            mentRef.current.style.marginTop = "10px";
            setTimeout(() => {
                _setMent(v);
                setTimeout(() => {
                    if (mentRef.current) {
                        mentRef.current.style.opacity = 1;
                        mentRef.current.style.marginTop = "0px";
                    }
                }, 100);    
            }, 200);
        } else _setMent(v);
    }

    const [ mode, setMode ] = useState(0);

    // mode: 0 (search)

    const [ kw, setKw ] = useState("");
    const [ search_result, setSR ]=  useState([]);
    const [ reviews, setRV ] = useState([]);
    const [ prevres_close, setPC ] = useState(false);

    const _updateSearchResult = async (v) => {
        // update ui
        if (v.length > 0) extendReviewArea();
        
        // search keyword
        setTimeout(() => setKw(pv => {
            if (v !== pv || v.length <= 0) {
                setPC(true);
                setTimeout(() => {
                    setSR([]);
                    setPC(false);
                }, 150);
                return pv;
            }
            const { findShopList } = shop;
            findShopList(v)
            .then(res => {
                setPC(true);
                setTimeout(() => {
                    setSR(res);
                    setPC(false);
                }, 150);
            });
            return pv;
        }), 200);
    }

    const _blurHandler = (v) => {
        // update ui
        if (v.length <= 0) defaultizeReviewArea();
    }

    const _resultClickHandler = (info) => {
        setSI(info);
        setMent(`'${info?.name}'에 대한 질문을 가져오고 있어요..`);
        setMode(1);
        getQuestions(info._id);
    }

    
    // mode: 1 (reviewing)

    const [ review_info, setReviewInfo ] = useState({});
    const [ review_stage, setReviewStage ] = useState(0);
    const [ qurrent_answers, setQurrentAnswers ] = useState([]);

    useEffect(() => {
        if ( review_stage <= 0 ) return;
        if ( review_stage > review_info.questions.list.length ) return endReview();
        setMent( `Q${ review_stage }. ${ review_info.questions.list[ review_stage-1 ]["content_ko"] }` );
        console.log(review_info?.questions?.list[ review_stage-1 ]);
    }, [ review_stage ]);
    

    const getQuestions = async (id) => {
        const review_infos = await review.getQuestions(id);
        const { result, data: review_stateinfo, reason } = review_infos;

        if ( result ) {
            // start writing review
            setMent("리뷰 질문들을 가져왔어요!");
            return setTimeout(() => {
                startReview( review_stateinfo );
            }, 1000);
        } else switch( reason ) {
            case "UAR":
                setMent("24시간 이내에 이미 해당 매장의 리뷰를 작성하여 더이상 작성할 수 없어요. 내일 다시 시도해주세요.");
            default:
                return;
        }
    }

    const startReview = async ( review_stateinfo ) => {
        setReviewInfo( review_stateinfo );
        setMode(1);
        setReviewStage(1);
    }

    const _answeredHandler = useCallback( ( questionId, answer ) => {
        // save answer
        const answers = [ ...qurrent_answers, answer ];
        setQurrentAnswers( answers );

        // send answers when answers end
        const question_info = review_info.questions.list.find(v => v._id === questionId);
        if ( ( question_info.answer_cnt !== 0 ) && ( question_info.answer_cnt <= answers.length ) ) {
            saveAnswer( review_info.reviewId, questionId, answers );
            setReviewStage(p => p+1);
            setQurrentAnswers([]);
        }
    }, [ review_info, qurrent_answers ]);

    const saveAnswer = async ( reviewId, questionId, answer ) => {
        console.log(answer);
        const answer_saveres = await review.saveAnswer( reviewId, questionId, answer );
        console.log(answer_saveres);
    }

    const endReview = async () => {
        setMent( `응답해주셔서 감사합니다! 응답은 익명으로 처리된 뒤 태그와 점수에 반영돼요!` );
        const review_result = await review.endReview( review_info.reviewId );
        console.log(review_result);
    }

    return <div className="review-write">
        <span className="ment" ref={mentRef}>{ ment }</span>
        {
            (mode == 0) && <>
                <SearchInput className="review-searcher" valueState={[ kw, setKw ]} placeholder="상호명 검색" onChange={_updateSearchResult} onBlur={_blurHandler}/>
                <div className="search_results">
                    { search_result.map(v => <div className="result-block" onClick={(e) => _resultClickHandler(v)} style={{
                        animationName: prevres_close ? "result-block-out" : "result-block-in"
                    }}>
                        <span className="shopname">{ v.name }</span>
                        <span className="location">{ v?.loc?.addr }</span>
                    </div>) }
                </div>   
            </>
        }
        {
            (mode == 1) && <>
                <div className="answer-wrap" style={
                    ( review_info?.questions?.list[ review_stage-1 ]?.answer_type === 0 ) ? {
                        gridTemplateColumns: `repeat(2, calc(50% - 10px))`,
                        gridTemplateRows: `repeat(${ Math.ceil(review_info.questions.list[ review_stage-1 ].selections.length/2) }, 120px)`
                    } :
                    ( review_info?.questions?.list[ review_stage-1 ]?.answer_type === 2 ) ? {
                        gridTemplateColumns: `auto`,
                        gridTemplateRows: `calc(65% - 10px) calc(35% - 10px)`,
                    } : {}
                }>
                    { ( review_info?.questions?.list[ review_stage-1 ]?.answer_type === 0 ) && 
                        review_info.questions.list[ review_stage-1 ].selections.map( ( sel, i ) => <>
                            <MobileBtn className="selection" text={ sel.text_k } 
                                action={ 
                                    () => _answeredHandler( review_info.questions.list[ review_stage-1 ]._id, i )
                                } 
                                style={{ 
                                    boxShadow: qurrent_answers.includes(i) && "0px 2px 10px rgb(0 0 0 / 0%), inset 0px 2px 10px rgb(0 0 0 / 30%)",
                                    backgroundColor: sel.b_color,
                                    color: sel.t_color  
                                }}
                            />
                        </> 
                        )
                    }
                    { ( review_info?.questions?.list[ review_stage-1 ]?.answer_type === 1 ) && <>
                        </>
                    }
                    { ( review_info?.questions?.list[ review_stage-1 ]?.answer_type === 2 ) && <>
                            <DateSelector className="time-selector" inputValue={[ "date", "am/pm" ]} action={ 
                                ( value ) => _answeredHandler( review_info.questions.list[ review_stage-1 ]._id, value )
                            } />
                        </>
                    }
                </div>
            </>
        }
    </div>;
}

export default ReviewWrite;