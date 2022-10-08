import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { DatetimeSelectorDisplayLanguageKorean, DatetimeSelectorDisplayLanguageTypes, DatetimeSelectorHandleValueAmpm, DatetimeSelectorHandleValueDay, DatetimeSelectorHandleValueHour, DatetimeSelectorHandleValueMinute, DatetimeSelectorHandleValueMonth, DatetimeSelectorHandleValueTypes, DatetimeSelectorInputCategoryDate, DatetimeSelectorInputCategoryTypes, DatetimeSelectorSelectedValueType } from "./types";

// constants
import { DATE_SELECTOR_SELECTIONS } from "./constants";
import SvgManager from "@assets/svg";


// interfaces
type ScrollSelectorProps = {
    onSelect: ( v: number ) => any // 사용자 입력값 추정 완료 시 실행될 함수
    selection_mode: DatetimeSelectorHandleValueTypes
    setValueAdjustment: ( v: boolean ) => any // 입력값 추정 중 사용자 입력 금지를 위한 state update handler
    onError: () => void
    lang?: DatetimeSelectorDisplayLanguageTypes
    readonly?: boolean
    init_value?: number
    init_assign?: boolean
}

type DatetimeSelectorProps = {
    className?: string
    inputValue: Array<DatetimeSelectorInputCategoryTypes>
    onValueSucceed?: ( v: DatetimeSelectorSelectedValueType ) => any
    lang?: DatetimeSelectorDisplayLanguageTypes
    readonly?: boolean
    init_value?: DatetimeSelectorSelectedValueType,
    init_assign?: boolean
}

