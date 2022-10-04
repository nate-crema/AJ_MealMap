import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// interfaces

import { EventInfoType } from "@interfaces/service/service.data.types/Shop";
import EventBlock from "@molecule/[F]Blocks/EventBlock";

type EventBlockWrapProps = {
    className?: string,
    eventInfo?: EventInfoType
}

// components

const HEIGHT_PER_EVENT = 60;
const VERT_MARGIN_EVENT = 20;

const EventBlockWrap: React.FC<EventBlockWrapProps> = ({ className, eventInfo }) => {
    const events: Array<EventInfoType[0] & { index: number }> = useMemo( () => {
        const eIDs = Object.keys( eventInfo || {} );
        return Object.values( eventInfo || {} )
        .map( ( v, i ) => 
            ({ ...v, index: i, eventerId: eIDs[i] })
        )
    }, [ eventInfo ] );

    return !eventInfo ? <div className={ "event-infos-wrap" + (className ? ` ${ className }` : "") } style={{ height: 0 }}></div>
        :
        <div 
            className={ "event-infos-wrap" + (className ? ` ${ className }` : "") }
            style={{ height: `${ events.length * (HEIGHT_PER_EVENT + VERT_MARGIN_EVENT) - VERT_MARGIN_EVENT }px` }}
        >
            { events.map( shop_event => 
                <EventBlock eventInfo={ shop_event }/>
            ) }
        </div>
};

export default EventBlockWrap