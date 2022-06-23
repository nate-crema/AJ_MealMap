
import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// api
import { getShopList } from "@api/service";

// components
import Shop from "../../organism/Shop";

// interfaces
import { ShopListAPIResult } from "@interfaces/api/service";
import { Location } from "@interfaces/service/recoil/State";
import { ShopCompDisplayType, ShopCompReview, ShopCompReviewType } from "@interfaces/Shop/comp";
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";

type ShopsProps = {
    mode: ShopCompReviewType
    onBlockClick?: ( info: string | null, index: number ) => void
} | {
    mode: ShopCompDisplayType
    onBlockClick?: ( info: ShopServiceType | null, index: number ) => void
}


const Shops: React.FC<ShopsProps> = ({ mode, onBlockClick }) => {

    // Shop list control
    const { lat, long } = useRecoilValue<Location>( states.location );
    const [ shops, setShops ] = useRecoilState<Array<ShopServiceType>>( states.shops );

    const getShopInfos = async (): Promise<Array<ShopServiceType>> => {
        const Shop_list: ShopListAPIResult = await getShopList( lat, long );
        if ( Shop_list.result === "FAILED" ) return [];
        return Shop_list.list;
    }

    useEffect(() => {
        ( async () => {
            // if ( lat < 0 || long < 0 ) return;
            const shop_list = await getShopInfos();
            console.log("shop_list", shop_list);
            setShops( shop_list );
        } )()
    }, [ lat, long ]);


    // Shop block click handler
    const ShopBlockClickHandler = ( info: ShopServiceType, index: number ) => {
        if ( !info || !onBlockClick ) return;
        if ( mode === ShopCompReview )
            return onBlockClick(
                info.shopID as ( string & ShopServiceType ),
                index
            );
        else
            return onBlockClick(
                info as ( string & ShopServiceType ),
                index
            );
    };
    
    return <div className={ `Shops-list listmode-${ mode }` }>
        {
            Object.values(shops).map( 
                ( shop, index: number ) => 
                    <Shop
                        key={ shop.shopID }
                        id={ shop.shopID }
                        mode={ mode }
                        onClick={ ( mode === "review" ) ? ( info: ShopServiceType ) => ShopBlockClickHandler( info, index ) : undefined }
                    />
            )
        }
        {
            (mode === "review") && <div className="shop-notfound shop-block"
                key={ "Shop_notfound" }
                onClick={ onBlockClick ? ( () => onBlockClick( null, -1 ) ) : undefined }
            >
                <span>찾는 식당이 없어요</span>
            </div>
        }
    </div>
};

export default Shops