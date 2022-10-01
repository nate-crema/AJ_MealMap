import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { DateSelectorDisplayLanguageKorean, DateSelectorDisplayLanguageTypes, DateSelectorHandleValueAmpm, DateSelectorHandleValueDay, DateSelectorHandleValueHour, DateSelectorHandleValueMinute, DateSelectorHandleValueMonth, DateSelectorHandleValueTypes, DateSelectorInputCategoryTypes, SelectedValueType } from "./type";

// constants
import { DATE_SELECTOR_SELECTIONS } from "./constants";


// interfaces
type ScrollSelectorProps = {
    onSelect: ( v: number ) => any // 사용자 입력값 추정 완료 시 실행될 함수
    selection_mode: DateSelectorHandleValueTypes
    setValueAdjustment: ( v: boolean ) => any // 입력값 추정 중 사용자 입력 금지를 위한 state update handler
    onError: () => void
    lang?: DateSelectorDisplayLanguageTypes
    readonly?: boolean
    init_value?: number
    init_assign?: boolean
}

type DateSelectorProps = {
    className?: string
    inputValue: Array<DateSelectorInputCategoryTypes>
    onValueSucceed?: ( v: SelectedValueType ) => any
    lang?: DateSelectorDisplayLanguageTypes
    readonly?: boolean
    init_value?: SelectedValueType,
    init_assign?: boolean
}

