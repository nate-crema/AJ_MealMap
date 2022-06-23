import { useState, useEffect, useRef, useCallback, useMemo, SyntheticEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopContactType, ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";

// interfaces
type touchState = "na" | "toUp" | "toDown";
type changeState = "standby" | "fadeIn" | "fadeOut";

type InfoMenuProps = {}

// components
const InfoMenu: React.FC<InfoMenuProps> = ({}) => {
    
    const preloaded_shops: Array<ShopServiceType> = useRecoilValue( states.shops );
    const [ shopID, setShopID ] = useRecoilState<ShopIDType>( states.shopSpecific );
    const [ shopInfo, setShopInfo ] = useState<ShopServiceType>();
    
    useEffect(() => {
        ( async () => {
            // 식당정보 조회 (전체 리스트에서 가져오고, 없으면 개별요청)
            const shop = preloaded_shops.filter( v => v.shopID === shopID )[0] || await getShopInfoByShopID( shopID );
            // state설정
            setShopInfo( shop );
        } )()
    }, [ shopID ]);

    return <div className="info-menu">
        <div className="discount-info"></div>
        <div className="shop-specifics">
            
        </div>
    </div>
}

export default InfoMenu;