// components
const ScrollSelector: React.FC<ScrollSelectorProps> = ({
    onSelect,
    selection_mode,
    setValueAdjustment,
    onError,
    lang = DatetimeSelectorDisplayLanguageKorean,
    readonly,
    init_value,
    init_assign = false
}) => {

    // 입력값 추정코드 관련
    const [ is_adjusting, setIsAdjusting ] = useState(false);
    const [ is_scrolling, setIsScrolling ] = useState<boolean>( false );
    const [ selected, setSelected ] = useState<number | undefined>( undefined );
    const [ default_selection_size, setDefaultSelectionSize ] = useState<number>(-1);

    const swipeRef = useRef( null );
    const swipeWrapRef = useRef( null );
    const last_scrolled = useRef( new Date().getTime() );

    // 스크롤위치 보정상태 동기화
    useEffect(() => {
        if ( !setValueAdjustment ) return;
        setValueAdjustment( is_adjusting );
    }, [ is_adjusting ]);

    // 선택영역 크기 불러오기
    useEffect(() => {
        const setter = () => {
            const select_area = window.document.querySelector("span.selectable-value.r");
            if (!select_area) return;
            const h = select_area.getBoundingClientRect().height;
            console.log("default_selection_size", h);
            setDefaultSelectionSize(h || 71);
            if ( h < 50 ) return setTimeout(() => {
                setter();
            }, 1000);
        }
        setter();
    }, []);

    // init_value 설정
    useEffect(() => {
        console.log("scroll-selector: init", init_value, init_assign);
        if ( init_value === selected ) return;
        if ( !init_assign ) return;
        else if ( init_value === undefined ) {
            resetScroll();
            return;
        }
        return adjustScroll( init_value, undefined, 150 );
    }, [ init_value, init_assign ]);

    // 사용자 입력값 DatetimeSelector로 전송
    useEffect(() => {
        if ( selected === undefined ) return;
        // console.log("scroll-selector: 사용자 입력값 동기화", selected);
        onSelect( selected );
    }, [ selected ])

    // 입력값 추정코드

    // 사용자 스크롤완료 기준시간
    const SCROLL_END_STANDARD = 300; // ms

    // 선택위치 보정값
    const SCROLL_ADJUST_VALUE = 71;

    // 선택영역 크기
    const SCROLL_SELECT_SIZE = 71;

    // 최상/하단 공백 선택영역 크기
    const TOPBOTTOM_SELECT_MARGIN = 71;
    
    /**
     * 사용자 스크롤액션 handler
     * @param e 사용자 스크롤로 인해 발생한 이벤트객체
     */
    const userScrollHandler = useCallback(( e: React.UIEvent<HTMLElement> ) => {
        setIsScrolling(true);
        const timestamp = new Date().getTime();
        last_scrolled.current = timestamp;

        // 자동 스크롤로 인해 이 함수가 실행된 것이 아니라면,
        // 스크롤완료 기준시간이 지난 이후 스크롤보정함수 실행
        if ( !is_adjusting ) setTimeout(() => {
            predictScrollValue( timestamp, e );
        }, SCROLL_END_STANDARD);
    }, [ is_adjusting, default_selection_size ]);

    /**
     * 사용자 스크롤값 추정 함수
     * @param timestamp 사용자 스크롤액션 handler가 실행된 시점의 타임스탬프; last_scrolled값과 일치하면 스크롤이 종료된 것으로 간주
     * @param e 사용자 스크롤로 인해 발생한 이벤트객체
     */
    const predictScrollValue = useCallback(( timestamp: number, e: React.UIEvent<HTMLElement> ) => {
        // 사용자 스크롤 완료여부 판별
        if ( last_scrolled.current !== timestamp ) return;

        // 스크롤 위치 획득
        const { scrollTop: user_scroll_height } = e.target as any;

        let select_value = Math.round( ( user_scroll_height - SCROLL_ADJUST_VALUE) / default_selection_size );

        // console.log( user_scroll_height, default_selection_size)
        console.log("select_value:firstcalc", select_value);
        
        if ( !swipeRef.current || !swipeWrapRef.current ) {
            setIsScrolling( false );
            return;
        }
        
        // 예외처리: 스크롤 위치가 선택범위를 벗어나는경우
        if ( DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length <= ( select_value ) )
            select_value = DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length - 1;
        else if ( ( select_value ) < 0 ) 
            select_value = 0;

        // 이미 스크롤위치 보정이 진행중일 경우 중복보정 금지
        if ( is_adjusting ) return;

        // 선택값으로 스크롤위치 보정
        adjustScroll( select_value );
        
    }, [ default_selection_size, is_adjusting ] );

    /**
     * 사용자 스크롤 보정 함수
     * @param index 사용자의 선택으로 추정되는 index값 (=자동으로 스크롤시킬 위치값)
     * @param skip_save 스크롤액션 뒤 해당 위치에 대응되는 값에 대한 저장 스킵여부 (선택)
     * @param delay_time 컴포넌트 크기 변경 등으로 인해 일정 시간 이후 실행할 시간값 (ms) (선택)
     */
    const adjustScroll = useCallback(( index: number, skip_save?: boolean, delay_time?: number ) => {
        setTimeout(() => {
            // document 마운트여부 확인
            if ( !swipeRef.current || !swipeWrapRef.current ) {
                setIsScrolling( false );
                return;
            } else setIsScrolling( true );
                // 스크롤위치 보정
                setIsAdjusting( true ); // 스크롤 보정여부 활성화; 사용자 스크롤 정지
                const { offsetHeight: totalSize } = swipeWrapRef.current; // 전체 선택박스 크기
        
                // 스크롤 위치 = 선택값 상하여백 크기 + ( 선택값영역 * 선택 index ) - 상하단 선택불가 영역 - 선택영역_선택값간 상하크기차
        
                const selectarea_prevpostarea_size = totalSize * 27 / 100; // 상하단 선택불가 영역
                const selectarea_selectablesize = totalSize - selectarea_prevpostarea_size * 2 // 선택가능 영역
                // const selectvalue_size = 21; // 선택값만의 크기
                // const selectvalue_topbottom_margin = 25; // 선택값 상하여백의 크기
                const selectvalue_size = 33; // 선택값만의 크기
                const selectvalue_topbottom_margin = 19; // 선택값 상하여백의 크기
                const selectvalue_totalsize = selectvalue_size + selectvalue_topbottom_margin * 2; // 선택값영역 크기
                const area_value_topbottom_sizediff = ( selectarea_selectablesize - selectvalue_totalsize ) / 2 // 선택영역_선택값간 상하크기차
        
                const scroll_position = TOPBOTTOM_SELECT_MARGIN + ( selectvalue_totalsize * index ) - selectarea_prevpostarea_size - area_value_topbottom_sizediff + (selectvalue_size/6);
        
                console.log("adjustScroll: run", index, scroll_position);
                (swipeRef.current as any).scrollTop = scroll_position;
                
                setTimeout(() => {
                    // 계산된 값 저장
                    if ( skip_save !== true ) setSelected( index );
                    setIsAdjusting( false );
                }, 500);
        }, delay_time || 0);
    }, [ default_selection_size ])

    const resetScroll = useCallback(() => {
        adjustScroll( -1, true );
        setSelected( undefined );
    }, [ default_selection_size ]);

    /**
     * 사용자 수동 스크롤 버튼 제어 함수
     * @param type 사용자가 입력한 스크롤 버튼의 유형: up | down
     */
    const scrollbtnClick = useCallback(( type: "up" | "down" )  => {
        if ( type === "up" ) {
            // console.log("scrollbtnClick", `index: ${ selected } ->`, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ selected === undefined ? -1 : selected ], ` => (update) ${ (selected || -1)+1 } -> `, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ (selected === undefined ? -1 : selected)+1 ] );
            if ( selected === undefined ) adjustScroll(0);
            else if ( DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length-1 > selected ) adjustScroll( selected+1 );
            else return;
        } else {
            // console.log("scrollbtnClick", `index: ${ selected } ->`, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ selected === undefined ? -1 : selected ], ` => (update) ${ (selected || -1)-1 } -> `, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ (selected === undefined ? -1 : selected)-1 ] );
            if ( !selected || selected < 1 ) return
            else adjustScroll( selected-1 );
        }
    }, [ selected ]);

    return <div className='scroll-selector-wrap' ref={ swipeWrapRef }>
        <div className="value-focus-bar bar-top"></div>
        <div className="value-focus-bar bar-bottom"></div>
        <div className="scrollbtn-area scrollbtn-top" onClick={ () => scrollbtnClick("up") }>
            <SvgManager svg_type="arrow_up" style={{ "path": { fill: "var(--theme-color-C)" } }}/>
        </div>
        <div className="scrollbtn-area scrollbtn-bottom" onClick={ () => scrollbtnClick("down") }>
            <SvgManager svg_type="arrow_down" style={{ "path": { fill: "var(--theme-color-C)" } }}/>
        </div>
        <div className={ `scroll-selector selector-${ selection_mode }` }
            ref={ swipeRef }
            onScroll={ userScrollHandler }
            style={{
                overflowY: (readonly || is_adjusting) ? "hidden" : undefined
            }}
        >
            <span className="selectable-value" style={{
                padding: "0",
                height: `${ TOPBOTTOM_SELECT_MARGIN }px`
            }}> </span>
            { DATE_SELECTOR_SELECTIONS[ selection_mode ][lang].map((v, i) => <>
                <span key={i} className={ "selectable-value r" + ( ( selected === i ) ? " selected" : "" ) + ( ( is_scrolling ) ? " onScrolling" : " nonScrolling" ) } style={{
                    // padding: ( (i === 0) && selected === v.value ) ? "12px 0px 25px 0px" : undefined
                }}>{ v.display }</span>
            </>) }
            <span className="selectable-value" style={{
                padding: "0",
                height: `${ TOPBOTTOM_SELECT_MARGIN }px`
            }}> </span>
        </div>
    </div>
}

