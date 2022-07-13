import { useState, useEffect, useRef, MouseEvent, useMemo, useCallback, TouchEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/WorktimeSelector.css';
import DateSelector from "@src/components/molecule/Selectors/DateSelector";
import ServiceButton from "@atom/ServiceButton";

// components

// interfaces
type catType = "work" | "rest";
type modeType = "from" | "to";

type inputTimesType = { [ keys in catType ]: { [ keys in modeType ]: { h: number, m: number } } };

type WorktimeSelectorProps = {
    selected: inputTimesType | undefined,
    onAnswered: ( answer: any ) => any
}

const WorktimeSelector: React.FC<WorktimeSelectorProps> = ({ selected, onAnswered }) => {

    // inputmode control
    const INPUT_MODES: Array<{ type: catType, title: string, isMultiple: boolean, submodes: Array<{ type: modeType, text: string }> }> = [
        { type: "work", title: "영업시간", isMultiple: false, submodes: [ { type: "from", text: "시작시간" }, { type: "to", text: "종료시간" } ] },
        { type: "rest", title: "휴식시간", isMultiple: true, submodes: [ { type: "from", text: "시작시간" }, { type: "to", text: "종료시간" } ] }
    ]

    const [ input_cat, setInputCat ] = useState<catType>( "work" );
    const [ input_mode, setInputMode ] = useState<modeType>( "from" );

    // inputed value control
    const [ initAssign, setInitAssign ] = useState<boolean>( false );
    const [ input_times, setInputTimes ] = useState<inputTimesType>( {
        work: {
            from: { h: -1, m: -1 },
            to: { h: -1, m: -1 }
        },
        rest: {
            from: { h: -1, m: -1 },
            to: { h: -1, m: -1 }
        }
    } );

    const onTimeInputHandler = useCallback( ( result: any ) => {
        setInputTimes( p => ( { ...p, [ input_cat ]: { ...p[ input_cat ], [ input_mode ]: { h: ( result.hour + ( ( result.ampm - 1 ) * 12 ) ), m: result.minute } } } ) );
    }, [ input_cat, input_mode ]);

    useEffect(() => {
        console.log( "input_times", input_times );
    }, [ input_times ]);

    // prev_input value assign
    useEffect(() => {
        if ( selected ) {
            setInputTimes( selected );
            setInitAssign( false );
            setTimeout(() => {
                setInitAssign( true );
            }, 300);
        }
    }, [ selected ]);

    // button click handler
    const buttonClickHandler = () => {
        onAnswered( input_times );
    }

    return <div className="worktime-selector">
        <div className="worktime-inputmode-control">
            { INPUT_MODES.map( modes => <>
                <div className="input_cat">
                    <div className="selection-background" style={{
                        width: modes.type === input_cat ? undefined : "0",
                        transform: `translate( ${ input_mode === "from" ? "-80px" : input_mode === "to" ? "0" : "" }, -50% )`
                    }}/>
                    <span className="cat_title">{ modes.title }</span>
                    <div className="cat_modes">
                        { modes.submodes.map( v => <span className="cat_submode" onClick={ () => {
                            setInitAssign( false );
                            setInputCat( modes.type );
                            setInputMode( v.type );
                            setTimeout(() => {
                                setInitAssign( true );
                            }, 300);
                        } }>{ v.text }</span> ) }
                    </div>
                </div>
            </> ) }
        </div>
        <div className="worktime-selector-comp-wrap">
            <div className="worktime-fader fader-top"/>
            <DateSelector
                inputValue={[ "time", "am/pm" ]}
                onValueSucceed={ onTimeInputHandler }
                className="worktime-selector-comp"

                displayKO={ "ko" }
                init={ 
                    ( !Object.values(input_times[ input_cat ][ input_mode ]).includes( -1 ) ) ? 
                    ( {
                        hour: 
                            input_times[ input_cat ][ input_mode ].h === 0 ? 12 :
                            input_times[ input_cat ][ input_mode ].h === 12 ? 12 :
                            input_times[ input_cat ][ input_mode ].h % 12,
                        minute: input_times[ input_cat ][ input_mode ].m,
                        ampm: ( input_times[ input_cat ][ input_mode ].h >= 12 ) ? 2 : 1
                    } )
                    : undefined 
                }
                init_assign={ initAssign }
            />
            <div className="worktime-fader fader-bottom"/>
        </div>
        <ServiceButton text="선택완료" theme="main-selection"
            className="worktime-selector-finish-button"
            style={{ fontSize: "16px" }}
            onClick={ buttonClickHandler }
        />
    </div>
};

export default WorktimeSelector