import { useState, useEffect, useRef, useMemo, MouseEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// interfaces

import { EventInfoType } from "@interfaces/service/service.data.types/Shop";

type EventBlockProps = {
    eventInfo: EventInfoType[0] & { index: number }
}

// components

const HEIGHT_PER_EVENT = 60;
const VERT_MARGIN_EVENT = 20;

const EventBlock: React.FC<EventBlockProps> = ({ eventInfo }) => {

    const eventBlockClickHandler = ( e: MouseEvent ) => {

    }

    return <div 
        key={ eventInfo.eventer }
        id={ eventInfo.eventer }
        className={ `event-info event-${ eventInfo.eventer }` }
        style={{
            top: !eventInfo.index ? "5px" : undefined,
            boxShadow: `0 0 5px ${ eventInfo.logo_color }`,
        }}
        onClick={ eventBlockClickHandler }
    >
        <div className="eventer-img-wrap">
            <img src={ eventInfo.logo_img }/>
        </div>
        <div className="event-content">
            <span className="event-content-text">{ eventInfo.content.text }</span>
        </div>
    </div>
};

export default EventBlock