import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// api
import { getShop, getShopList } from "@src/api/service";

// components


// interfaces
import { ShopAPIResult } from "@interfaces/api/service";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { ShopCompType } from "@interfaces/Shop/comp";


type ShopProps = {
    id: ShopIDType
    mode: ShopCompType
    onClick?: ( info: ShopServiceType ) => void
}


const Shop: React.FC<ShopProps> = ({ id, mode, onClick }) => {

    // Shop info control
    const shops = useRecoilValue<Array<ShopServiceType>>( states.shops );
    const [ info, setInfo ] = useState<ShopServiceType | null>( null );

    const getShopInfo = async (): Promise<ShopServiceType | null> => {
        const Shop: ShopAPIResult = await getShop( id );
        if ( Shop.result === "FAILED" ) return null;
        return Shop.data;
    }

    useEffect(() => {
        ( async (): Promise<void> => {
            // 식당정보 조회 (전체 리스트에서 가져오고, 없으면 개별요청)
            const shop = shops.filter( v => v.shopID === id )[0] || await getShopInfo();
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
                ( mode === "display" ) && <>
                    <div className="shop-image">
                        { ( Object.values(info.imgs).length > 0 ) ? Object.values(info.imgs).map( ( url: string, i: number, imgs: Array<string> ) => ( i <= 4 ) && <div style={
                            Object.assign(
                                [ 0, 1 ].includes( imgs.length ) ? {
                                    gridColumnStart: 1,
                                    gridColumnEnd: 5,
                                    gridRowStart: 1,
                                    gridRowEnd: 3
                                } :
                                [ 2 ].includes( imgs.length ) ? {
                                    gridColumnStart: i * 2 + 1,
                                    gridColumnEnd: i * 2 + 3,
                                    gridRowStart: 1,
                                    gridRowEnd: 3
                                } :
                                [ 3 ].includes( imgs.length ) ? {
                                    gridColumnStart: Math.floor( ( i + 1 ) / 2 ) * 2 + 1,
                                    gridColumnEnd: Math.floor( ( i + 1 ) / 2 ) * 2 + 3,
                                    gridRowStart: i || 1,
                                    gridRowEnd: ( ( i + 1 ) % 2 ) + 2
                                } :
                                [ 4 ].includes( imgs.length ) ? {
                                    gridColumnStart: ( !i ) ? 1 : ( i % 2 ) ? 3 : 4,
                                    gridColumnEnd: ( !i ) ? 3 : Math.floor( i / 3 ) ? 5 : ( i + 3 ),
                                    gridRowStart: Math.floor( i / 3 ) ? 1 : 2,
                                    gridRowEnd: i % 3 ? 2 : 3
                                } :
                                {
                                    gridColumnStart: ( !i ) ? 1 : ( i % 2 ) ? 3 : 4,
                                    gridColumnEnd: ( !i ) ? 3 : ( i % 2 ) ? 4 : 5,
                                    gridRowStart: Math.floor( i / 3 ) + 1,
                                    gridRowEnd: ( !i ) ? 3 : Math.floor( ( i - 1 ) / 2 ) + 1
                                }
                            , { backgroundImage: `url(${ url })`, backgroundPosition: "center" })
                        } key={ i }/> ) : "" }
                    </div>
                </>
            }
            <div className="shop-text">
                <span className="shop-title">{ info.name }</span>
                {/* <span className="shop-duration">걸어서 { Math.floor( info.duration / 60 ) }분</span>
                <span className="shop-review">{ info.short_review || info.common_review }</span> */}
            </div>
        </div>
    : <></>
};

export default Shop