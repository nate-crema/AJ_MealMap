import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { DateSelectorDisplayLanguageKorean, DateSelectorDisplayLanguageTypes, DateSelectorHandleValueAmpm, DateSelectorHandleValueDay, DateSelectorHandleValueHour, DateSelectorHandleValueMinute, DateSelectorHandleValueMonth, DateSelectorHandleValueTypes, DateSelectorInputCategoryTypes, SelectedValueType } from "./type";

// constants
import { DATE_SELECTOR_SELECTIONS } from "./constants";
import SvgManager from "@assets/svg";


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

        console.log( user_scroll_height, default_selection_size)
        console.log("select_value:firstcalc", select_value);

        if ( !swipeRef.current || !swipeWrapRef.current ) {
            setIsScrolling( false );
            return;
        }
        
        // 예외처리: 스크롤 위치가 선택범위를 벗어나는경우
        if ( DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length < ( select_value ) )
            select_value = DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length - 1;

        // 이미 스크롤위치 보정이 진행중일 경우 중복보정 금지
        if ( is_adjusting ) return;

        // 선택값으로 스크롤위치 보정
        adjustScroll( select_value );
        
    }, [ default_selection_size, is_adjusting ] );

    const adjustScroll = useCallback(( index: number ) => {
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

        (swipeRef.current as any).scrollTop = scroll_position;
        
        
        setTimeout(() => {
            // 계산된 값 저장
            setSelected( index );
            setIsAdjusting( false );
        }, 500);
    }, [ default_selection_size ])


    const scrollbtnClick = useCallback(( type: "up" | "down" )  => {
        if ( type === "up" ) {
            console.log("scrollbtnClick", `index: ${ selected } ->`, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ selected === undefined ? -1 : selected ], ` => (update) ${ (selected || -1)+1 } -> `, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ (selected === undefined ? -1 : selected)+1 ] );
            if ( selected === undefined ) adjustScroll(0);
            else if ( DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ].length-1 > selected ) adjustScroll( selected+1 );
            else return;
        } else {
            console.log("scrollbtnClick", `index: ${ selected } ->`, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ selected === undefined ? -1 : selected ], ` => (update) ${ (selected || -1)-1 } -> `, DATE_SELECTOR_SELECTIONS[ selection_mode ][ lang ][ (selected === undefined ? -1 : selected)-1 ] );
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