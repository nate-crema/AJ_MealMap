import { useState, useEffect, useRef, CSSProperties, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopMenusType } from "@interfaces/service/service.data.types/Shop";

// interfaces
type MenuBlockProps = {
    menu: {
        name: string
    } & ShopMenusType[0],
    style?: CSSProperties
}

// components


const MenuBlock: React.FC<MenuBlockProps> = ({ menu, style }) => {
    
    const { name, price, img } = useMemo( () => menu, [ menu ]);

    return <div className="menu-block" style={ Object.assign({
        backgroundImage: img ? `url(${ img })` : ""
    } as CSSProperties, style) }>
        <div className="text-area">
            <span className="menu-name">{ name.length > 7 ? name.substring(0, 6) + "..." : name }</span>
            <span className="menu-price">{ price }원</span>
        </div>
    </div>
};

export default MenuBlock