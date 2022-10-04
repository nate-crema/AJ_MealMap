import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/BaseInfoSelector.css';
import '@styles/animation/Animate.BaseInfoSelection.css';

// components
import Selector from "./Selector";
import MapSelector from "./MapSelector";

// interfaces
import { MapOnPlaceClickedFunction } from "@molecule/[F]Map/MapHandler/types";
import { AnswerID, BaseInfoSelectionFormat, QuestionID, ReviewSelectionFormat } from "@interfaces/ReviewWriter";
import Writor from "./Writor";
import ServiceButton from "@atom/ServiceButton";
import DateSelector from "@molecule/[F]Selector/DateSelector";
import WorktimeSelector from "./WorktimeSelector";

type BaseInfoSelectorProps = {
    selection: Array<BaseInfoSelectionFormat>
    onAnswered: ( answer: { [ keys in string ]: any } ) => any
    onSelected: ( ment: string ) => any
}

type BaseInfoSelectionProps = {
    info: BaseInfoSelectionFormat
    onClick: ( aid: AnswerID ) => any
}

const BaseInfoIcnAdminister: React.FC<{ qid: QuestionID }> = ({ qid }) => {
    return <>
        {
            ( qid === "QID_Shop_Number"
            ) ? <>
                <svg 
                    id="QID_Shop_Number_SVG_WAFFLE"
                    width="21.322"
                    height="21.366"
                    viewBox="0 0 21.322 21.366"
                >
                    <path 
                        id="QID_Shop_Number_PATH_WAFFLE"
                        data-name="QID_Shop_Number"
                        d="M468.1,570.852l1.982-1.982a.746.746,0,0,0,.005-1.049l-2.548-2.6a.745.745,0,0,0-1.06-.005l-1.348,1.35a2.8,2.8,0,0,1-2.674.76,11.243,11.243,0,0,1-7.472-7.464,2.8,2.8,0,0,1,.773-2.688l1.351-1.332a.746.746,0,0,0,0-1.058l-2.59-2.59a.745.745,0,0,0-1.054,0l-2.257,2.257a4.526,4.526,0,0,0-1.151,2.6c-.129,3.218,1.569,7.16,4.8,10.392a15.44,15.44,0,0,0,9.5,4.791"
                        transform="translate(-449.552 -551.398)"
                        fill="none"
                        stroke="var(--theme-color-C)"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                </svg>
            </>
            : ( qid === "QID_Shop_Menu"
            ) ? <>
                <svg 
                    id="QID_Shop_Menu_SVG_WAFFLE"
                    width="35.982"
                    height="28.407"
                    viewBox="0 0 35.982 23.407"
                >
                    <g 
                        id="Group_551"
                        data-name="Group 551"
                        transform="translate(-503.895 -550.378)"
                    >
                        <path 
                            id="QID_Shop_Menu_SVG_WAFFLE-Path_2"
                            data-name="QID_Shop_Menu"
                            d="M529.441,572.541l-5.453-.472a24.4,24.4,0,0,0-4.2,0l-14,1.21A1.28,1.28,0,0,1,504.395,572V553.475a1.282,1.282,0,0,1,1.171-1.277l14.218-1.229a24.4,24.4,0,0,1,4.2,0l14.218,1.229a1.282,1.282,0,0,1,1.171,1.277v10.692"
                            fill="none"
                            stroke="var(--theme-color-C)"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                        <line
                            id="QID_Shop_Menu_SVG_WAFFLE-Line_66"
                            data-name="QID_Shop_Menu"
                            x1="9.163"
                            y1="0.94"
                            transform="translate(525.614 555.655)"
                            fill="none"
                            stroke="var(--theme-color-C)"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                        <line 
                            id="QID_Shop_Menu_SVG_WAFFLE-Line_67"
                            data-name="QID_Shop_Menu"
                            x1="9.163"
                            y1="0.94"
                            transform="translate(525.614 561.69)"
                            fill="none"
                            stroke="var(--theme-color-C)"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                        <line 
                            id="QID_Shop_Menu_SVG_WAFFLE-Line_68"
                            data-name="QID_Shop_Menu"
                            x1="3.553"
                            y1="0.364"
                            transform="translate(525.614 567.709)"
                            fill="none"
                            stroke="var(--theme-color-C)"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="1"
                        />
                        <path 
                            id="QID_Shop_Menu_SVG_WAFFLE-Path_3"
                            data-name="QID_Shop_Menu"
                            d="M510.954,569.262a.328.328,0,0,1-.314-.34v-5.028c0-.534,0-1.264-.385-1.582a4.6,4.6,0,0,1-1.582-3.192c0-1.911,1.023-3.465,2.281-3.465s2.282,1.554,2.282,3.465a4.68,4.68,0,0,1-.546,2.259.3.3,0,0,1-.433.114.358.358,0,0,1-.105-.468,3.945,3.945,0,0,0,.455-1.905c0-1.51-.757-2.785-1.653-2.785s-1.652,1.275-1.652,2.785a3.9,3.9,0,0,0,1.335,2.651,2.679,2.679,0,0,1,.632,2.123v5.028A.328.328,0,0,1,510.954,569.262Z"
                            fill="var(--theme-color-C)"
                        />
                        <path
                            id="QID_Shop_Menu_SVG_WAFFLE-Path_4"
                            data-name="QID_Shop_Menu"
                            d="M516.848,568.174a.341.341,0,0,1-.341-.34V554.907a.34.34,0,1,1,.681,0v12.927A.34.34,0,0,1,516.848,568.174Z"
                            fill="var(--theme-color-C)"
                        />
                        <path 
                            id="QID_Shop_Menu_SVG_WAFFLE-Path_5"
                            data-name="QID_Shop_Menu"
                            d="M515.292,568.494a.34.34,0,0,1-.34-.34V555.227a.34.34,0,1,1,.68,0v12.927A.34.34,0,0,1,515.292,568.494Z"
                            fill="var(--theme-color-C)"
                        />
                    </g>
                </svg>
            </>
            : ( qid === "QID_Shop_Worktime"
            ) ? <>
                <svg
                    id="QID_Shop_Worktime_SVG_WAFFLE"
                    width="32.564"
                    height="32.564"
                    viewBox="0 0 32.564 32.564"
                >
                    <g
                        id="QID_Shop_Worktime-Group_553"
                        data-name="Group 553"
                        transform="translate(-567.149 -548.145)"
                    >
                        <path
                            id="QID_Shop_Worktime-Path_7"
                            data-name="Path 7"
                            d="M576.306,578.49l7.127-14.062h0v0l-.005,0L574.1,551.718a15.755,15.755,0,0,0,2.835,27.081C576.723,578.7,576.511,578.6,576.306,578.49Z"
                            fill="var(--theme-color-C)"
                            opacity="0.2"
                        />
                        <g
                            id="QID_Shop_Worktime-Group_552"
                            data-name="Group 552"
                        >
                            <path
                                id="QID_Shop_Worktime-Path_12"
                                data-name="Path 12"
                                d="M593.078,576.918a15.741,15.741,0,1,1,5.549-8.215"
                                fill="none"
                                stroke="var(--theme-color-C)"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                            />
                            <line
                                id="QID_Shop_Worktime-Line_69"
                                data-name="Line 69"
                                y1="1.063"
                                x2="7.206"
                                transform="translate(583.431 563.364)"
                                fill="none"
                                stroke="var(--theme-color-C)"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                            />
                            <line
                                id="QID_Shop_Worktime-Line_70"
                                data-name="Line 70"
                                x1="6.551"
                                y1="9.144"
                                transform="translate(576.88 555.283)"
                                fill="none"
                                stroke="var(--theme-color-C)"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                strokeWidth="1"
                            />
                        </g>
                    </g>
                </svg>
            </>
            : <></>
        }
    </>
}

