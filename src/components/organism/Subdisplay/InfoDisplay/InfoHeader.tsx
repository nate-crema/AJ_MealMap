import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay/InfoHeader.css';

// components

// interfaces
type InfoHeaderProps = {
    title: string,
    cat: string,
    worktime: [ string, string ]
}

const InfoHeader: React.FC<InfoHeaderProps> = ({ title, cat, worktime }) => {

    // time control
    const ONE_HOUR = 60 * 60;
    const ONE_HOUR_MS = 1000 * ONE_HOUR;
    const ONE_MINUTE = 60;
    const ONE_MINUTE_MS = 1000 * ONE_MINUTE;

    const createTimeObject = ( time: string ): Date => {
        const today = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            date: new Date().getDate()
        };
        
        return new Date( `${ today.year }-${ today.month }-${ today.date } ${ time }` );
    }

    const getRemainSecond = ( compare_time: Date ): number => Math.floor( ( compare_time.getTime() - new Date().getTime() ) / 1000 );

    const remain_time_text = useMemo( () => {

        const [ start_time_text, end_time_text ] = worktime;
        const padding_time_string: string = new Date().toTimeString().substring( 5 );
        const start_time: Date = createTimeObject( start_time_text + padding_time_string );
        const end_time: Date = createTimeObject( end_time_text + padding_time_string );

        if ( start_time.getTime() > end_time.getTime() ) end_time.setDate( end_time.getDate()+1 );

        const start_remain_second = getRemainSecond( start_time );
        const start_remain_minute = Math.floor( start_remain_second / ONE_MINUTE );
        const start_remain_hour = Math.floor( start_remain_second / ONE_HOUR );

        const end_remain_second = getRemainSecond( end_time );
        const end_remain_minute = Math.floor( end_remain_second / ONE_MINUTE );
        const end_remain_hour = Math.floor( end_remain_second / ONE_HOUR );

        const return_cases = {
            "START_IN_1HOUR": ( start_remain_second > 0 && start_remain_hour === 0 ),
            "CLOSE_IN_1HOUR": ( end_remain_second > 0 && end_remain_hour === 0 ),
        }

        if ( return_cases.START_IN_1HOUR ) return `영업시작 ${ start_remain_minute }분 전`;
        else if ( return_cases.CLOSE_IN_1HOUR ) return `영업종료 ${ end_remain_minute }분 전`;
        else return `영업중`;
        
    }, [ worktime ] );

    return <div className="info-block-header">
        <p className="shop-title">{ title }</p>
        <p className="shop-category">{ cat }</p>
        <p className="shop-time-remain">{ remain_time_text }</p>
    </div>
}

export default InfoHeader;