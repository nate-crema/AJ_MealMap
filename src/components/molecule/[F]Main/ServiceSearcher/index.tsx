import { useState, useEffect, useRef, ChangeEvent, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import SvgManager from "@assets/svg";
import ServiceFilter from "../ServiceFilter";
import { ServiceFilterDisplayModeSelectedDisplay } from "../ServiceFilter/types";

// interfaces
type ServiceSearcherProps = {
    className?: string
}

// components


const ServiceSearcher: React.FC<ServiceSearcherProps> = ({ className }) => {

    // Searcher 활성화기능 관리 관련
        const [ is_active, setIsActive ] = useRecoilState<boolean>( states.isSearchActive );

        const backBtnClickHandler = () => {
            setIsActive( false );
        }

        const searchAreaClickHandler = () => {
            setIsActive( true );
        }

    // 값 입력 관련
        const [ placeholder, setPlaceHolder ] = useState<string>("찾는 식당이 있나요?");
        const [ search_text, setSearchText ] = useState<string>("");

        const inputTagRef = useRef<HTMLInputElement>(null);
        
        // 값 입력 event handler
        const inputValueChangeHandler = ( e: ChangeEvent ) => {
            const target = e.target as any;
            setSearchText( target.value );
        }

        // 활성화 시 값 입력 자동 focus
        useEffect(() => {
            if ( !inputTagRef.current ) return;
            if ( is_active ) inputTagRef.current.focus();
        }, [ is_active ])

    // ServiceFilter의 필터 자동설정기능 활성화 관련
        const [ autofilter_active, setAutofilterActive ] = useState<boolean>( false );

        // 검색어 입력 시 필터 자동설정기능 활성화
        useEffect(() => {
            setAutofilterActive( ( search_text.length > 0 ) );
        }, [ search_text ]);

    return <div className="service-searcher-wrap">
        { ( is_active ) && <ServiceFilter className="filter-active" parent_display_mode={ ( autofilter_active ) ? ServiceFilterDisplayModeSelectedDisplay : undefined }/> }
        <div className={ `common-searcher ${ className || "" }` }>
            <div className={ `searcher-backbtn  ${ is_active ? "active" : "deactive" }`}
                onClick={ backBtnClickHandler }
            >
                <SvgManager svg_type="arrow_left" className="backbtn-icn"/>
            </div> 
            <div className={ `searcher-searcharea ${ is_active ? "active" : "deactive" }` }
                onClick={ searchAreaClickHandler }
            >
                <div className="icn-area">
                    <SvgManager svg_type="search" className="search-icn"/>
                </div>
                <div className="input-area">
                    <div className={ `placeholder ${ search_text.length > 0 ? "invisible" : is_active ? "halfVisible" : "visible" }` }>
                        <span className="placeholder-text">{ placeholder }</span>
                    </div>
                    <div className="input-design-wrap">
                        <input
                            type="text" value={ search_text } onChange={ inputValueChangeHandler }
                            ref={ inputTagRef }
                            className="input-tag"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default ServiceSearcher