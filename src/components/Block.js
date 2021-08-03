import { useEffect, useState } from "react";

// css
import "../css/Block.css";

function Block({ className, indexing, style, info, onClick }) {

    const [ css, setCss ] = useState({
        width: "auto",
        height: "auto"
    })

    return (
        <div className={"menu_block_cover" + (className ? ` ${className}`: "")} style={{ ...css, ...style }}
            onClick={ (e) => {
                if (onClick) onClick(e);
            } }
        >
            <div className="menu_block">
                <p className="title" display-info={info.title}>{ info.displayTitle }</p>
                <p className="subtext" display-info="description">{ info.displaySubtext }</p>
                <img className="boxImage" src={ info.img } style={{ ...info.imgCss }} />
            </div>
        </div>
    )

}

export default Block;