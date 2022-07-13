import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType, InfoSpecificOpenSize } from "@interfaces/InfoSpecific";
import WorktimeInfoSpecific from "@molecule/Shop/InfoSpecific/display/worktime";
import MenuInfoSpecific from "@molecule/Shop/InfoSpecific/display/menu";
import EventInfoSpecific from "@molecule/Shop/InfoSpecific/display/event";
import ContactInfoSpecific from "@molecule/Shop/InfoSpecific/display/contact";
import LocationInfoSpecific from "@molecule/Shop/InfoSpecific/display/location";
import ImageInfoSpecific from "@molecule/Shop/InfoSpecific/display/image";
import ReviewInfoSpecific from "@molecule/Shop/InfoSpecific/display/review";
import SvgManager from "@assets/svg";
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import InfoSpecCtrlBtn from "@molecule/Shop/InfoSpecific/button";
import ContactInfoAdd from "@molecule/Shop/InfoSpecific/add/contact";

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
    "CLOSED_TMP": {
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
    },
    "ADD/LOCATION": {
        text: "지도",
        size: "LARGE"
    },
    "ADD/MENU": {
        text: "메뉴",
        size: "LARGE"
    },
    "ADD/WORKTIME": {
        text: "영업시간",
        size: "LARGE"
    },
    "ADD/CONTACT": {
        text: "연락처",
        size: "MEDIUM"
    },
    "ADD/IMAGE": {
        text: "사진",
        size: "LARGE"
    },
    "ADD/REVIEW": {
        text: "리뷰",
        size: "LARGE"
    },
    "ADD/EVENT": {
        text: "할인",
        size: "LARGE"
    },
}

// interfaces
type InfoSpecificProps = {}

// components

const InfoSpecific: React.FC<InfoSpecificProps> = () => {

    const shop_specific = useRecoilValue( states.shopSpecific );
    const shop_info: ShopServiceType = useMemo( () => shop_specific || {} as ShopServiceType, [ shop_specific ] );

    const [ open_info_global, setOpenInfoGlobal ] = useRecoilState<InfoSpecificOpenInfoType>( states.infoSpecificOpenInfo );

    const [ open_info, setOpenInfo ] = useState<InfoSpecificOpenInfoType>("CLOSED");
    const [ open_size, setOpenSize ] = useState<InfoSpecificOpenSize>( "CLOSED" );

    const [ is_closed_tmp, setIsClosedTmp ] = useState<boolean>( false );

    const closeBtnClickHandler = () => {
        setOpenInfoGlobal( "CLOSED" );
    }
    
    useEffect(() => {
        console.log( open_info, open_info_global );
        if ( open_info === open_info_global ) return;

        if ( ![ open_info, open_info_global ].includes("CLOSED") ) {
            // UI CLOSE ANIMATION
            // setOpenInfo( "CLOSED_TMP" );
            setIsClosedTmp( true );
        }
        setTimeout(() => {
            // UI OPEN ANIMATION
            setOpenInfo( open_info_global );
            setOpenSize( mapped_openinfo[ open_info_global ].size );
            setIsClosedTmp( false );
        }, ![ open_info, open_info_global ].includes("CLOSED") ? 500 : 0);
        // 기존에 닫혀있었으면 UI CLOSE ANIMATION을 위한 대기시간 생략
    }, [ open_info, open_info_global ]);


    return <div 
        className={ "info-specific-window" + ( open_info === "CLOSED" ? ' window-closed' : '' ) }
        style={{
            height: `calc((100% - 150px) * ${ open_size } / 100)`
        }}
    >
        <InfoSpecCtrlBtn className="window-close-btn" type="close" onClick={ closeBtnClickHandler }>{ mapped_openinfo[ open_info ].text }</InfoSpecCtrlBtn>
        <div className={ "info-specific-area" + (
            is_closed_tmp ? ' specific-tmpclosed' : ""
        ) }>
            {
                ( [ "WORKTIME" ].includes( open_info ) ) ? <WorktimeInfoSpecific info={ shop_info }/>
                : ( [ "MENU", "ADD/MENU" ].includes( open_info ) ) ? <MenuInfoSpecific info={ shop_info }/>
                : ( [ "EVENT" ].includes( open_info ) ) ? <EventInfoSpecific info={ shop_info }/>
                : ( [ "CONTACT" ].includes( open_info ) ) ? <ContactInfoSpecific info={ shop_info }/>
                : ( [ "LOCATION" ].includes( open_info ) ) ? <LocationInfoSpecific info={ shop_info }/>
                : ( [ "IMAGE" ].includes( open_info ) ) ? <ImageInfoSpecific info={ shop_info }/>
                : ( [ "REVIEW" ].includes( open_info ) ) ? <ReviewInfoSpecific info={ shop_info }/>
                : ( [ "ADD/CONTACT" ].includes( open_info ) ) ? <ContactInfoAdd info={ shop_info }/>
                : <></>
            }
        </div>
    </div>
};

export default InfoSpecific