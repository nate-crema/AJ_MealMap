import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import ServiceButton from "@atom/ServiceButton";
import WorktimeManager from "@molecule/WorktimeManager";
import InfoSpecificAddCommon, { StageAction } from "../common";

// constant
import { ShopWorkDateSunday, WORK_DAYS, WORK_DAYS_KEY } from "@constant/service/Shop";

// interfaces
import { ShopServiceType, ShopWorkDateListType, ShopWorkTimeType } from "@interfaces/service/service.data.types/Shop";
import { WorktimeManagerModeEdit } from "@interfaces/WorktimeManager";
import DateSelector from "@molecule/Selectors/DateSelector";
import { DateSelectorDisplayLanguageKorean } from "@molecule/Selectors/DateSelector/type";

type WorktimeInfoAddProps = {
    info: ShopServiceType
}

// components


const WorktimeInfoAdd: React.FC<WorktimeInfoAddProps> = ({ info }) => {

    const setOpenInfo = useSetRecoilState( states.infoSpecificOpenInfo );
    const setInfo = useSetRecoilState( states.shopSpecific );

    const workTime = useMemo( () => info.workTime, [ info ] );
    const setWorkTime = ( workTime: ShopWorkTimeType ) => setInfo( p => {
        if (p)
            p.workTime = workTime;
        return p;
    } )

    // 표시 텍스트 관련
    const [ title, setTitleText ] = useState<string>("");
    const [ titleActive, setTitleActive ] = useState<boolean>(true);
    const [ subtitle, setSubtitleText ] = useState<string>("");
    const [ subtitleActive, setSubtitleActive ] = useState<boolean>(true);
    const [ inputActive, setInputActive ] = useState<boolean>(true);

    const setTitle = ( val: string ) => {
        setTitleActive(false);
        setTimeout(() => {
            setTitleText( val );
            setTimeout(() => {
                setTitleActive(true);
            }, 150);
        }, 150);
    }

    const setSubtitle = ( val: string ) => {
        setSubtitleActive(false);
        setTimeout(() => {
            setSubtitleText( val );
            setTimeout(() => {
                setSubtitleActive(true);
            }, 150);
        }, 150);
    }

    useEffect(() => {
        setTitle(`영업시간 ${ workTime ? "수정" : "추가" }`);
        setSubtitle(`무슨 요일 영업시간을 ${ workTime ? "수정" : "추가" }할까요?`);
    }, [ workTime ]);

    // 입력값 관련
    const [ select_day, setSelectDay ] = useState<ShopWorkDateListType>();
    const [ inputmode, setInputMode ] = useState<"worktime" | "resttime">("worktime");


    const dayClickHandler = ( day: ShopWorkDateListType ) => {
        setSelectDay( day );
    }

    const inputModeClickHandler = ( selected_inputmode: "worktime" | "resttime" ) => {
        setInputMode( selected_inputmode );
    }

    // 현재 진행단계 관련
    const [ stage, setStage ] = useState<number>(0);

    const syncStage = async ( curr_stage: number ) => {
        setStage(curr_stage);
    }

    const stage0Handler = useCallback( async () => {
        if ( !select_day ) {
            alert("수정할 요일을 선택해주세요");
            return false;
        }
        setTitle("수정시간 입력");
        setSubtitle(`수정할 ${ WORK_DAYS[ WORK_DAYS_KEY.indexOf(select_day) ] || "공통" }요일 영업시간을 알려주세요`);
    }, [ select_day ] )

    const worktime_add_stagelist: Array<StageAction> = [
        { text: "영업시간 입력", size: 100, beforeAction: syncStage, afterAction: stage0Handler },
        { text: "입력완료", beforeAction: syncStage }
    ];

    return <InfoSpecificAddCommon stage_list={ worktime_add_stagelist }>
        <div className="shop-specinfo-worktime-add">
            <div className="title-wrap">
                <p className={ "add-title" + ( titleActive ? " text-active" : " text-deactive" )}>{ title }</p>
                <p className={ "add-subtitle" + ( subtitleActive ? " text-active" : " text-deactive" )}>{ subtitle }</p>
            </div>
            <div className="stage-wrap">
                {
                    ( stage === 0 ) ? <>
                        {/* 수정일자 선택 */}
                        <div className="stage-0">
                            <div className="workday-selector">
                                { WORK_DAYS_KEY.map(( v, i ) => <span className={ "workday-text" + ( select_day === v ? " selected_day" : "" ) } onClick={ () => dayClickHandler( v ) }>{ WORK_DAYS[i] }</span>) }
                            </div>
                            <ServiceButton className="workday-common-selector" theme={ select_day === "Default" ? "main-selection" : "sub-selection" } text="기본 영업시간" style={{ fontSize: "16px" }} onClick={ () => dayClickHandler( "Default" ) }/>
                        </div>
                    </>:
                    ( stage === 1 ) ? <>
                        {/* 영업시간 선택 */}
                        <div className="stage-1">
                            <div className="worktime-type">
                                <span className="time-format">시간유형</span>
                                <div className="worktime-splitbar"/>
                                <div className="worktime-inputselection-wrap">
                                    <div className="worktime-inputselection input-selection-worktime" onClick={ () => inputModeClickHandler( "worktime" ) }>
                                        <div className="color-palete"/>
                                        <span className={ inputmode === "worktime" ? " selected-mode" : "" }>영업시간</span>
                                    </div>
                                    <div className="worktime-inputselection input-selection-resttime" onClick={ () => inputModeClickHandler( "resttime" ) }>
                                        <div className="color-palete"/>
                                        <span className={ inputmode === "resttime" ? " selected-mode" : "" }>휴식시간</span>
                                    </div>
                                </div>
                            </div>
                            <div className="worktime-input">
                            <DateSelector
                                inputValue={[ "date", "am/pm" ]}
                                onValueSucceed={ (v: any) => console.log(v) }
                                className="time-selector"
                                lang={ DateSelectorDisplayLanguageKorean }
                            />
                            </div>
                        </div>
                    </>:
                    ( stage === 2 ) ? <></>:
                    <></>
                }
            </div>
        </div>
    </InfoSpecificAddCommon>
};

export default WorktimeInfoAdd