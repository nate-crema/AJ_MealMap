import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType } from "@template/InfoSpecific/type";
import { ShopServiceType, ShopWorkDateListType } from "@interfaces/service/service.data.types/Shop";
import {  WORK_DAYS, WORK_DAYS_KEY, ShopWorkTimeDefaultServiceType } from "@constant/service/Shop";
import SvgManager from "@assets/svg";
import InfoSpecAddButton from "@molecule/[F]Buttons/InfoSpecAddButton";
import WorktimeBlock from "@molecule/[F]Blocks/WorktimeBlock";
import { WorktimeBlockModeDisplay } from "@molecule/[F]Blocks/WorktimeBlock/types";

// interfaces
type WorktimeInfoSpecificProps = {
    info: ShopServiceType
}

// components

const WorktimeInfoSpecific: React.FC<WorktimeInfoSpecificProps> = ({ info }) => {

    const workTime = useMemo( () => info.workTime, [ info ] );

    // 요일 선택기능
    const [ currentDay, setCurrentDay ] = useState<number>( new Date().getDay() );

    const dayBlockClickHandler = ( day: number ) => {
        setCurrentDay( day );
    }

    return <div className="shop-specinfo-worktime">
        { ( workTime ) ? <>
                <div className="worktime-day-selector">
                    { WORK_DAYS.map( (v, i) => 
                        <div className="worktime-dayblock" key={ i } onClick={ () => dayBlockClickHandler(i) }>
                            <span style={{ color: (i === currentDay) ? "var(--theme-color-C)" : "lightgray" }}>{ v }</span>
                        </div>
                    ) }
                </div>
                <WorktimeBlock
                    mode={ WorktimeBlockModeDisplay }
                    currentDay={ currentDay }
                    workTime={ workTime }
                />
            </>
            :
            <div className="info-notexist">
                <span>아직 등록된 정보가 없어요</span>
            </div>
            
        }
        <div className="worktime-buttons">
            <InfoSpecAddButton className="worktime-edit-btn" type={ workTime ? "edit" : "plus" } specinfo_type="WORKTIME">영업시간 { workTime ? "수정" : "추가" }하기</InfoSpecAddButton>
        </div>
    </div>
};

export default WorktimeInfoSpecific