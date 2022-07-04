import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType } from "@interfaces/InfoSpecific";
import { ShopServiceType, ShopWorkDateListType } from "@interfaces/service/service.data.types/Shop";
import {  WORK_DAYS, WORK_DAYS_KEY, ShopWorkTimeDefaultServiceType } from "@constant/service/Shop";
import SvgManager from "@assets/svg";
import InfoSpecificButton from "../InfoSpecificButton";

// interfaces
type WorktimeInfoSpecificProps = {
    
}

// components

const WorktimeInfoSpecific: React.FC<WorktimeInfoSpecificProps> = ({}) => {

    const { workTime } = useRecoilValue<ShopServiceType>( states.shopSpecific );

    // 요일 선택기능
    const [ currentDay, setCurrentDay ] = useState<number>( new Date().getDay() );

    const dayBlockClickHandler = ( day: number ) => {
        setCurrentDay( day );
    }
    
    // 영업시간 표시기능
    const [ workTimeRenderList, setWorkTimeRenderList ] = useState<Array<{ type: number, style: { left: string, width: string, backgroundColor: string, opacity?: number } }>>([]); // 바형 영업시간 표시용 렌더리스트
    const [ workTimeTextList, setWorkTimeTextList ] = useState<Array<{ type: number, text: string, min_val: number, bar_reverse: boolean, style: { left: string, opacity?: number, backgroundColor?: string, transform?: string } }>>([]); // 텍스트형 영업시간 표시용 렌더리스트

    const addWorkTimeRenderList = (from: ShopWorkTimeDefaultServiceType, to: ShopWorkTimeDefaultServiceType, backgroundColor: string, base?: Array<number>) => { // workTimeRenderList 추가
        const min_from = from[0] * 60 + from[1]; // 시작시간 분단위 환산
        const min_to = to[0] * 60 + to[1]; // 끝시간 분단위 환산
        
        if (min_from > min_to) return false; // 끝시간이 시작시간보다 앞서면 처리 중단
        
        const type = min_from >= (12 * 60) ? 1 : 0; // type: 오전 오후 구분 (오전: 0, 오후: 1)
        const styleOption = { // 기본 style 옵션
            left: `${ ( min_from - ( 12 * 60 ) * ( min_from >= (12 * 60) ? 1 : 0 ) ) / ( 12 * 60 ) * 100 }%`,
            width: `${ ( min_to - min_from ) / ( 12 * 60 ) * 100 }%`,
            backgroundColor,
            opacity: 1
        };
        const borderStyle: { [ key in string ]: any } = { // 타임바 borderRadius 설정
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0"
        };

        if (
            ( from[0] === 0 && from[1] === 0 ) ||
            ( from[0] === 12 && from[1] === 0 )
        ) {
            // 왼쪽에 타임바가 붙어있으면: 좌측과 우측상단 둥글게 처리
            borderStyle.borderTopLeftRadius = undefined;
            borderStyle.borderBottomLeftRadius = undefined;
            borderStyle.borderTopRightRadius = undefined;
        }

        if (
            (to[0] === 12 && to[1] === 0) ||
            (to[0] === 24 && to[1] === 0)
        ) {
            // 오른쪽에 타임바가 붙어있으면: 우측과 좌측상단 둥글게 처리
            borderStyle.borderTopRightRadius = undefined;
            borderStyle.borderBottomRightRadius = undefined;
            borderStyle.borderTopLeftRadius = undefined;
        }

        if (
            !(from[0] === 0 && from[1] === 0 ||
            to[0] === 12 && to[1] === 0 ||
            from[0] === 12 && from[1] === 0 ||
            to[0] === 24 && to[1] === 0)
        ) {
            // 어느곳에도 붙어있지 않으면: 위쪽만 둥글게 처리
            borderStyle.borderTopLeftRadius = undefined;
            borderStyle.borderTopRightRadius = undefined;
        }

        if ( base !== undefined ) base.forEach( v => {
            // base 인자를 입력받으면, 배열을 각각 돌며 인자 실행 (base: 출력할 텍스트의 시간유형; 0: 시작시간 | 1: 끝시간)
            const textbase_time = ( v === 0 ) ? from : to; // base 배열 원소값에 따라 시간정보 불러오기
            addWorkTimeText( // 텍스트 추가
                // type
                type,
                // 기반시간 (=출력할 시간)
                textbase_time,
                // 출력할 텍스트
                `${ textbase_time[0] === 12 ? "낮" : type === 0 ? "오전" : "오후" } ${ [ 12, 24 ].includes(textbase_time[0]) ? 12 : (textbase_time[0]%12) < 10 ? ('0' + (textbase_time[0]%12)) : (textbase_time[0]%12) }:${ textbase_time[1] < 10 ? ('0' + textbase_time[1]) : textbase_time[1] }`,
                // 텍스트 위치 계산 (시작시간이면 타임바와 같은 위치에서 시작, 끝시간이면 타임바의 오른쪽 끝 위치에서 시작)
                !v ? styleOption.left : `calc(${styleOption.left } + ${styleOption.width })`,
                // 배경색
                backgroundColor,
                // 텍스트 위치 기준점 계산 
                // ( 오전/오후 4시 전까지는 기준점을 왼쪽 끝으로 설정 (텍스트가 밀려나가는 것을 막기 위함) )
                // ( 오전/오후 4시 이후에는 기준점을 오른쪽 끝으로 설정 (텍스트가 표시선의 왼쪽에 위치하기 때문에, 기준점을 오른쪽으로 잡아야 실제 위치와 기준선이 맞음) )
                // ( 단, 오전은 막대바 두께로 인한 오차를 고려하여 2px 뒤로 기준점을 당김 (+-2가 적용된 이유) )
                ((textbase_time[0]%12) < 4 && ![12, 24].includes( textbase_time[0] )) ? 
                    type === 0 ?
                        "translate(-2px)" : "translate(0)"
                : v === 0 ? 
                    "translate(calc( -100% + 2px ))" : "",
                // 텍스트 위치 오른쪽정렬여부 (기준바보다 텍스트가 오른쪽에 위치하면 true)
                ((textbase_time[0]%12) < 4 && ![12, 24].includes( textbase_time[0] ))
            );
        });

        // list 업데이트
        setWorkTimeRenderList(prev => ([ ...prev, {
                type,
                style: Object.assign(
                    styleOption,
                    borderStyle
                )
        } ]));
        return true;
    }

    const clearWorkTimeRenderList = () => {
        setWorkTimeRenderList( prev => prev.map( v => ({ ...v, style: { ...v.style, width: "0", opacity: 0 } }) ) );
        clearWorkTimeText();
        setTimeout(() => {
            setWorkTimeRenderList([]);
        }, 200);
    }

    const addWorkTimeText = ( type: number, basetime: ShopWorkTimeDefaultServiceType, text: string, left: string, backgroundColor?: string, transform?: string, bar_reverse?: boolean ) => {
        setWorkTimeTextList( prev => ([ ...prev, { type, text,
            min_val: basetime[0] * 60 + basetime[1],
            bar_reverse: bar_reverse || false,
            style: {
                left, backgroundColor, transform
            }
        } ]) );
    }

    const clearWorkTimeText = () => {
        setWorkTimeTextList( prev => prev.map( v => ({ ...v, style: { ...v.style, opacity: 0 } }) ) );
        setTimeout(() => {
            setWorkTimeTextList([]);
        }, 200);
    }

    useEffect(() => {
        // 이전 타임바 및 텍스트 삭제
        clearWorkTimeRenderList();
        setTimeout(() => { // 0.2초 후 실행
            if ( !workTime ) return; // workTime이 없으면 종료
            
            const { start_time: { [ WORK_DAYS_KEY[ currentDay ] ]: start_time_daymatch, Default: start_time_default }, end_time: { [ WORK_DAYS_KEY[ currentDay ] ]: end_time_daymatch, Default: end_time_default } } = workTime;
            const start_time = start_time_daymatch || start_time_default; // 시작시간 설정
            const end_time = end_time_daymatch || end_time_default; // 끝시간 설정
    
            const min_starttime = start_time[0] * 60 + start_time[1]; // 시작시간 분단위 변환
            const min_endtime = end_time[0] * 60 + end_time[1]; // 끝시간 분단위 변환
    
            if ( min_endtime < min_starttime ) { // 끝시간이 시작시간보다 빠르면 (=새벽영업을 하는 업장이라면)
                addWorkTimeRenderList([0, 0], end_time, "var(--theme-color-A)", [ 1 ]); // 새벽영업시간 타임바 등록
                if ( min_starttime < (12 * 60) ) addWorkTimeRenderList(start_time, [12, 0], "var(--theme-color-C)", min_starttime < (12 * 60) ? [ 0 ] : undefined); // 오전영업시간 타임바 등록
                addWorkTimeRenderList(min_starttime > (12 * 60) ? start_time : [12, 0], [24, 0], "var(--theme-color-C)", min_starttime < (12 * 60) ? undefined : [ 0 ]); // 오후영업시간 타임바 등록
            } else {
                addWorkTimeRenderList(start_time, min_endtime > (12 * 60) ? [12, 0] : end_time, "var(--theme-color-C)", min_endtime > (12 * 60) ? [ 0 ] : [ 0, 1 ]); // 오전영업시간 타임바 등록
                if ( min_endtime > (12 * 60) ) addWorkTimeRenderList(min_starttime > (12 * 60) ? start_time : [12, 0], end_time, "var(--theme-color-C)", min_starttime > (12 * 60) ? [ 0, 1 ] : [ 1 ]); // 오후영업시간 타임바 등록
            }
        }, 200);
    }, [ workTime, currentDay ]); // workTime과 currentDay가 변할 때 마다 실행

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
            <div/>
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
            <div className="worktime-dptext worktime-am-text">
                {
                    workTimeTextList.filter( v => v.type === 0 ).map( ({ style, text, min_val, bar_reverse }, i, list) => <>
                        <div className="worktime-text_desc" style={{
                            ...style,
                            height: (
                                i%2 && 
                                min_val - list[i-1].min_val <= 180
                            ) ? "100%" : "50%",
                            backgroundColor: undefined,
                            zIndex: 100/(i+1)
                        }}>
                            <div className="worktime-extline" style={{
                                right: bar_reverse ? "unset" : undefined,
                                left: bar_reverse ? "0" : undefined,
                                backgroundColor: style.backgroundColor
                            }}/>
                            <span className="worktime-text" style={{
                                right: bar_reverse ? "unset" : undefined,
                                left: bar_reverse ? "10px" : undefined,
                            }}>{ text }</span>
                        </div>
                    </> )
                }
            </div>
            <div/>
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
            <div className="worktime-dptext worktime-pm-text">
                {
                    workTimeTextList.filter( v => v.type === 1 ).map( ({ style, text, min_val, bar_reverse }, i, list) => <>
                        <div className="worktime-text_desc" style={{
                            ...style,
                            height: (
                                i%2 && 
                                min_val - list[i-1].min_val <= 180
                            ) ? "100%" : "50%",
                            backgroundColor: undefined,
                            zIndex: 100/(i+1)
                        }}>
                            <div className="worktime-extline" style={{
                                right: bar_reverse ? "unset" : undefined,
                                left: bar_reverse ? "0" : undefined,
                                backgroundColor: style.backgroundColor
                            }}/>
                            <span className="worktime-text" style={{
                                right: bar_reverse ? "unset" : undefined,
                                left: bar_reverse ? "10px" : undefined,
                            }}>{ text }</span>
                        </div>
                    </> )
                }
            </div>
        </div>
        <div className="worktime-buttons">
            <InfoSpecificButton className="worktime-edit-btn" type="plus">영업시간이 이상해요</InfoSpecificButton>
        </div>
    </div>
    :
    <></>
};

export default WorktimeInfoSpecific