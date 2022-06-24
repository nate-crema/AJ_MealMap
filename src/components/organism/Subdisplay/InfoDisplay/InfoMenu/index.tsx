import { useState, useEffect, useRef, useCallback, useMemo, SyntheticEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopContactType, ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";
import EventBlockWrap from "@organism/Shop/EventBlockWrap";
import ShopSpecific from "@molecule/Shop/ShopSpecific";
import ImageBlock from "@molecule/Shop/ImageBlock";
import ReviewBlock from "@molecule/Shop/ReviewBlock";

// interfaces
type touchState = "na" | "toUp" | "toDown";
type changeState = "standby" | "fadeIn" | "fadeOut";

type InfoMenuProps = {}

// components
const InfoMenu: React.FC<InfoMenuProps> = ({}) => {

    const [ shopInfo, setShopInfo ] = useRecoilState<ShopServiceType>( states.shopSpecific );

    return <div className="info-menu">
        <EventBlockWrap className="shop-event" eventInfo={ shopInfo?.events }/>
        <ShopSpecific className="shop-specs"/>
        <ImageBlock className="shop-images"/>
    </div>
}

export default InfoMenu;