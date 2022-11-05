
import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// api
import { getShopList, getShopListByCoordinate } from "@api/service";

// components
import ShopBlock from "@molecule/[F]Blocks/ShopBlock";

// interfaces
import { Location } from "@recoil/types";
import { ShopCompDisplayType, ShopCompReview, ShopCompReviewType } from "@interfaces/Shop/comp";
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";

type ShopsListProps = ({
    mode: ShopCompReviewType
    onBlockClick?: ( info: string | null, index: number ) => void
} | {
    mode: ShopCompDisplayType
    onBlockClick?: ( info: ShopServiceType | null, index: number ) => void
}) & {
    className?: string
}


const ShopList: React.FC<ShopsListProps> = ({ mode, onBlockClick, className }) => {

    // Shop list control
    const { lat, long } = useRecoilValue<Location>( states.location );
    const [ shops, setShops ] = useRecoilState<Array<ShopServiceType>>( states.shops );

    useEffect(() => {
        ( async () => {
            // if ( lat < 0 || long < 0 ) return;
            const shop_list = await getShopListByCoordinate({ lat, long });
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
    
    return <div className={ `shops-list listmode-${ mode } ${ className || "" }` }>
        <div className="list-fader top-fader"/>
        <div className="list-content-wrap">
            {
                Object.values(shops).map( 
                    ( shop, index: number ) => 
                        <ShopBlock
                            key={ shop.shopID }
                            id={ shop.shopID }
                            mode={ mode }
                            onClick={ ( mode === "review" ) ? ( info: ShopServiceType ) => ShopBlockClickHandler( info, index ) : undefined }
                        />
                )
            }
        </div>

        <div className="list-fader bottom-fader"/>
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

export default ShopList