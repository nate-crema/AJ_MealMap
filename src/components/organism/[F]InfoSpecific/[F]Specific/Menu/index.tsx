import { useState, useEffect, useRef, useMemo } from "react";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import MenuBlock from "@molecule/[F]Blocks/MenuBlock";

// interfaces
type menuInfoSpecificProps = {
    info: ShopServiceType
}

// components


const MenuInfoSpecific: React.FC<menuInfoSpecificProps> = ({ info }) => {

    const menus = useMemo( () => Object.keys( info.menus ).map( menu => ({
        name: menu,
        ...info.menus[ menu ]
    }) ).concat([ { name: "[[ADD]]", price: 0, is_limit: false, reviews: [] } ]), [ info ] );

    useEffect(() => {
        console.log( "menu", info.menus );
    }, []);

    return <div className="shop-specinfo-menus">
        <div className="specinfo-titler">
            <span className="specinfo-title">메뉴</span>
        </div>
        <div className="menublocks">
            {                
                menus.map( (menu, i) => <>
                    <MenuBlock menu={ menu } style={{ marginLeft: i%2 ? "14px" : "7px" }}/>
                </> )
            }
        </div>
    </div>
};

export default MenuInfoSpecific