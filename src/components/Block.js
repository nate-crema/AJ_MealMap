import { useEffect, useState } from "react";

// css
import "../css/Block.css";

function Block({ className, indexing, style, info, onClick }) {

    const [ css, setCss ] = useState({
        width: "auto",
        height: "auto"
    })

    return (
            <div className={"menu_block_cover" + (className ? ` ${className}`: "")} 
                style={{ ...css, ...style }}
            >
                { !info?.isOpen && <div className="block_unactive_cover">
                    <span>{ info?.isOpenMsg || "아직 개발자가 만들고 있어요.. 😭" }</span>
                </div> }
                <div className="menu_block" onClick={ (e) => {
                    if (onClick && info?.isOpen) onClick(e);
                } } style={!info?.isOpen ? { filter: "blur(20px)" } : {}}>
                    <p className="title" display-info={info.title}>{ info.displayTitle }</p>
                    <p className="subtext" display-info="description">{ info.displaySubtext }</p>
                    <img className="boxImage" src={ info.img } style={{ ...info.imgCss }} />
                </div>
            </div>
    )

}

export default Block;