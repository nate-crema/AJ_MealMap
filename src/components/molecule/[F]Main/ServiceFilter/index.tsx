import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import SvgManager from "@assets/svg";
import { ServiceFilterDisplayModeSelection, ServiceFilterDisplayModeTypes, ServiceFilterDisplayModeUnset, FilterFilteringModeTypes, FilterFilteringModeUnsetType, ServiceFilterDisplayModeSelectedDisplay, ServiceFilterSelectedFilterType } from "./types";
import { FILTER_TYPES, FilterFilteringModeUnset, SEARCHTEXT_SPLIT_FILTERS } from "./constant";

// interfaces
type ServiceFilterProps = {
    className?: string
    parent_display_mode?: ServiceFilterDisplayModeTypes
}



const ServiceFilter: React.FC<ServiceFilterProps> = ({ className, parent_display_mode }) => {


    // 검색모드 관련
        const [ isSearchActive, setIsSearchActive ] = useRecoilState<boolean>( states.isSearchActive );
    

    // 필터헤더 관련
        const headerTextRef = useRef<HTMLSpanElement>(null);
        const [ headerTextSize, setHeaderTextSize ] = useState<number>( 0 );
        const [ header_text, setHeaderText ] = useState<string>("필터");
        const [ backbtn_visible, setBackbtnVisible ] = useState<boolean>( false );

        // header_text 변경 시점에 header_text_size 재연산
        useEffect(() => {
            setHeaderTextSize( (headerTextRef.current?.offsetWidth || 0) );
        }, [ isSearchActive, header_text ]);


    // 표시모드 관련
        const [ assigned_display_mode, setAssignedDispalyMode ] = useState<ServiceFilterDisplayModeTypes>( ServiceFilterDisplayModeUnset );
        const [ display_mode, setDisplayMode ] = useState<ServiceFilterDisplayModeTypes>( ServiceFilterDisplayModeUnset );
        const [ dpmode_onchange, setDpmodeOnchange ] = useState<boolean>( false );

        // 부모 컴포넌트 표시모드 전환명령 적용
        useEffect(() => {
            if (!parent_display_mode) return;
            setDisplayMode( parent_display_mode );
        }, [ parent_display_mode ]);

        // 표시모드 전환 애니메이션 적용
        const DPMODE_ANIM_TIMEOUT = 300;
        useEffect(() => {
            setDpmodeOnchange( true );
            setTimeout(() => {
                setBackbtnVisible( display_mode === ServiceFilterDisplayModeSelection );
                setAssignedDispalyMode( display_mode );
                setTimeout(() => {
                    setDpmodeOnchange( false );
                }, DPMODE_ANIM_TIMEOUT);
            }, DPMODE_ANIM_TIMEOUT);
        }, [ display_mode ]);

        // 뒤로가기 버튼 이벤트 핸들러
        const backBtnClickHandler = () => {
            setDisplayMode( ServiceFilterDisplayModeUnset );
        }
    

    // 필터링모드 관련
        const [ filtering_mode, setFilteringMode ] = useState<FilterFilteringModeTypes | FilterFilteringModeUnsetType>( FilterFilteringModeUnset )
        const filtering_info = useMemo( () => FILTER_TYPES.find( v => v.mode === filtering_mode ), [ filtering_mode ] );

        // 필터링타입블록 클릭이벤트 핸들러
        const filterTypeBlockClickHandler = ( selected_mode: FilterFilteringModeTypes ) => {
            setDisplayMode( ServiceFilterDisplayModeSelection );
            setFilteringMode( selected_mode );
        }

        // 표시모드 전환 시점에 header_text 변경
        useEffect(() => {
            if ( assigned_display_mode === ServiceFilterDisplayModeUnset )
                return setHeaderText( "필터" );
            else if ( assigned_display_mode === ServiceFilterDisplayModeSelection )
                return setHeaderText( `적용가능한 필터: ${ filtering_info?.text }` );
            else if ( assigned_display_mode === ServiceFilterDisplayModeSelectedDisplay )
                return setHeaderText( `적용된 필터` );
        }, [ assigned_display_mode ]);

        // selection모드
            // selection block연산 관리
            const createHtmlSelectionBlockObject = ( selection: { text: string, refs: Array<string> } ) => {
                let { text, refs } = selection;
                
                // text에 포함된 참조블록 위치 확인
                const ref_types = text.match( /\$\{\d{0,}\}/g ) || [];
                const ref_locations = ref_types.map( ( ref, i ) => {
                    const update_text = text.split("");
                    update_text.splice( text.indexOf( ref ), 0, "_" );
                    text = update_text.toString().replaceAll( ",", "" );
                    return { ref, loc: text.indexOf( ref ), index: i };
                } );

                // 참조블록 생성
                const ref_blocks = ref_types.map( ( _, i ) => {

                    const ref_block = refs[i];
                    const ref_or_cmd = ref_block.match( /\$\[OR\((\$\[[a-zA-Z가-힣]{0,}\]){0,}|\|\)\]/g );
                    if ( ref_or_cmd ) {
                        // OR명령 속 여러 참조블록이 있을 경우
                        const or_able_refs = ref_block.replace("$[OR(", "").replace(")]", "").split(" | ");
                        return <div className="selection-ref-or-block">
                            { 
                                or_able_refs.map( v =>
                                    <div className="selection-ref-block">
                                        <span>{ v.replace( /[\$\[\]]/g, "" ) }</span>
                                    </div>
                                )
                            }
                        </div>;
                    }
                    // 단독 참조블록 return
                    return <div className="selection-ref-block">
                        <span>{ refs[i].replace( /[\$\[\]]/g, "" ) }</span>
                    </div>
                } )

                // selection blocks object 생성
                return <div className="selection-block">
                    {
                        text.split( /\$\{\d{0,}\}/g )
                        .map( (value, index) => value === "_" ? ref_blocks[index] : <span className="selection-plaintext">{ value }</span> )
                    }
                </div>
                
            }

            const selection_blocks = useMemo( () => {
                if ( !filtering_info ) return [];
                return filtering_info.themes
                .map( theme => ({
                    ...theme, 
                    selections: [
                        ...theme.selections.map( selection => ({
                            htmlObjects: createHtmlSelectionBlockObject( selection )
                        }) )
                    ]
                }) )
            }, [ filtering_info ] )

        // selected_display모드
            const [ selected_filter, setSelectedFilter ] = useState<ServiceFilterSelectedFilterType>({});

            // 검색 문자열 분석기능 관리
            const analyzeSearchString = ( text: string ) => {
                // 분리 기준에 따라 문자열 분리
                const splited_text = text.split( SEARCHTEXT_SPLIT_FILTERS );
            }

    return <div className={ `search-filter-wrap ${ className || "" } ${ ( assigned_display_mode === ServiceFilterDisplayModeSelection ) ? "free-extend" : "" }` }>
        <div className="filter-header">
            {
                ( backbtn_visible ) &&
                    <div className={`back-icn-wrap ${ dpmode_onchange ? "changing" : "nonchanging" }`} onClick={ backBtnClickHandler }>
                        <SvgManager className="back-icn" svg_type="arrow_left" style={{ "path": { fill: "var(--theme-color-C)" } }}/>
                    </div>
            }
            <span className={ `header-text ${ dpmode_onchange ? "changing" : "nonchanging" }` } ref={ headerTextRef } style={{
                left: `${ backbtn_visible ? 20 : 0 }px`
            }}>{ header_text }</span>
            <div className={ `design-bar ${ dpmode_onchange ? "changing" : "nonchanging" }` } style={{
                width: `calc(100% - ${ headerTextSize + ( backbtn_visible ? 30 : 10 ) }px)`,
                left: `${ headerTextSize + ( backbtn_visible ? 30 : 10 ) }px`,
            }}/>
        </div>
        <div className={ `filter-content ${ dpmode_onchange ? "changing" : "nonchanging" }` }>
            {
                ( assigned_display_mode === ServiceFilterDisplayModeUnset ) && <div className="filter-types">
                    { FILTER_TYPES.map(( filter_info, i ) => <>
                        <div className="filter-type-block" key={ i } onClick={ () => filterTypeBlockClickHandler( filter_info.mode ) }>
                            <div className="filter-iconarea">
                                <SvgManager className="filter-icon" svg_type={ filter_info.icn } style={ filter_info?.style }/>
                            </div>
                            <div className="filter-textarea">
                                <span className="filter-text">{ filter_info.text }</span>
                            </div>
                        </div>
                    </>) }
                </div>
            }
            {
                ( assigned_display_mode === ServiceFilterDisplayModeSelection ) && <div className="filter-selections">
                    <div className="selection-title">
                        <div className="selection-icnarea">
                            <SvgManager svg_type={ filtering_info?.icn || "" } className="selection-icn"/>
                        </div>
                        <div className="selection-textarea">
                            <span className="selection-text">{ filtering_info?.text }</span>
                        </div>
                    </div>
                    {
                        ( filtering_info ) && <>    
                            <div className="selection-list">
                                { filtering_info.themes.map( ( theme, i ) => <>
                                    <div className="selection-theme" key={ i }>
                                        <div className="selection-theme-title-wrap">
                                            <span className="selection-theme-title">{ theme.name }</span>
                                        </div>
                                        <div className="selection-theme-selections-wrap">
                                            { theme.selections.map( (_, sel_index) => selection_blocks[i].selections[sel_index].htmlObjects ) }
                                        </div>
                                    </div>
                                </> ) }
                            </div>
                        </>
                    }
                </div>
            }
            {
                ( assigned_display_mode === ServiceFilterDisplayModeSelectedDisplay ) && <div className="filter-selected-display">
                    
                </div>
            }
        </div>
    </div>
};

export default ServiceFilter