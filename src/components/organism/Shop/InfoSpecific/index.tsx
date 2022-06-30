import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType, InfoSpecificOpenSize } from "@interfaces/InfoSpecific";
import WorktimeInfoSpecific from "@molecule/Shop/InfoSpecific/worktime";
import MenuInfoSpecific from "@molecule/Shop/InfoSpecific/menu";
import EventInfoSpecific from "@molecule/Shop/InfoSpecific/event";
import ContactInfoSpecific from "@molecule/Shop/InfoSpecific/contact";
import LocationInfoSpecific from "@molecule/Shop/InfoSpecific/location";
import ImageInfoSpecific from "@molecule/Shop/InfoSpecific/image";
import ReviewInfoSpecific from "@molecule/Shop/InfoSpecific/review";

const mapped_opensize: {
    [ keys in InfoSpecificOpenSize ]: number
} = {
    "CLOSED": 0,
    "MEDIUM": 70,
    "LARGE": 100
}

const mapped_openinfo: {
    [ keys in InfoSpecificOpenInfoType ]: {
        text: string,
        size: InfoSpecificOpenSize
    }
} = {
    "CLOSED": {
        text: "",
        size: "CLOSED"
    },
    "LOCATION": {
        text: "지도",
        size: "LARGE"
    },
    "MENU": {
        text: "메뉴",
        size: "LARGE"
    },
    "WORKTIME": {
        text: "영업시간",
        size: "LARGE"
    },
    "CONTACT": {
        text: "연락처",
        size: "MEDIUM"
    },
    "IMAGE": {
        text: "사진",
        size: "LARGE"
    },
    "REVIEW": {
        text: "리뷰",
        size: "LARGE"
    },
    "EVENT": {
        text: "할인",
        size: "LARGE"
    }
}

// interfaces
type InfoSpecificProps = {}

// components

const InfoSpecific: React.FC<InfoSpecificProps> = () => {

    const [ open_info, setOpenInfo ] = useRecoilState<InfoSpecificOpenInfoType>( states.infoSpecificOpenInfo );
    const [ open_size, setOpenSize ] = useState<InfoSpecificOpenSize>( "CLOSED" );

    const closeBtnClickHandler = () => {
        setOpenInfo( "CLOSED" );
    }
    
    useEffect(() => {
        setOpenSize( mapped_openinfo[ open_info ].size );
    }, [ open_info ]);


    return <div 
        className={ "info-specific-window" + ( open_info === "CLOSED" ? ' window-closed' : '' ) }
        style={{
            height: `calc((100% - 150px) * ${ mapped_opensize[ mapped_openinfo[ open_info ].size ] } / 100)`
        }}
    >
        <div className="window-close-btn" onClick={ closeBtnClickHandler }>
            <span>{ mapped_openinfo[ open_info ].text } 닫기</span>
            <div className="btn-icn">
                <svg style={{ fill: "var(--theme-color-C)" }} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 300">
                    <path d="M249.96,235.42c-2.55,0-5.09-0.68-7.36-2.03L6.91,91.67C0.17,87.6-2.02,78.84,2.04,72.08c4.07-6.74,12.85-8.93,19.59-4.88
                        L249.96,204.5L478.37,67.2c6.77-4.05,15.52-1.87,19.59,4.88c4.05,6.76,1.87,15.52-4.88,19.59L257.31,233.38
                        C255.04,234.73,252.51,235.42,249.96,235.42z"/>
                </svg>
            </div>
        </div>
        <div className="info-specific-area">
            {
                ( open_info === "WORKTIME" ) ? <WorktimeInfoSpecific/>
                : ( open_info === "MENU" ) ? <MenuInfoSpecific/>
                : ( open_info === "EVENT" ) ? <EventInfoSpecific/>
                : ( open_info === "CONTACT" ) ? <ContactInfoSpecific/>
                : ( open_info === "LOCATION" ) ? <LocationInfoSpecific/>
                : ( open_info === "IMAGE" ) ? <ImageInfoSpecific/>
                : ( open_info === "REVIEW" ) && <ReviewInfoSpecific/>
            }
        </div>
    </div>
};

export default InfoSpecific