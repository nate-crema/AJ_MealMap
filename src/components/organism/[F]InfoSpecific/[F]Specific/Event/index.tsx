import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";

// interfaces
type EventInfoSpecificProps = {
    info: ShopServiceType
}

// components


const EventInfoSpecific: React.FC<EventInfoSpecificProps> = ({ info }) => {

    // const events = useMemo( () => info.events ? Object.keys(info.events).map( v => ({ ...(info.events || {})[v], key: v }) ) : [], [ info ] );
    
    useEffect(() => {
        console.log("event", info.events);
    }, [ info ]);

    const hyperlinkClickHandler = () => {
        window.open(`https://www.ajouchong.com/notice/partner?keyword=${ info.name }`);
    }

    return <div className="shop-specinfo-event">
        { !info.events ? <>
            <span className="event-notfound">등록된 할인행사가 없어요</span>
        </>: <div className="eventinfos-section">
            <div className="description">
                <p>{ `*)` } 이 정보는 아주대학교 총학생회 “담아”의 홈페이지를 웹 스크래핑 기술로 불러온 정보에요.</p>
                <p>{ `*)` } 정보는 주기적으로 갱신되지만, ‘아대밀맵’에 표시되는 할인정보는 실제 할인정보와 다를 수 있어요.</p>
                <p>{ `*)` } 자세한 사항은 아주대학교 총학생회 “담아” 홈페이지를 확인해주세요</p>
            </div>
            <div className="hyperlink-AJChong" onClick={ hyperlinkClickHandler } >
                <span>아주대학교 총학생회 “담아”로 이동</span>
            </div>
        </div> }
    </div>
};

export default EventInfoSpecific