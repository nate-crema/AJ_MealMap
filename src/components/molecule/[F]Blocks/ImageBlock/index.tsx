import { useState, useEffect, useRef, MouseEvent } from "react";

// css
import './style.css';
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";

// interfaces
type ImageBlockProps = {
    info: ShopServiceType
    className?: string,
    id?: ShopIDType,
    onClick?: ( e: MouseEvent ) => any
}

// components


const ImageBlock: React.FC<ImageBlockProps> = ({ info, className, id, onClick }) => {

    return <div
        className={ "shop-image" + ( className ? ` ${ className }` : "" ) }
        onClick={ onClick } 
        style={{
            cursor: onClick ? "pointer" : ""
        }}
    >
        { info && ( Object.values(info.imgs).length > 0 ) ? 
            Object.values(info.imgs).map( ( url: string, i: number, imgs: Array<string> ) => ( i <= 4 ) && <div style={
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
                    gridRowStart: Math.floor( i / 3 ) ? 2 : 1,
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
};

export default ImageBlock