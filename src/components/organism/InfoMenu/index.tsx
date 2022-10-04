import { useState, useEffect, useRef, useCallback, useMemo, SyntheticEvent, MouseEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopContactType, ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";
import EventBlockWrap from "@molecule/[F]InfoMenu/EventBlockWrap";
import ShopSpecific from "@molecule/[F]InfoMenu/ShopSpecific";
import ImageBlock from "@molecule/[F]Blocks/ImageBlock";
import ReviewStatistic from "@molecule/[F]InfoMenu/ReviewStatistic";
import { InfoSpecificOpenInfoType } from "@template/InfoSpecific/type";

// interfaces
type touchState = "na" | "toUp" | "toDown";
type changeState = "standby" | "fadeIn" | "fadeOut";

type InfoMenuProps = {}

// components
const InfoMenu: React.FC<InfoMenuProps> = ({}) => {

    const [ info, setInfo ] = useRecoilState( states.shopSpecific );
    const setInfoSpecific = useSetRecoilState<InfoSpecificOpenInfoType>( states.infoSpecificOpenInfo );

    // ImageBlock 클릭 이벤트 처리
    const ImageBlockClickHandler = ( e: MouseEvent ) => {
        setInfoSpecific( "IMAGE" );
    }

    // ReviewBlock 클릭 이벤트 처리
    const ReviewStatisticClickHandler = ( e: MouseEvent ) => {
        setInfoSpecific( "REVIEW" );
    }

    return ( info ) ? <div className="info-menu">
        <EventBlockWrap className="shop-event"
            eventInfo={ info?.events }
        />
        <ShopSpecific className="shop-specs"
            info={ info } 
        />
        <ImageBlock className="shop-images"
            info={ info } 
            onClick={ ImageBlockClickHandler }
        />
        <ReviewStatistic className="shop-reviews"
            info={ info } 
            onClick={ ReviewStatisticClickHandler }
        />
    </div> : <></>
}

export default InfoMenu;