const DatetimeSelector: React.FC<DatetimeSelectorProps> = ({ 
    className = "",
    inputValue,
    onValueSucceed,
    lang = DatetimeSelectorDisplayLanguageKorean,
    readonly = false,
    init_value, init_assign = false
}) => {

    // 값 선택 상태관리
    const [ select, setSelect ] = useState<DatetimeSelectorSelectedValueType>({});
    const [ editable, setEditable ] = useState<boolean>( false );
    
    /**
     * 선택값 업데이트 함수
     * @param type DatetimeSelector에서 관리하는 값들 중 변경할 대상값 종류
     * @param value 변경할 값
     */
    const setSelectValue = ( type: DatetimeSelectorHandleValueTypes, value: number ) => {
        setSelect( p => ({ ...p, [ type ]: value }) );
    }

    /**
     * 스크롤위치 보정을 위한 사용자 입력금지 설정함수
     * @param v 사용자 입력 금지여부
     */
    const setValueAdjustment = ( v: boolean ) => {
        setEditable( v );
    }

    /**
     * 사용자 입력값에 대한 비정상적 값에 대한 Error Handler
     */
    const onSelectionError = () => {
        console.log("error");
    }

    //  사용자 입력완료상태 확인

    useEffect(() => {
        if ( !onValueSucceed || Object.values( select ).length === 0 ) return;

        // 입력완료여부 확인
        if ( inputValue.includes("time") && 
            (( select.hour === undefined ) || ( select.minute === undefined ))
        ) return;
        if ( inputValue.includes("date") && 
            (( select.month === undefined ) || ( select.day === undefined ))
        ) return;
        if ( inputValue.includes("am/pm") && 
            (( select.ampm === undefined ))
        ) return;
        

        // 날짜 입력모드에 대한 날짜 유효성 검증
        if ( inputValue.includes("date") ) {
            const month = DATE_SELECTOR_SELECTIONS.month[ DatetimeSelectorDisplayLanguageKorean ][ select.month || -1 ];
            const day = DATE_SELECTOR_SELECTIONS.day[ DatetimeSelectorDisplayLanguageKorean ][ select.day || -1 ];

            if ( !month || !day ) return;

            const calced_date = new Date( `${ new Date().getFullYear() }-${ month.display }-${ day.display }` );
            if (
                month.value !== ( calced_date.getMonth() + 1 ) ||
                day.value !== ( calced_date.getDay() )
            ) return onSelectionError();
            
            return onValueSucceed( select );
        }

        console.log( select );

        const select_edited = {
            hour: select.hour !== undefined ? DATE_SELECTOR_SELECTIONS.hour[ lang ][ select.hour ].value : undefined,
            minute: select.minute !== undefined ? DATE_SELECTOR_SELECTIONS.minute[ lang ][ select.minute ].value : undefined,
            month: select.month !== undefined ? DATE_SELECTOR_SELECTIONS.month[ lang ][ select.month ].value : undefined,
            day: select.day !== undefined ? DATE_SELECTOR_SELECTIONS.day[ lang ][ select.day ].value : undefined,
            ampm: select.ampm !== undefined ? DATE_SELECTOR_SELECTIONS.ampm[ lang ][ select.ampm ].value : undefined
        }; // 실제값 불러오기

        if ( inputValue.includes("time") && ( select_edited.hour !== undefined ) && ( select_edited.ampm !== undefined ) ) {
            select_edited.hour = select_edited.hour + ( ( select_edited.ampm - 1 ) * 12 );
            delete select_edited.ampm;
        }

        // console.log("DatetimeSelector", "onValueSucceed", select, select_edited);
        return onValueSucceed( select_edited );
    }, [ select ]);


    return <div className={ className + " datetime_selector" } style={{
        gridTemplateColumns: 
            ( inputValue.length === 2 
                && ( inputValue.includes("time") || inputValue.includes("date") )
            ) ? `calc(33.33% - 20px) 10px calc(33.33% - 20px) 33.33%` :
            ( inputValue.length === 1 
                && ( inputValue.includes("time") || inputValue.includes("date") )
            ) ? `calc(50% - 15px) 10px calc(50% - 15px)` :
            ( inputValue.length === 1 ) ? `auto` :
            undefined
    }}>
        { inputValue.includes("time") && <>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DatetimeSelectorHandleValueHour , v ) }
                readonly={ readonly && editable }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DatetimeSelectorHandleValueHour] : undefined }
                init_assign={ init_assign }
                selection_mode={ DatetimeSelectorHandleValueHour }
                lang={ lang } 
            />
            <span className="selector-separator">:</span>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DatetimeSelectorHandleValueMinute , v ) }
                readonly={ readonly && editable }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DatetimeSelectorHandleValueMinute] : undefined }
                init_assign={ init_assign }
                selection_mode={ DatetimeSelectorHandleValueMinute }
                lang={ lang } 
            />
        </> }
        { inputValue.includes("date") && <>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DatetimeSelectorHandleValueMonth , v ) }
                readonly={ readonly && editable }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DatetimeSelectorHandleValueMonth] : undefined }
                init_assign={ init_assign }
                selection_mode={ DatetimeSelectorHandleValueMonth }
                lang={ lang } 
            />
            <span className="selector-separator">/</span>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DatetimeSelectorHandleValueDay , v ) }
                readonly={ readonly && editable }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DatetimeSelectorHandleValueDay] : undefined }
                init_assign={ init_assign }
                selection_mode={ DatetimeSelectorHandleValueDay }
                lang={ lang } 
            />
        </> }
        { inputValue.includes("am/pm") && <>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DatetimeSelectorHandleValueAmpm , v ) }
                readonly={ readonly && editable }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DatetimeSelectorHandleValueAmpm] : undefined }
                init_assign={ init_assign }
                selection_mode={ DatetimeSelectorHandleValueAmpm }
                lang={ lang } 
            />
        </> }
    </div>
};

export default DatetimeSelector