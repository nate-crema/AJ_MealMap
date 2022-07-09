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

    const addBtnClickHandler = () => {
        
    }

    return <div className="menu-block" style={ Object.assign({
        backgroundImage: img ? `url(${ img })` : ""
    } as CSSProperties, style) }>
        { (name === "[[ADD]]") ? <>
            <div className="menu-addbtn" onClick={ addBtnClickHandler }>
                <div className="icn-wrap">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                        <g>
                            <path style={{ fill: "var(--theme-color-C)" }} d="M491.93,262.65l-241.94-0.13c-4.46,0-8.06-3.61-8.06-8.07l0.13-246.03c0-4.46,3.61-8.06,8.07-8.06
                                s8.06,3.61,8.06,8.07l-0.13,237.97l233.87,0.13c4.46,0,8.06,3.61,8.06,8.07S496.39,262.65,491.93,262.65z"/>
                            <path style={{ fill: "var(--theme-color-C)" }} d="M210.63,262.5L8.06,262.39c-4.46,0-8.06-3.61-8.06-8.07c0-4.46,3.61-8.06,8.07-8.06l202.57,0.11
                                c4.46,0,8.06,3.61,8.06,8.07C218.7,258.89,215.09,262.5,210.63,262.5z"/>
                            <path style={{ fill: "var(--theme-color-C)" }} d="M249.86,500.36c-4.46,0-8.06-3.61-8.06-8.07l0.11-202.21c0-4.46,3.61-8.06,8.07-8.06s8.06,3.61,8.06,8.07
                                l-0.11,202.21C257.93,496.75,254.32,500.36,249.86,500.36z"/>
                        </g>
                    </svg>
                </div>
                <span>메뉴 추가</span>
            </div>
        </> : <>
            <div className="text-area">
                <span className="menu-name">{ name.length > 7 ? name.substring(0, 6) + "..." : name }</span>
                <span className="menu-price">{ price }원</span>
            </div>
        </> }
    </div>
};

export default MenuBlock