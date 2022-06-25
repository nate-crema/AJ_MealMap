import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType } from "@interfaces/InfoSpecific";
import { ShopServiceType, ShopWorkDateListType } from "@interfaces/service/service.data.types/Shop";
import { ShopWorkDateFriday, ShopWorkDateMonday, ShopWorkDateSaturday, ShopWorkDateSunday, ShopWorkDateThursday, ShopWorkDateTuesday, ShopWorkDateWednesday, ShopWorkTimeDefaultServiceType } from "@constant/service/Shop";

// interfaces
type WorktimeInfoSpecificProps = {
    
}

// components
const WORK_DAYS = [ "일", "월", "화", "수", "목", "금", "토" ];
const WORK_DAYS_KEY: Array<ShopWorkDateListType> = [ ShopWorkDateSunday, ShopWorkDateMonday, ShopWorkDateTuesday, ShopWorkDateWednesday, ShopWorkDateThursday, ShopWorkDateFriday, ShopWorkDateSaturday ];

const WorktimeInfoSpecific: React.FC<WorktimeInfoSpecificProps> = ({}) => {

    const { workTime } = useRecoilValue<ShopServiceType>( states.shopSpecific );

    // 요일 선택기능
    const [ currentDay, setCurrentDay ] = useState<number>( new Date().getDay() );

    const dayBlockClickHandler = ( day: number ) => {
        setCurrentDay( day );
    }
    
    // 영업시간 표시기능
    const [ workTimeRenderList, setWorkTimeRenderList ] = useState<Array<{ type: number, style: { left: string, width: string, backgroundColor: string, opacity?: number } }>>([]);

    const addWorkTimeList = (from: ShopWorkTimeDefaultServiceType, to: ShopWorkTimeDefaultServiceType, backgroundColor: string) => {
        console.log("addWorkTimeList", from, to);
        const min_from = from[0] * 60 + from[1];
        const min_to = to[0] * 60 + to[1];
        
        if (min_from > min_to) return false;
        
        setWorkTimeRenderList(prev => ([ ...prev, {
            type: min_from >= (12 * 60) ? 1 : 0,
            style: {
                left: `${ ( min_from - ( 12 * 60 ) * ( min_from >= (12 * 60) ? 1 : 0 ) ) / ( 12 * 60 ) * 100 }%`,
                width: `${ ( min_to - min_from ) / ( 12 * 60 ) * 100 }%`,
                backgroundColor,
                opacity: 1
            }
        } ]));
        return true;
    }

    const clearWorkTimeRenderList = () => {
        setWorkTimeRenderList( prev => prev.map( v => ({ ...v, opacity: 0 }) ) );
        setTimeout(() => {
            setWorkTimeRenderList([]);
        }, 200);
    }

    useEffect(() => {
        clearWorkTimeRenderList();
        setTimeout(() => {
            if ( !workTime ) return;
            
            const { start_time: { [ WORK_DAYS_KEY[ currentDay ] ]: start_time_daymatch, Default: start_time_default }, end_time: { [ WORK_DAYS_KEY[ currentDay ] ]: end_time_daymatch, Default: end_time_default } } = workTime;
            const start_time = start_time_daymatch || start_time_default;
            const end_time = end_time_daymatch || end_time_default;
    
            const min_starttime = start_time[0] * 60 + start_time[1];
            const min_endtime = end_time[0] * 60 + end_time[1];
    
            if ( min_endtime < min_starttime ) {
                addWorkTimeList([0, 0], end_time, "var(--theme-color-C)"); // 새벽영업시간
                if ( min_starttime < (12 * 60) ) addWorkTimeList(start_time, [12, 0], "var(--theme-color-C)"); // 오전영업시간
                addWorkTimeList(min_starttime > (12 * 60) ? start_time : [12, 0], [24, 0], "var(--theme-color-C)"); // 오후영업시간
            } else {
                addWorkTimeList(start_time, min_endtime > (12 * 60) ? [12, 0] : end_time, "var(--theme-color-C)"); // 오전영업시간
                addWorkTimeList(min_starttime > (12 * 60) ? start_time : [12, 0], end_time, "var(--theme-color-C)"); // 오후영업시간
            }
        }, 200);
    }, [ workTime, currentDay ]);

    return ( workTime ) ?
    <div className="shop-specinfo-worktime">
        <div className="worktime-day-selector">
            { WORK_DAYS.map( (v, i) => 
                <div className="worktime-dayblock" key={ i } onClick={ () => dayBlockClickHandler(i) }>
                    <span style={{ color: (i === currentDay) ? "var(--theme-color-C)" : "lightgray" }}>{ v }</span>
                </div>
            ) }
        </div>
        <div className="worktime-display">
            <div className="worktime-dpbar worktime-am">
                {
                    workTimeRenderList.filter(v => v.type === 0).map( ({ style }) => <>
                        <div
                            className="worktime-data"
                            style={ style }
                        />
                    </> )
                }
            </div>
            <div className="worktime-dpbar worktime-pm">
                {
                    workTimeRenderList.filter(v => v.type === 1).map( ({ style }) => <>
                        <div
                            className="worktime-data"
                            style={ style }
                        />
                    </> )
                }
            </div>
        </div>
    </div>
    :
    <></>
};

export default WorktimeInfoSpecific