const BaseInfoSelection: React.FC<BaseInfoSelectionProps> = ({ info, onClick }) => {

    const clickHandler = () => {
        onClick( info.aid );
    }

    return <div className="base-info-selection"
        onClick={ clickHandler }
    >
        <div className="selection-icn">
            {
                info.icn || <BaseInfoIcnAdminister qid={ info.aid }/>
            }
        </div>
        <span className="selection-text">{ info.selectionText }</span>
    </div>
}

const BaseInfoSelector: React.FC<BaseInfoSelectorProps> = ({ selection: selections, onAnswered, onSelected }) => {

    const [ selection_display, setSelectionDisplay ] = useState<boolean>( true );
    const [ selected_question, setSelectedQuestion ] = useState<BaseInfoSelectionFormat | null>( null );
    const [ selected_answer, setSelectedAnswer ] = useState<{ [ keys in string ]: any }>({});

    const selectionClickHandler = ( aid: AnswerID ) => {
        const selected: BaseInfoSelectionFormat | undefined = selections.find( v => v.aid === aid );
        if ( !selected ) return;
        setSelectionDisplay( false );
        setTimeout(() => {
            setSelectedQuestion( selected );
            setSelectionDisplay( true );
        }, 300);

        const { subQuestion } = selected;

        onSelected( subQuestion.ment );
    }

    const answerHandler = useCallback( ( value: any ) => {
        setSelectedAnswer( p => ({ ...p, [ selected_question?.aid || Object.keys(p).length ]: value }) );
        setSelectionDisplay( false );
        setTimeout(() => {
            setSelectedQuestion( null );
            onSelected( "[default]" );
            setSelectionDisplay( true );
        }, 300);
    }, [ selected_question ] );

    const baseInfoInputEndHandler = useCallback( () => {
        console.log("submit answers", selected_answer);
        onAnswered( selected_answer );
    }, [ selected_answer ]);

    useEffect(() => {
        console.log( "selected_answer", selected_answer );
    }, [ selected_answer ]);

    return <div className="base-info-selector"
    style={ Object.assign(( selected_question ) ? {
        display: "inherit"
    } : {
        gridTemplateRows: `repeat( ${ Math.ceil( selections.length/2 ) }, 100px )`,
    }, { opacity: selection_display ? "1" : "0" })}>
        {
            ( selected_question ) ? <>
                {
                    selected_question.subQuestion.answer.type === "writing-multiple" ?
                        <Writor
                            key="Writor"
                            placeholder={ selected_question.subQuestion.answer.placeholders || [] }
                            prevValues={ selected_answer[ selected_question?.aid ] || null }
                            maxInput={ selected_question.subQuestion.answer.maxInput || 0 }
                            onAnswered={ answerHandler }
                        />
                    : 
                    selected_question.subQuestion.answer.type === "selection" ?
                        <Selector 
                            key="Selector"
                            selections={ ( selected_question.subQuestion.answer?.selection || [] ) as Array<ReviewSelectionFormat> }
                            onAnswered={ answerHandler }
                        />
                    :
                    selected_question.subQuestion.answer.type === "selection-worktime" ?
                        <WorktimeSelector 
                            key="WorktimeSelector"
                            selected={ selected_answer[ selected_question.aid ] }
                            onAnswered={ answerHandler }
                        />
                    :
                    selected_question.subQuestion.answer.type === "selection-location" ?
                        <MapSelector 
                            key="MapSelector"
                            onAnswered={ answerHandler }
                        />
                    : <></>
                }
            </> : <>
                { selections.map( selection => <BaseInfoSelection key={ selection.aid } info={ selection } onClick={ selectionClickHandler } /> ) }
                <ServiceButton className="baseinfo-nextstep" style={{ fontSize: "16px" }} text="다음" theme="main-selection" onClick={ baseInfoInputEndHandler }/>
            </>
        }
    </div>
};

export default BaseInfoSelector