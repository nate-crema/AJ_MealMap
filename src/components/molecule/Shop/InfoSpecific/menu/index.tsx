import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import MenuBlock from "./MenuBlock";

// interfaces
type menuInfoSpecificProps = {}

// components


const MenuInfoSpecific: React.FC<menuInfoSpecificProps> = () => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );
    const menus = useMemo( () => Object.keys( info.menus ).map( menu => ({
        name: menu,
        ...info.menus[ menu ]
    }) ), [ info ] );

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