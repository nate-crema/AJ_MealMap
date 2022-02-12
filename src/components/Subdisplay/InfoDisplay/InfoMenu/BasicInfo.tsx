import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay/InfoMenu/BasicInfo.css';

// img
import phoneIcn from '@assets/Phone@2x.png';
import markerIcn from '@assets/MarkerIcn@2x.png';

// components


// interfaces
import { RestaurantInfo } from "@interfaces/Restaurant";

type BasicInfoProps = {
    contact: string,
    duration: string
}  


const BasicInfo: React.FC<BasicInfoProps> = ({ contact, duration }) => {

    const menu_contents = [
        { icn: phoneIcn, value: contact, onClick: () => window.location.href = `tel:${ contact }` },
        { icn: markerIcn, value: duration || "소요시간 계산중" }
    ]

    return <>
    {
        menu_contents.map( content => <div 
            className="menu-content" 
            onClick={ content?.onClick } 
            style={{ cursor: ( content?.onClick ) ? "pointer" : undefined }}
        >
            <div className="content-icn-wrap">
                <img className="content-icn" src={ content.icn } />
            </div>
            <span className="content-value">{ content.value }</span>
        </div> )
    }
    </>
}

export default BasicInfo