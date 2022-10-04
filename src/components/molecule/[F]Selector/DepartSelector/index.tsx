import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import "./style.css";
// import '@styles/components/SelectorInput.css';
import { getUnivMajorSelectionList as getUnivMajorSelectionListAPI } from "@api/univ";
import { UnivMajorSelectionList } from "@interfaces/api/univ";
import ServiceButton from "@atom/ServiceButton";

// interfaces

type SelectionMode = "college" | "department";

export type SelectionValueType = {
    text: string
    value: number
} | null

type SelectorInputProps = {
    openstate: [ boolean, ( value: boolean ) => any ]
    mode: SelectionMode
    selected: string | ( undefined | null )
    onClick: ( mode: SelectionMode, active_state: boolean ) => any
    display: boolean
}

type DepartSelectorProps = {
    onSelectComplete: ( value: { college: SelectionValueType, department: SelectionValueType }, setLogoState: ( state: "univ" | "error" | "verified" ) => any ) => any
}

// components

const SelectorInput: React.FC<SelectorInputProps> = ({ mode, openstate, selected, onClick, display }) => {

    const [ active, setActive ] = openstate;

    const selectorInputClickHandler = useCallback( () => {
        setActive( !active );
        onClick( mode, !active );
    }, [ active ] );

    return <div className={ `selector-input selector-${ mode }` } onClick={ selectorInputClickHandler } style={ display ? { opacity: 1 } : { height: 0, opacity: 0 } } >
        <span className="selected-value">{ selected || (( mode === "college" ) ? "단과대학" : "학과") + "를 선택해주세요" }</span>
        <div className="selector-state-icn-wrap">
            {
                ( !active && selected ) ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30.003 30.002">
                    <g id="Group_580" data-name="Group 580" transform="translate(-868.565 -549.426)">
                        <path id="Path_129" className={ ( active ? "dropdown-active-selected-A" : "dropdown-deactive-selected-A" ) } data-name="Path 129" d="M898.068,564.427h0a14.5,14.5,0,0,1-14.5,14.5h0a14.5,14.5,0,0,1-14.5-14.5h0a14.5,14.5,0,0,1,14.5-14.5h0" fill="none" stroke="#005ab4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        <path id="Path_130" className={ ( active ? "dropdown-active-selected-B" : "dropdown-deactive-selected-B" ) } data-name="Path 130" d="M876.872,561.589l6.652,6.652,13.314-13.314" fill="none" stroke="#005ab4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    </g>
                </svg> : <svg className={ ( active ? "dropdown-active" : "dropdown-deactive" ) } xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" viewBox="0 0 31.275 23.859">
                    <path id="Path_128"
                        data-name="Path 128"
                        d="M827.137,570.763l-2.7,3.876a3,3,0,0,1-4.825,0l-12.224-17.527A2.666,2.666,0,0,1,809.8,553h24.448a2.666,2.666,0,0,1,2.413,4.115l-2.006,2.875" 
                        transform="translate(-806.384 -552.497)" 
                        fill="none"
                        stroke="#065ab4"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        strokeWidth="2"
                    />
                </svg> 
            }
        </div>
    </div>
}


