import "../css/Index.css";
import { useState, useEffect, useRef } from "react";
import { Route, Link, Switch } from "react-router-dom";

// img
import bI_1 from "../assets/img/blockImg1.png";
import bI_2 from "../assets/img/blockImg2.png";
import bI_3 from "../assets/img/blockImg3.png";
import bI_4 from "../assets/img/blockImg4.png";
import bI_5 from "../assets/img/blockImg5.png";
import bI_6 from "../assets/img/blockImg6.png";


// compoennts - fnc for menu

import filter from "../components/filter";

// components - etc
import Logo from "../components/Logo";
import Block from "../components/Block";

function Index() {

    // level controller
    const [ menu, setMenu ] = useState(0);
    const [ title, setTitle ] = useState("");
    const menuRef = useRef();
    const titlerRef = useRef();

    const blocks = [
        {
            title: "#지도",
            subtext: `???: 니들이 밥집을 알아?\n동기와 선배들이 정리한\n아대 밥좌표`,
            img: bI_1,
            subTextCss: { fontSize: "14px" },
            imgCss: {
                width: "180px",
                height: "auto",
                position: "absolute",
                bottom: "20px",
                right: "20px"
            }
        },
        {
            title: "#알지? 나와",
            subtext: `밥먹자는데, 과연 밥만 먹을까?\n주변 술집정도는 상.식.`,
            img: bI_2,
            subTextCss: { fontSize: "12px" },
        },
        {
            title: "#편ㄱ?",
            subtext: `자취생에게\n편의점은 필수지`,
            img: bI_3,
            subTextCss: { fontSize: "14px" },
        },
        {
            title: "#ㅁㄴㅇㄹ",
            subtext: `뭐먹지?\n뇌빼고 룰렛 한판`,
            img: bI_4
        },
        {
            title: "#그_뭐더라",
            subtext: `검색.\nprint(결과)`,
            img: bI_5,
            clickUnavailable: true
        },
        {
            title: "#이거? 광고야 >_<",
            subtext: `서버 운영비인데..\nAdBlock은 좀..풀어줘`,
            img: bI_6,
            subTextCss: { fontSize: "14px" },
            clickUnavailable: true
        },
    ]

    const boxSize = {
      Mobile: ["100%", "250px"],
      cvtPoint: [0, 1000], // width: 600
      // default: [400, 300, "px"],
      default: ["auto", "auto"]
  }

    // active titler

    const setTitler = (text, setDisplayStat) => {
        // disable display

        if( titlerRef.current.style.display != "none") {
            titlerRef.current.style.top = ((titlerRef.current.style.top.split("px")[0]*1) - 10) + "px";
            titlerRef.current.style.opacity = "0";
        }
        
        setTimeout(() => {
            
            // change text
            setTitle(text);
        
            if (setDisplayStat == true) {
                // able display
                titlerRef.current.style.display = "unset";
                setTimeout(() => {
                    titlerRef.current.style.top = ((titlerRef.current.style.top.split("px")[0]*1) + 10) + "px";
                    titlerRef.current.style.opacity = "1";
                }, 200);
            } else titlerRef.current.style.display = "none";
        }, 200);
    }

    // change menu

    const changeMenu = (e, pos) => {

        if (pos != undefined) {
            // close menus
            menuRef.current.style.opacity = 0;
            menuRef.current.style.marginTop = "10px";
            setTimeout(() => menuRef.current.style.display = "none", 100);

            // moveLogo
            document.querySelector("div.logoMain").style.left = "200px";
            setTimeout(() => {
                document.querySelector("div.logoMain").style.top = "250px";
            }, 300);

            // set subTitle
            // console.log(pos, blocks[pos]);
            setTitler(blocks[pos].title, true);
            // setTitle();
            // document.querySelector("p.titler").style.display = "unset";
        } else {
            // open menus
            menuRef.current.style.display = "unset"
            setTimeout(() => {
                menuRef.current.style.opacity = 1;
                menuRef.current.style.marginTop = "0";
            }, 100);

            // moveLogo
            document.querySelector("div.logoMain").style.top = null;
            setTimeout(() => {
                document.querySelector("div.logoMain").style.left = null;
            }, 300);

            setTitler("", false);
        }

        // setMenu
        setMenu((pos != undefined) ? pos+1 : 0);
        console.log(`pos: ${pos} | menu: ${(pos != undefined) ? pos+1 : 0}`);
    }
    


    return (
        <>
            <div className="wrapper">
                <div className="logoSpace">
                    <Logo className="logoMain" onClick={changeMenu} style={{
                        cursor: menu == 0 ? "default" : "pointer"
                    }}></Logo>
                    <p className="titler" ref={titlerRef} style={{ top: "250px" }}>{title}</p>
                </div>
                <div className="serviceSpace" ref={menuRef} style={{ opacity: 1, marginTop: 0 }}>
                    <div className="contentWrap">
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
                                    changeMenu={(e) => ((!v.clickUnavailable) && changeMenu(e, i))}
                                >
                                </Block>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index;