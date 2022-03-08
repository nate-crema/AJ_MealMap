import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Login/ColDepFloatSelector.css';

// api
import { getUnivMajorSelectionList as getUnivMajorSelectionListAPI } from "../../api/univ";
import { UnivMajorSelectionList, UnivMajorSelectionListAPIResult } from "@src/interfaces/api/univ";

// components

// interfaces
type PartyInfoType = {
    college: { text: string, value: number } | null
    department: { text: string, value: number } | null
}

type ColDepFloatSelectorProps = {
    
}


const ColDepFloatSelector: React.FC<ColDepFloatSelectorProps> = ({  }) => {

    // selector state control
    const [ dropdown_active, setDropdownActive ] = useState<boolean>( false );

    // select value control
    const [ party_info, setPartyInfo ] = useState<PartyInfoType>({ college: null, department: null });
    const [ select_mode, setSelectMode ] = useState<"college" | "department">("college");
    const [ lang, setLang ] = useState<"ko"|"en">( "ko" );
    const [ selections, setSelections ] = useState<{ [ keys in "college" | "department" ]: UnivMajorSelectionList }>({ "college": [], "department": [] });

    useEffect(() => {
        updateSelections();
    }, []);

    const updateSelections = useCallback( async ( mode?: "college" | "department", value?: number ) => {
        console.log( select_mode, party_info );
        const result: UnivMajorSelectionListAPIResult = await getUnivMajorSelectionListAPI( mode || select_mode, value || party_info.college?.value );
        if ( result.result === "FAILED" ) {
            // error handling
            return;
        }
        setSelections( p => ({ ...p, [ select_mode ]: result.list }) );
    }, [ select_mode, party_info ] );

    const dropdownClickHandler = useCallback( ( mode: "college" | "department" ) => {
        setSelectMode( mode );
        updateSelections( mode );
        setDropdownActive( p => !p );
    }, [ select_mode ])

    const selectionClickHandler = useCallback( ( value: number ) => {
        setPartyInfo( p => ({ ...p, [ select_mode ]: { text: selections[ select_mode ].find( v => v.value === value )?.text[ lang ], value } }) )
        setDropdownActive( false );
        if ( select_mode === "college" ) {
            setSelectMode( "department" );
            updateSelections( "department", value );
        }
    }, [ party_info, select_mode, selections, lang ] );

    return <div className={ "float-selector " + ( dropdown_active ? "selector-extend-temp" : "" ) }>
        <div className="float-selector-input input-college" onClick={ () => dropdownClickHandler( "college" ) }>
            <div className="float-selector-dropdown-arrow">
                <svg 
                    className={ ( dropdown_active ? "dropdown-active" : "dropdown-deactive" ) }
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 31.275 23.859"
                >
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
            </div>
            <span className="selected" style={{
                opacity: dropdown_active ? 0 : 1
            }}>{ party_info.college?.text || "단과대학을 선택해주세요" }</span>
        </div>
        <div className="float-selector-input input-department" onClick={ () => dropdownClickHandler( "department" ) } style={{
            opacity: ( select_mode === "department" ) ? 1 : 0
        }}>
            <div className="float-selector-dropdown-arrow">
                <svg 
                    className={ ( dropdown_active ? "dropdown-active" : "dropdown-deactive" ) }
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 31.275 23.859"
                >
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
            </div>
            <span className="selected" style={{
                opacity: dropdown_active ? 0 : 1
            }}>{ party_info.department?.text || "학과를 선택해주세요" }</span>
        </div>
        {
            dropdown_active && <div className="selections" style={{
                height: dropdown_active && "calc( 100% - 60px )",
                opacity: dropdown_active ? 1 : 0
            }}>
                { selections[ select_mode ].map( selection => <div className="selection" onClick={ () => selectionClickHandler( selection.value ) } key={ selection.value }>
                    <span>{ selection.text[ lang ] }</span>
                </div> ) }
            </div>
        }
    </div>
};

export default ColDepFloatSelector