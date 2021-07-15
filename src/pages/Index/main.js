
// components - etc
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Block from "../../components/Block";

import { constant } from "../../module/functions";


function Main({ changeMenuUI, onClick, init, history }) {

    const state = useSelector((state) => state);
    const { menuList, boxSize } = constant;

    let mainEXP = [];
    for (var i = 0; i < menuList.length; i++) mainEXP[i] = menuList[i];

    if (mainEXP[0].route == "/") {
        console.log(mainEXP)
        mainEXP.splice(0, 1);
        console.log(mainEXP);
        console.log(menuList);
    }

    
    const dispatch = useDispatch();
    const { menu: { menu } } = state;

    // useEffect(() => {
    //     console.log(`init: ${init[0]}`);
    //     if (menu != 0 && !init[0]) {
    //         console.log("initial setting run");
    //         init[1](true)
    //         dispatch({ type: "menu/SETMENU", v: 0 });
    //         changeMenuUI(menu, history ? history.push : window.location.href, state);
    //     }
    // }, []);

    return (
        <div className="contentWrap menuComp" id="menuRef" style={{ 
            opacity: (menu == 0) ? 1 : 0, 
            marginTop: (menu == 0) ? "0px" : "10px"
        }}>
            {mainEXP.map((v, i) => {
                return (
                    <Block
                        title={v.displayTitle}
                        subtext={v.displaySubtext}
                        color="#005BAE"
                        boxSize={boxSize}
                        style={{
                            gridArea: `block_${i+1}`,
                            cursor: (!v.clickUnavailable) && "pointer"
                        }}
                        img={v.img}
                        imgCss={v.imgCss && v.imgCss}
                        subTextCss={v.subTextCss && v.subTextCss}
                        menu={i+1}
                        changeMenuUI={(e) => ((!v.clickUnavailable) && changeMenuUI(i+1))}
                        onClick={ onClick || new function(){}}
                    />
                )
            })}
        </div>
    )
}

export default Main;