// components
const ScrollSelector: React.FC<ScrollSelectorProps> = ({
    onSelect,
    selection_mode,
    setValueAdjustment,
    onError,
    lang = DateSelectorDisplayLanguageKorean,
    readonly,
    init_value,
    init_assign = true
}) => {

    // 입력값 추정코드 관련
    const [ is_adjusting, setIsAdjusting ] = useState(false);
    const [ is_scrolling, setIsScrolling ] = useState<boolean>( false );
    const [ selected, setSelected ] = useState<number | undefined>( undefined );
    const [ default_selection_size, setDefaultSelectionSize ] = useState<number>(-1);

    const swipeRef = useRef( null );
    const swipeWrapRef = useRef( null );
    const last_scrolled = useRef( new Date().getTime() );

    // 선택영역 크기 불러오기
    useEffect(() => {
        const select_area = window.document.querySelector("span.selectable-value.r");
        if (!select_area) return;
        const h = select_area.getBoundingClientRect().height;
        console.log("default_selection_size", h);
        setDefaultSelectionSize(h);
    }, []);

    // init_value 설정
    useEffect(() => {
        if ( !init_value || !init_assign ) return;
        
        

    }, [ init_value, init_assign ]);

    // 입력값 추정코드

    // 사용자 스크롤완료 기준시간
    const SCROLL_END_STANDARD = 300; // ms

    // 선택위치 보정값
    const SCROLL_ADJUST_VALUE = 71;

    // 선택영역 크기
    const SCROLL_SELECT_SIZE = 71;
    
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
        const { scrollTop: userScrollHeight } = e.target as any;
        let select_value = Math.round( ( userScrollHeight - SCROLL_ADJUST_VALUE) / default_selection_size );

        console.log( userScrollHeight, default_selection_size)
        console.log("select_value:firstcalc", select_value);

        if ( !swipeRef.current || !swipeWrapRef.current ) {
            setIsScrolling( false );
            return;
        }
        
        // 예외처리: 스크롤 위치가 선택범위를 벗어나는경우
        if ( DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length < ( select_value ) )
            select_value = DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length - 1;

        // 선택값으로 스크롤위치 보정
        adjustScroll( select_value );
        
    }, [ default_selection_size ] );

    const adjustScroll = useCallback(( value: number ) => {
        // document 마운트여부 확인
        if ( !swipeRef.current || !swipeWrapRef.current ) {
            setIsScrolling( false );
            return;
        } else setIsScrolling( true );

        // 스크롤위치 보정
        setIsAdjusting( true ); // 스크롤 보정여부 활성화; 사용자 스크롤 정지
        const { offsetHeight: totalSize } = swipeWrapRef.current; // 전체 선택박스 크기
        
        const top_nullarea_size = 71;
        const selectarea_prevpostarea_size = totalSize * 27 / 100;
        const selectarea_realsize = totalSize * 46 / 100;
        const selected_size = value === 0 ? 41 : 33;
        const selected_topbottom_padding = value === 0 ? 8 : 4;
        const selectarea_design_margin = ( selectarea_realsize - selected_size ) / 2;

        let scroll_value = 
            top_nullarea_size + 
            ( default_selection_size * value ) -
            ( selectarea_design_margin + selectarea_prevpostarea_size ) +
            selected_topbottom_padding
        ;

        (swipeRef.current as any).scrollTop = scroll_value;

        console.log("index", value, "scrolltop", default_selection_size * ((value-1) + 0.7));
        
        
        setTimeout(() => {
            // 계산된 값 저장
            setSelected( DATE_SELECTOR_SELECTIONS[ selection_mode ][lang][ value ].value );
            setIsAdjusting( false );
        }, 500);
    }, [ default_selection_size ])

    return <div className='scroll-selector-wrap' ref={ swipeWrapRef }>
        <div className="value-focus-bar bar-top"></div>
        <div className="value-focus-bar bar-bottom"></div>
        <div className={ `scroll-selector selector-${ selection_mode }` }
            ref={ swipeRef }
            onScroll={ userScrollHandler }
            style={{
                overflowY: (readonly || is_adjusting) ? "hidden" : undefined
            }}
        >
            <span className="selectable-value" style={{
                padding: "0",
                height: "71px"
            }}> </span>
            { DATE_SELECTOR_SELECTIONS[ selection_mode ][lang].map((v, i) => <>
                <span key={i} className={ "selectable-value r" + ( ( selected === v.value ) ? " selected" : "" ) + ( ( is_scrolling ) ? " onScrolling" : " nonScrolling" ) } style={{
                    padding: ( (i === 0) && selected === v.value ) ? "12px 0px 0px 0px" : undefined
                }}>{ v.display }</span>
            </>) }
            <span className="selectable-value" style={{
                padding: "0",
                height: "71px"
            }}> </span>
        </div>
    </div>
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
    className = "",
    inputValue,
    onValueSucceed,
    lang = DateSelectorDisplayLanguageKorean,
    readonly = false,
    init_value, init_assign = true
}) => {

    // 값 선택 상태관리
    const [ select, setSelect ] = useState<SelectedValueType>({});
    const [ editable, setEditable ] = useState<boolean>( false );
    
    /**
     * 선택값 업데이트 함수
     * @param type DateSelector에서 관리하는 값들 중 변경할 대상값 종류
     * @param value 변경할 값
     */
    const setSelectValue = ( type: DateSelectorHandleValueTypes, value: number ) => 
        setSelect( p => ({ ...p, [ type ]: value }) );

    /**
     * 스크롤위치 보정으로 인한 사용자 입력 금지상태 설정함수
     * @param v 사용자 입력 금지여부
     */
    const setValueAdjustment = ( v: boolean ) => {
        setEditable( v );
    }

    const onSelectionError = () => {
        console.log("error");
    }


    return <div className={ className + " timeinfo_selector" } style={{
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
                onSelect={ ( v: number ) => setSelectValue(DateSelectorHandleValueHour , v ) }
                readonly={ readonly }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DateSelectorHandleValueHour] : undefined }
                init_assign={ init_assign }
                selection_mode={ DateSelectorHandleValueHour }
                lang={ lang } 
            />
            <span className="selector-separator">:</span>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DateSelectorHandleValueMinute , v ) }
                readonly={ readonly }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DateSelectorHandleValueMinute] : undefined }
                init_assign={ init_assign }
                selection_mode={ DateSelectorHandleValueMinute }
                lang={ lang } 
            />
        </> }
        { inputValue.includes("date") && <>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DateSelectorHandleValueMonth , v ) }
                readonly={ readonly }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DateSelectorHandleValueMonth] : undefined }
                init_assign={ init_assign }
                selection_mode={ DateSelectorHandleValueMonth }
                lang={ lang } 
            />
            <span className="selector-separator">/</span>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DateSelectorHandleValueDay , v ) }
                readonly={ readonly }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DateSelectorHandleValueDay] : undefined }
                init_assign={ init_assign }
                selection_mode={ DateSelectorHandleValueDay }
                lang={ lang } 
            />
        </> }
        { inputValue.includes("am/pm") && <>
            <ScrollSelector 
                setValueAdjustment={ setValueAdjustment }
                onSelect={ ( v: number ) => setSelectValue(DateSelectorHandleValueAmpm , v ) }
                readonly={ readonly }
                onError={ onSelectionError }
                init_value={ init_value ? init_value[DateSelectorHandleValueAmpm] : undefined }
                init_assign={ init_assign }
                selection_mode={ DateSelectorHandleValueAmpm }
                lang={ lang } 
            />
        </> }
    </div>
};

export default DateSelector