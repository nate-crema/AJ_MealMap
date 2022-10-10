import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import DatetimeSelector from "../DatetimeSelector";
import ServiceButton from "@atom/ServiceButton";

// interfaces
import { MultiDatetimeSelectorInputCatRest, MultiDatetimeSelectorInputCatTypes, MultiDatetimeSelectorInputCatWork, MultiDatetimeSelectorInputModeFrom, MultiDatetimeSelectorInputModeTypes, MultiDatetimeSelectorInputTimesType, MultiDatetimeSelectorValuesType } from "./types";
import { DatetimeSelectorSelectedValueType } from "../DatetimeSelector/types";
import { DATE_SELECTOR_SELECTIONS } from "../DatetimeSelector/constants";


type MultiDatetimeSelectorProps = {
    INPUT_MODES: MultiDatetimeSelectorValuesType
    init_value?: MultiDatetimeSelectorInputTimesType
    onAnswered: ( result: MultiDatetimeSelectorInputTimesType ) => any
}

const MultiDatetimeSelector: React.FC<MultiDatetimeSelectorProps> = ({ INPUT_MODES, init_value, onAnswered }) => {

    // 전체 입력값 제어
    const [ input_value, setInputValue ] = useState<MultiDatetimeSelectorInputTimesType>( init_value ||  {
        work: {
            from: { h: -1, m: -1 },
            to: { h: -1, m: -1 }
        },
        rest: {
            from: { h: -1, m: -1 },
            to: { h: -1, m: -1 }
        }
    } );

    // 입력모드/유형 제어
    const [ input_mode, setInputMode ] = useState<MultiDatetimeSelectorInputModeTypes>( MultiDatetimeSelectorInputModeFrom );
    const [ input_cat, setInputCat ] = useState<MultiDatetimeSelectorInputCatTypes>( MultiDatetimeSelectorInputCatWork );

    // 초기 설정값 적용 제어
    const [ initAssign, setInitAssign ] = useState<boolean>( false );

    // 입력창 영역 제어
    const datetimeSelectorWrapRef = useRef<any>( null );
    const [ is_alert_input_active, setIsAlertInputActive ] = useState<boolean>( false );
    const is_alert_input_opened = useRef<boolean>( false );

    /**
     * 단일 DatetimeSelector 응답을 처리하기 위한 함수
     * @param result DatetimeSelecotr의 응답유형; DatetimeSelectorSelectedValueType
     * @return void
    */
    const onTimeInputHandler = useCallback( ( result: DatetimeSelectorSelectedValueType ) => {
        if ( initAssign ) return;
        // console.log("initAssign", initAssign);
        // console.log("time value input detected: multi-datetime-selector", result);
        setInputValue( p => ( { 
            ...p, 
            [ input_cat ]: {
                ...p[ input_cat ] || undefined ,
                [ input_mode ]: {
                    h: ( result.hour === undefined ) ?
                        p[ input_cat ][ input_mode ].h :
                        result.hour,
                    m: ( result.minute === undefined ) ?
                        p[ input_cat ][ input_mode ].m :
                        result.minute 
                }
            }
        } ) );
    }, [ input_mode, input_cat, initAssign ]);

    /**
     * MultiDatetimeSeletor 입력완료 처리함수: onAnswered 함수를 실행하여 상위 컴포넌트로 데이터 전송
     */
     const buttonClickHandler = useCallback(() => {
        onAnswered( input_value );
    }, [ input_value ]);

    /**
     * 사용자의 입력모드 설정액션 적용함수
     * @param v 
     * @param mode 
     */
    const modeChangeHandler = (v: any, modes: any) => {
        setInitAssign( false );
        setInputMode( v.type );
        setInputCat( modes.type );
        setTimeout(() => {
            setInitAssign( true );
            setTimeout(() => setInitAssign( false ), 300);
        }, 300);
    }

    // alert 입력 활성화
    useEffect(() => {
        if ( !input_cat || !input_mode || !is_alert_input_active ) return;

        const { type, title, isMultiple, submodes } = INPUT_MODES.find( v => v.type === input_cat ) || {};
        const { text: submode } = submodes?.find( v => v.type === input_mode ) || { text: "시간" };

        if ( is_alert_input_opened.current ) return;

        console.log("multi-datetime-selector: open serviceAlert", input_value);

        window.ServiceAlert({
            active: true,
            title: { text: `${ ( title || "영업시간" ).replace("시간", ` ${ submode }` ) } 입력` },
            descriptions: [
                { text: `수정할 ${ ( title || "영업시간" ).replace("시간", ` ${ submode }` ) }을 입력해주세요` }
            ],
            content: <div className="alert-datetime-selector-wrap">
                <DatetimeSelector
                    inputValue={[ "time", "am/pm" ]}
                    onValueSucceed={ onTimeInputHandler }
                    className="datetime-comp"
                    init_value={ 
                        ( !Object.values( input_value[ input_cat ][ input_mode ]).includes( -1 ) ) ? 
                        ( {
                            hour: DATE_SELECTOR_SELECTIONS.hour.ko.findIndex( v => ( v.value === ( input_value[ input_cat ][ input_mode ].h % 12 ) ) ),
                            minute: DATE_SELECTOR_SELECTIONS.minute.ko.findIndex( v => ( v.value === ( input_value[ input_cat ][ input_mode ].m ) ) ),
                            ampm: DATE_SELECTOR_SELECTIONS.ampm.ko.findIndex( v => ( v.value === ( ( input_value[ input_cat ][ input_mode ].h >= 12 ) ? 2 : 1 ) ) ) 
                        } )
                        : undefined 
                    }
                    init_assign={ true }
                />
            </div>,
            buttons: [{
                text: "입력창 닫기",
                onAction(closeAlert) {
                    is_alert_input_opened.current = false;
                    closeAlert()
                },
            }],
            size: "thirdQuarter",
            onBackgroundClick( closeAlert ) {
                is_alert_input_opened.current = false;
                closeAlert();
            }
        });
        is_alert_input_opened.current = true;
    }, [
        is_alert_input_active,
        input_cat, input_mode,
        input_value
    ]);

    // 직전 저장값 출력 (for debuging)
    useEffect(() => {
        console.log( "multi-datetime-selector: saved input value", input_value );
    }, [ input_value ]);

    // 초기 설정값 적용
    useEffect(() => {
        console.log("초기 설정값 적용", init_value);
        if ( init_value ) {
            setInitAssign( false );
            setTimeout(() => {
                setInitAssign( true );
                setTimeout(() => setInitAssign( false ), 300);
            }, 300);
        }
    }, []);

    // 수정시간 alert에서 입력여부 결정
    const resizeHandler = () => setTimeout(() =>{
        const { offsetHeight } = datetimeSelectorWrapRef.current;
        console.log( offsetHeight );
        console.log( "resizeHandler", offsetHeight <= 80 );
        setIsAlertInputActive( offsetHeight <= 80 );
    }, 200);

    // 입력여부 결정 event handler 설정
    useEffect(() => {
        resizeHandler();
        window.addEventListener( "resize", resizeHandler );
        return () =>
            window.removeEventListener( "resize", resizeHandler );
    }, []);

    return <div className="multi-datetime-selector">
        <div className="datetime-inputtype-control">
            { INPUT_MODES.map( modes => <>
                <div className="input_mode">
                    <div className="selection-background" style={{
                        width: modes.type === input_cat ? undefined : "0",
                        transform: `translate( ${ input_mode === "from" ? "-80px" : input_mode === "to" ? "0" : "" }, -50% )`
                    }}/>
                    <span className="cat_title">{ modes.title }</span>
                    <div className="cat_modes">
                        { modes.submodes.map( v => <span className={ `cat_submode submode_${ v.text }` } onClick={ () => modeChangeHandler( v, modes ) }>{ v.text }</span> ) }
                    </div>
                </div>
            </> ) }
        </div>
        <div className="datetime-comp-wrap" ref={ datetimeSelectorWrapRef }>
            {
                ( is_alert_input_active ) ? <></> :
                <DatetimeSelector
                    inputValue={[ "time", "am/pm" ]}
                    onValueSucceed={ onTimeInputHandler }
                    className="datetime-comp"
                    init_value={ 
                        ( !Object.values( input_value[ input_cat ][ input_mode ]).includes( -1 ) ) ? 
                        ( {
                            hour: DATE_SELECTOR_SELECTIONS.hour.ko.findIndex( v => ( v.value === ( input_value[ input_cat ][ input_mode ].h % 12 ) ) ),
                            minute: DATE_SELECTOR_SELECTIONS.minute.ko.findIndex( v => ( v.value === ( input_value[ input_cat ][ input_mode ].m ) ) ),
                            ampm: DATE_SELECTOR_SELECTIONS.ampm.ko.findIndex( v => ( v.value === ( ( input_value[ input_cat ][ input_mode ].h >= 12 ) ? 2 : 1 ) ) ) 
                        } )
                        : undefined 
                    }
                    init_assign={ initAssign }
                />
            }
        </div>
        <ServiceButton text="선택완료" theme="main-selection"
            className="multi-datetime-finish-button"
            style={{ fontSize: "16px" }}
            onClick={ buttonClickHandler }
        />
    </div>
};

export default MultiDatetimeSelector