const DepartSelector: React.FC<DepartSelectorProps> = ({ onSelectComplete }) => {

    const [ input_complete, setInputComplete ] = useState<boolean>( false );

    const [ lang, setLang ] = useState<"ko" | "en">( "ko" );

    const [ selections, setSelections ] = useState<{ [ keys in SelectionMode ]: UnivMajorSelectionList }>({ college: [], department: [] });
    const [ selectionlist_active, setSelectionlistActive ] = useState<boolean>( false );
    
    const [ college_open, setCollegeOpen ] = useState<boolean>( false );
    const [ department_open, setDepartmentOpen ] = useState<boolean>( false );
    const [ department_display, setDepartmentDisplay ] = useState<boolean>( false );
    
    const [ selected, setSelected ] = useState<{ [ keys in SelectionMode ]: SelectionValueType }>( { college: null, department: null } );
    const [ selection_mode, setSelectionMode ] = useState<SelectionMode>( "college" );

    const [ svg_state, setSvgState ] = useState<boolean>( true );
    const [ svg_mode, setSvgMode ] = useState<"univ" | "verified" | "error">( "univ" );

    useEffect(() => {
        updateSelections( "college" );
    }, [])

    useEffect(() => {
        if ( selected.college ) updateSelections( "department", selected.college.value );

        if ( selected.college && selected.department ) onSelectCompleteHandler();
    }, [ selected ]);

    const updateSelections = async ( mode: SelectionMode, selected_college?: number ) => {
        const api_result = await getUnivMajorSelectionListAPI( mode, selected_college );
        if ( api_result.result === "SUCCEED" ) {
            setSelections( p => ({ ...p, [ mode ]: api_result.list }) );
        } else {
            // error handling
            console.log("error", api_result);
        }
    }

    const selectorInputHandler = ( mode: SelectionMode, active_state: boolean ) => {
        if ( mode === "college" && active_state === true ) setDepartmentDisplay( false );
        else if ( mode === "college" && active_state === false ) setDepartmentDisplay( selected.college ? true : false );
        setSelectionMode( mode );
        setSelectionlistActive( active_state );
    }

    const selectionClickHandler = useCallback( ( value: number ) => {
        if ( !selections ) return;
        setSelected( p => ({ ...p, [ selection_mode ]: { text: selections[ selection_mode ].find( v => v.value === value )?.text[ lang ], value } }) )
        if ( selection_mode === "college" ) setSelected( p => ({ ...p, "department": null }) )
        setSelectionlistActive( false );
        if ( selection_mode === "college" ) {
            setDepartmentDisplay( true );
            setCollegeOpen( false );
        }
        else setDepartmentOpen( false );
    }, [ selections, selection_mode ] );

    const onSelectCompleteHandler = () => {
        setInputComplete( true );
        onSelectComplete( selected, ( state: "univ" | "error" | "verified" ) => {
            console.log(state);
            setSvgState( false );
            setTimeout(() => {
                setSvgMode( state );
                setTimeout(() => {
                    setSvgState( true );
                }, 500);
            }, 500);
        } );
    }

    return <>
        {
            ( !input_complete ) ? <div className={ "depart-selector" + ( selectionlist_active ? " extend-temp" : "" ) }>
                <SelectorInput 
                    key="college"
                    mode="college"
                    openstate={ [ college_open, setCollegeOpen ] }
                    selected={ selected.college?.text }
                    onClick={ selectorInputHandler }
                    display={ true }
                />
                <SelectorInput 
                    key="department"
                    mode="department"
                    openstate={ [ department_open, setDepartmentOpen ] }
                    selected={ selected.department?.text }
                    onClick={ selectorInputHandler }
                    display={ department_display }
                />
                <div className="selections-list" style={{ 
                    opacity: selectionlist_active ? 1 : 0,
                    height: selectionlist_active ? `calc( 100% - ${ department_display ? "150px" : "70px" } )` : "0"
                }}>
                    { selections && selections[ selection_mode ].map( ( selection, i ) => <div
                            key={ i }
                            className="selection-block"
                            onClick={ () => selectionClickHandler( selection.value ) }
                        >
                            <span className="selection-text">{ selection.text[ lang ] }</span>
                        </div> ) }
                </div>
            </div> : <div className="depart-selector-complete">
                <div className="info-card">
                    <div className="svg-wrap">
                        {
                            ( svg_mode === "univ" ) ?
                                <svg className={ "univ-logo" + ( svg_state ? " svg-in" : " svg-out" ) } xmlns="http://www.w3.org/2000/svg" width="68px" height="88px" viewBox="0 0 32.385 36.159">
                                    <g id="Group_581" data-name="Group 581" transform="translate(-645.367 -376.74)">
                                        <path id="Path_131" data-name="Path 131" d="M653.234,410.183l-5.867-10.7,10.019-16.306,9.566,16.479-2.029,3.537" fill="none" stroke="#0058b1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"/>
                                        <path id="Path_132" data-name="Path 132" d="M658.324,396.755l-2.071,2.816,6.9,10.612h5.694l6.9-10.957-11.3-19.757" fill="none" stroke="#0058b1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"/>
                                    </g>
                                </svg>
                            : ( svg_mode === "error" ) ?
                                <svg className={ "verify-error" + ( svg_state ? " svg-in" : " svg-out" ) } xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="-1 -1 38.611 32.714">
                                    <path id="Path_133" data-name="Path 133" d="M107.325,559.521v5.642a3,3,0,0,0,1.96,2.814l9.17,3.391a3,3,0,0,0,3.639-1.314l2.1-3.635a3,3,0,0,0,0-3l-7.134-12.357a3,3,0,0,0-2.6-1.5H100.191a3,3,0,0,0-2.6,1.5l-7.135,12.357a3,3,0,0,0,0,3l7.135,12.357a3,3,0,0,0,2.6,1.5h4.134a3,3,0,0,0,3-3v-6.819" transform="translate(-89.52 -549.062)" fill="none" stroke="#cc2200" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                </svg>
                            : ( svg_mode === "verified" ) ?
                                <svg className={ "verified" + ( svg_state ? " svg-in" : " svg-out" ) } xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="-1 -1 38.611 32.714">
                                    <g id="Group_582" data-name="Group 582" transform="translate(-151.065 -549.062)">
                                        <path id="Path_134" data-name="Path 134" d="M182.374,572.245l3.363-5.826a3,3,0,0,0,0-3L178.6,551.062a3,3,0,0,0-2.6-1.5H161.736a3,3,0,0,0-2.6,1.5L152,563.419a3,3,0,0,0,0,3l7.134,12.357a3,3,0,0,0,2.6,1.5h8.15" fill="none" stroke="#065ab4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                        <path id="Path_135" data-name="Path 135" d="M163.127,564.567l4.091,4.091,7.4-7.4" fill="none" stroke="#065ab4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                                    </g>
                                </svg>                          
                            : <></>
                        }
                    </div>
                    <div className="infos">
                        <p className="univ-name" style={{ color: ( svg_mode === "error" ? "#cc2200" : undefined ) }}>아주대학교</p>
                        <p className="college-name" style={{ color: ( svg_mode === "error" ? "#cc2200" : undefined ) }}>{ ( svg_mode === "error" ) ? "재학정보 인증실패" : selected.college?.text }</p>
                        <p className="department-name" style={{ color: ( svg_mode === "error" ? "#cc2200" : undefined ) }}>{ ( svg_mode === "error" ) ? "재학정보 인증실패" : selected.department?.text }</p>
                    </div>
                </div>
            </div>
        }
    </>
};

export default DepartSelector