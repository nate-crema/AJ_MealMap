import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// api
import { getShop, getShopInfoByShopID, getShopList } from "@src/api/service";

// components
import ImageBlock from "@molecule/Shop/ImageBlock";

// interfaces
import { ShopAPIResult } from "@interfaces/api/service";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { ShopCompType } from "@interfaces/Shop/comp";

type ShopBlockProps = {
    id: ShopIDType
    mode: ShopCompType
    onClick?: ( info: ShopServiceType ) => void
}


const ShopBlock: React.FC<ShopBlockProps> = ({ id, mode, onClick }) => {

    // Shop info control
    const shops = useRecoilValue<Array<ShopServiceType>>( states.shops );
    const [ info, setInfo ] = useState<ShopServiceType | null>( null );

    useEffect(() => {
        ( async (): Promise<void> => {
            // 식당정보 조회 (전체 리스트에서 가져오고, 없으면 개별요청)
            const shop = shops.filter( v => v.shopID === id )[0] || await getShopInfoByShopID(id);
            // state설정
            setInfo( shop );
        } )();
    }, [ id ]);


    // Shop block click handler
    const navigate = useNavigate();

    const ShopBlockClickHandler = useCallback( () => {
        if ( onClick && info ) return onClick( info );
        displayShopSpecific();
    }, [ info ] );
    
    const displayShopSpecific = () => {
        navigate(`/Shop/${ id }`);
    }

    return ( info ) ?
        <div className="shop-block" onClick={ ShopBlockClickHandler } style={{
            height: ( mode === "review" ) ? "50px" : "180px"
        }}>
            {
                ( mode === "display" ) && <ImageBlock id={ id }/>
            }
            <div className="shop-text">
                <span className="shop-title">{ info.name }</span>
                {/* <span className="shop-duration">걸어서 { Math.floor( info.duration / 60 ) }분</span>
                <span className="shop-review">{ info.short_review || info.common_review }</span> */}
            </div>
        </div>
    : <></>
};

export default ShopBlock