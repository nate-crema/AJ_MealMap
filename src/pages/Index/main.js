
// components - etc
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Block from "../../components/Block";

import { initMenu, changeMenuUI, setTitler, getNowInfo, loadList } from "../../module/functions";


function Main({ changeMenuUI, onClick, init, history }) {

    const state = useSelector((state) => state);
    
    const dispatch = useDispatch();
    const { def: { blocks, boxSize, size, prev }, menu: { menu } } = state;

    useEffect(() => {
        console.log(`init: ${init[0]}`);
        if (menu != 0 && !init[0]) {
            console.log("initial setting run");
            init[1](true)
            dispatch({ type: "menu/SETMENU", v: 0 });
            changeMenuUI(menu, history ? history.push : window.location.href, state);
        }
    }, []);

    return (
        <div className="contentWrap menuComp" id="menuRef" style={{ 
            opacity: (menu == 0) ? 1 : 0, 
            marginTop: (menu == 0) ? "0px" : "10px"
        }}>
            {blocks.map((v, i) => {
                return (
                    <Block
                        title={v.title}
                        subtext={v.subtext}
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
                    >
                    </Block>
                )
            })}
        </div>
    )
}

export default Main;