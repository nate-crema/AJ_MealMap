import { useState, useEffect, useRef, CSSProperties, useMemo } from "react";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType } from "@interfaces/InfoSpecific";
import { WORK_DAYS, WORK_DAYS_KEY } from "@constant/service/Shop";

// interfaces
type ShopBriefProps = {
    className?: string
    style?: CSSProperties
}

// components

const ShopSpecific: React.FC<ShopBriefProps> = ({ className, style }) => {
    
    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );
    const setInfoSpecific = useSetRecoilState<InfoSpecificOpenInfoType>( states.infoSpecificOpenInfo );

    // 상점위치: 소요시간정보 가져오기
    // const 

    // 상세정보 클릭이벤트 핸들링
    const openInfoSpecific = ( info: InfoSpecificOpenInfoType ) => {
        setInfoSpecific( info );
    }

    // 메뉴: 텍스트 순회기능 구현
    const [ menu_text, setMenuText ] = useState<string>( Object.keys(info.menus)[0] || "정보수집중" );
    const menu_text_index = useRef<number>( 1 );
    const menu_text_intervalId = useRef<any>();
    const [ isMenutextChanging, setIsMenutextChanging ] = useState<boolean>( false );
    
    useEffect(() => {
        clearInterval( menu_text_intervalId.current );

        const { menus } = info;
        if (!menus || Object.keys( menus ).length === 0) {
            setMenuText("메뉴정보없음")
            return;
        } else setMenuText("정보수집중...");

        menu_text_intervalId.current = setInterval(() => {
            setIsMenutextChanging(true);
            setTimeout(() => {
                setMenuText( Object.keys(info.menus)[ (menu_text_index.current++) % Object.keys(info.menus).length ] );
                setTimeout(() => {
                    setIsMenutextChanging(false);
                }, 200);
            }, 200);
        }, 3000);
    }, [ info ]);

    // 영업시간: 현재 영업여부 표시기능 구현
    const [ isWorking, setIsWorking ] = useState<string>("시간정보없음");
    useEffect(() => {
        if ( !info.workTime ) { // 영업시간정보 없을 경우 중지
            setIsWorking("시간정보없음");
            return; 
        }

        const now_min = new Date().getHours() * 60 + new Date().getMinutes();

        const today_index = new Date().getDay();
        const today = WORK_DAYS_KEY[ today_index ];
        const yesterday = WORK_DAYS_KEY[ ( today_index + 6 ) % 7 ];
        
        const worktime_today = {
            start: info.workTime.start_time[ today ] || info.workTime.start_time.Default,
            end: info.workTime.end_time[ today ] || info.workTime.end_time.Default,
            resttime: info.workTime.rest_time ? info.workTime.rest_time[ today ] || [] : []
        };
        const worktime_today_min = {
            start: worktime_today.start[0] * 60 + worktime_today.start[1],
            end: worktime_today.end[0] * 60 + worktime_today.end[1],
            resttime: worktime_today.resttime.map( v => ([ v[0][0] * 60 + v[0][1], v[1][0] * 60 + v[1][1] ]) ),
            resttime_calc: ( curr_min: number ): boolean => {
                // 입력받은 분단위 현재시간이 휴게시간에 해당하는지 계산
                // 자정이 넘어 날짜가 변경되는 경우는 고려되지 않음
                let isNowRestime = false;
                worktime_today.resttime.forEach(v => {
                    const resttime_min = [ v[0][0] * 60 + v[0][1], v[1][0] * 60 + v[1][1] ];
                    if ( curr_min >= resttime_min[0] && curr_min <= resttime_min[1] ) isNowRestime = true;
                });
                return isNowRestime;
            }
        }

        const worktime_yesterday = {
            start: info.workTime.start_time[ yesterday ] || info.workTime.start_time.Default,
            end: info.workTime.end_time[ yesterday ] || info.workTime.end_time.Default,
            resttime: info.workTime.rest_time ? info.workTime.rest_time[ yesterday ] || [] : []
        };
        const worktime_yesterday_min = {
            start: worktime_yesterday.start[0] + worktime_yesterday.start[1],
            end: worktime_yesterday.end[0] + worktime_yesterday.end[1],
            resttime: worktime_today.resttime.map( v => ([ v[0][0] * 60 + v[0][1], v[1][0] * 60 + v[1][1] ]) ),
            resttime_calc: ( curr_min: number ): boolean => {
                // 입력받은 분단위 현재시간이 휴게시간에 해당하는지 계산
                // 자정이 넘어 날짜가 변경되는 경우는 고려되지 않음
                let isNowRestime = false;
                worktime_yesterday.resttime.forEach(v => {
                    const resttime_min = [ v[0][0] * 60 + v[0][1], v[1][0] * 60 + v[1][1] ];
                    if ( curr_min >= resttime_min[0] && curr_min <= resttime_min[1] ) isNowRestime = true;
                });
                return isNowRestime;
            }
        }
        const didTodayDawntimeWorked = worktime_today_min.start > worktime_today_min.end;
        const didYesterdayDawntimeWorked = worktime_yesterday_min.start > worktime_yesterday_min.end;

        // console.log( "didTodayDawntimeWorked", didTodayDawntimeWorked );
        // console.log( "didYesterdayDawntimeWorked", didYesterdayDawntimeWorked );

        // console.log( "now_min", now_min );
        // console.log( "worktime_today_min", worktime_today_min );

        if (
            // 오늘 영업시간에 해당하는 경우
            (
                ( didTodayDawntimeWorked ) ?  // 오늘 야간영업을 하는 요일이라면
                ( worktime_today_min.start <= now_min && now_min <= 24 * 60 ) : // 시작시간에서 24시 전까지 사이에 해당하는지 확인
                ( worktime_today_min.start <= now_min && now_min <= worktime_today_min.end ) // 아니면 시작시간에서 종료시간 사이에 해당하는지 확인
            )
            // 또는
            ||
            // 어제 영업시간에 새벽영업이 포함되고, 오늘 아직 어제의 새벽영업시간에 해당하는 경우
            ( didYesterdayDawntimeWorked && ( now_min <= worktime_yesterday_min.end ) )
        ) {
            // = 아직 영업중

            const resttime_start_base = // 이후 계산에 이용될 휴게 기준시간
                worktime_today_min.resttime.find( v => v[0] >= now_min );

            const endtime_base = // 이후 계산에 이용될 영업종료 기준시간
                ( didYesterdayDawntimeWorked && ( now_min <= worktime_yesterday_min.end ) ) ?
                worktime_yesterday_min.end :
                    ( didTodayDawntimeWorked ) ?
                    (24 * 60) + worktime_today_min.end :
                    worktime_today_min.end;

            const closesttime_base = (resttime_start_base ? Math.min( resttime_start_base[0], endtime_base ) : endtime_base);

            const remain_worktime = // 이후 계산에 이용될 영업잔여시간 (분단위)
                closesttime_base - now_min;

            // 휴게가 30분보다 적게 남았다면 휴게시작 잔여시간 표시
            if ( 
                resttime_start_base && closesttime_base === resttime_start_base[0] 
                && remain_worktime <= 30 
            ) setIsWorking( `휴식시작 ${ remain_worktime }분 전` );
            // 영업종료가 30분보다 적게 남았다면 영업종료잔여시간 표시
            else if ( 
                closesttime_base === endtime_base 
                && remain_worktime <= 30
            ) setIsWorking( `영업종료 ${ remain_worktime }분 전` );
            else setIsWorking( `영업중 [${ WORK_DAYS[ today_index ] }요일, ${ now_min >= (12 * 60) ? "오후" : "오전" }]` )
        } else if ( worktime_today_min.resttime_calc( now_min ) ) {
            // = 휴게시간

            const resttime_end_base = // 이후 계산에 이용될 휴게 기준시간
                worktime_today_min.resttime.find( v => v[1] >= now_min );

            if ( !resttime_end_base ) return; // resttime_calc 오류 => 함수 중단

            const remain_resttime = // 이후 계산에 이용될 영업잔여시간 (분단위)
                resttime_end_base[1] - now_min;

                // 휴게가 30분보다 적게 남았다면 휴게종료 잔여시간 표시
            if ( remain_resttime <= 30 ) setIsWorking( `휴식종료 ${ remain_resttime }분 전` );
            else setIsWorking("휴식시간");
        } else {
            // = 영업 종료됨 or 아직 시작하지 않음

            const starttime_base = // 이후 계산에 이용될 영업시작 기준시간
                worktime_today_min.start;

            const remain_worktime = now_min - starttime_base;

            // 영업시작이 30분보다 적게 남았다면 영업시작잔여시간 표시
            if ( remain_worktime <= 30 ) setIsWorking(`영업시작 ${ remain_worktime }분 전`);
            else setIsWorking(`영업종료 [${ WORK_DAYS[ today_index ] }요일, ${ now_min >= (12 * 60) ? "오후" : "오전" }]`);
        }
        
    }, [ info ]);

    useEffect(() => console.log( "shopSpecific", info ), [ info ]);

    return <div 
        className={"shop-specifics" + ( className ? ` ${ className }` : "" )}
        style={ style }
    >
        <div className="shop-specblock specblock-location">
            <div className="icn-wrap">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                    <g>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M250.34,500c-5.82,0-11.06-3.22-13.69-8.4L101.42,225.3c-27.89-54.98-20.43-121.66,18.56-166
                            c32.96-37.48,80.48-58.98,130.36-58.98s97.4,21.5,130.36,58.98c38.99,44.33,46.45,111.02,18.56,166L264.02,491.6
                            C261.41,496.78,256.17,500,250.34,500z M257.76,480.84l0.01,0.02c0,0.02,0.01,0.02,0.01,0.02
                            C257.78,480.86,257.76,480.86,257.76,480.84z M242.9,480.86l-0.01,0.02L242.9,480.86z M250.34,24.02
                            c-43.07,0-84.11,18.56-112.57,50.93c-32.65,37.11-38.77,93.23-15.23,139.62l127.79,251.66l127.79-251.66
                            c23.54-46.39,17.42-102.5-15.23-139.62C334.45,42.57,293.41,24.02,250.34,24.02z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M250.34,211.44c-36.51,0-66.21-29.71-66.21-66.22s29.7-66.2,66.21-66.2s66.21,29.69,66.21,66.2
                            S286.85,211.44,250.34,211.44z M250.34,102.71c-23.44,0-42.52,19.07-42.52,42.51s19.08,42.53,42.52,42.53s42.52-19.09,42.52-42.53
                            S273.78,102.71,250.34,102.71z"/>
                    </g>
                </svg>
            </div>
            <div className="content-wrap">
                <span className="info-content">{ info.loc.duration || "통계정보 수집중" }</span>
            </div>
            <div className="content-specific-hyperlink">
                <span className="spec-hyper" onClick={ () => openInfoSpecific("LOCATION") }>지도에서 보기</span>
            </div>
        </div>
        <div className="shop-specblock specblock-menu">
            <div className="icn-wrap">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 500 500">
                <path style={{ fill: "var(--theme-color-C)" }} d="M25.4,458c-5.54,0-10.93-2.12-15.39-6.09c-6.55-5.86-10.3-14.9-10.3-24.79V96.81
                    c0-16.05,10.02-29.26,23.28-30.76l196.03-21.92c19.8-2.2,39.89-2.2,59.75,0l196.03,21.92c13.27,1.49,23.28,14.71,23.28,30.76v190.63
                    c0,4.44-3.6,8.04-8.04,8.04s-8.04-3.6-8.04-8.04V96.81c0-8.51-4.66-14.29-9-14.77L276.99,60.12c-18.67-2.09-37.57-2.09-56.17,0
                    L24.79,82.03c-4.96,0.55-9,7.17-9,14.77v330.31c0,5.24,1.85,10.03,4.95,12.81c1.7,1.51,3.58,2.17,5.31,1.96l192.98-21.59
                    c19.8-2.2,39.89-2.2,59.75,0l75.17,8.42c4.41,0.5,7.58,4.47,7.1,8.89c-0.49,4.41-4.65,7.55-8.89,7.1l-75.17-8.42
                    c-18.67-2.09-37.57-2.09-56.17,0L27.83,457.87C27.02,457.97,26.22,458,25.4,458z"/>
                <path style={{ fill: "var(--theme-color-C)" }} d="M426.64,160.46c-0.36,0-0.71-0.02-1.07-0.06l-126.32-16.75c-4.41-0.6-7.5-4.63-6.92-9.03
                    c0.6-4.43,4.74-7.47,9.03-6.92l126.32,16.75c4.41,0.6,7.5,4.63,6.92,9.03C434.05,157.52,430.6,160.46,426.64,160.46z"/>
                <path style={{ fill: "var(--theme-color-C)" }} d="M426.64,268.06c-0.36,0-0.71-0.02-1.07-0.06l-126.32-16.75c-4.41-0.6-7.5-4.63-6.92-9.03
                    c0.6-4.43,4.74-7.52,9.03-6.92l126.32,16.75c4.41,0.6,7.5,4.63,6.92,9.03C434.05,265.13,430.6,268.06,426.64,268.06z"/>
                <path style={{ fill: "var(--theme-color-C)" }} d="M349.31,365.1c-0.36,0-0.71-0.02-1.07-0.06l-48.98-6.5c-4.41-0.6-7.5-4.63-6.92-9.03
                    c0.6-4.41,4.74-7.54,9.03-6.92l48.98,6.5c4.41,0.6,7.5,4.63,6.92,9.03C356.72,362.17,353.26,365.1,349.31,365.1z"/>
                <path style={{ fill: "var(--theme-color-C)" }} d="M145.28,375.37c-3.02,0-5.46-2.77-5.46-6.19v-91.44c0-9.7,0-22.98-6.68-28.75
                    c-15.66-13.54-27.46-38.49-27.46-58.06c0-34.74,17.77-63.01,39.6-63.01s39.6,28.27,39.6,63.01c0,15.12-3.37,29.71-9.48,41.09
                    c-1.57,2.92-4.92,3.85-7.51,2.07c-2.58-1.78-3.39-5.58-1.82-8.5c5.09-9.47,7.89-21.77,7.89-34.65c0-27.45-13.13-50.63-28.68-50.63
                    s-28.68,23.19-28.68,50.63c0,15.81,10.18,36.99,23.17,48.22c10.97,9.48,10.97,27,10.97,38.59v91.44
                    C150.75,372.59,148.3,375.37,145.28,375.37z"/>
                </svg>
            </div>
            <div className="content-wrap">
                <span className="info-content" style={{
                    opacity: isMenutextChanging ? 0 : 1
                }}>{ menu_text.length > 5 ? menu_text.substring(0, 5) + "..." : menu_text || "정보 수집중" }</span>
            </div>
            <div className="content-specific-hyperlink">
                <span className="spec-hyper" onClick={ () => openInfoSpecific("MENU") }>전체메뉴 보기</span>
            </div>
        </div>
        <div className="shop-specblock specblock-worktime">
            <div className="icn-wrap">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 500 500">
                <g>
                    <g>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M250.34,500C112.43,500,0.22,387.8,0.22,249.88S112.43-0.24,250.34-0.24s250.12,112.2,250.12,250.12
                            S388.26,500,250.34,500z M250.34,15.12c-129.45,0-234.76,105.31-234.76,234.76s105.31,234.76,234.76,234.76
                            S485.1,379.33,485.1,249.88S379.79,15.12,250.34,15.12z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M250.34,257.56c-3.75,0-7.03-2.75-7.59-6.56c-0.62-4.2,2.28-8.1,6.47-8.73l110.7-16.34
                            c4.21-0.54,8.09,2.3,8.72,6.48c0.62,4.2-2.28,8.1-6.47,8.73l-110.7,16.34C251.09,257.53,250.7,257.56,250.34,257.56z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M250.35,257.56c-2.39,0-4.75-1.11-6.25-3.21L143.47,113.87c-2.48-3.45-1.68-8.25,1.77-10.71
                            c3.44-2.49,8.24-1.7,10.71,1.77l100.63,140.48c2.48,3.45,1.68,8.25-1.77,10.71C253.46,257.09,251.9,257.56,250.35,257.56z"/>
                    </g>
                    <path style={{ opacity: 0.2, fill: "var(--theme-color-C)" }} d="M140.88,465.91l109.49-216.02l-0.01,0l-0.01-0.04l-0.08,0.06L107.02,54.64C47.01,98.78,7.9,169.67,7.9,249.87
                        c0,98.29,58.6,182.73,142.67,220.79C147.29,469.13,144.03,467.58,140.88,465.91z"/>
                </g>
                </svg>
            </div>
            <div className="content-wrap">
                <span className="info-content">{ isWorking.length > 10 ? isWorking.substring(0, 9) + "..." : isWorking }</span>
            </div>
            <div className="content-specific-hyperlink">
                <span className="spec-hyper" onClick={ () => openInfoSpecific("WORKTIME") }>{ info.workTime ? "전체 영업시간 보기" : "영업시간 추가하기" }</span>
            </div>
        </div>
        <div className="shop-specblock specblock-contact">
            <div className="icn-wrap">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                <path style={{ fill: "var(--theme-color-C)" }} d="M347.65,499c-0.24,0-0.47,0-0.71-0.02c-77.34-4.59-161.18-46.72-230.01-115.55
                    C41.14,307.64-2.16,213.42,1.14,131.45c0.9-22.42,14.24-52.62,30.37-68.76L84.33,9.87c11.35-11.38,29.85-11.38,41.22,0l60.62,60.62
                    c5.53,5.53,8.57,12.89,8.54,20.71c-0.02,7.84-3.12,15.18-8.7,20.66l-31.61,31.18c-13.98,13.78-19.71,33.53-14.98,51.59
                    c9.44,36.05,31.65,72.92,62.52,103.8c30.95,30.93,67.89,53.14,104.01,62.58c17.93,4.64,37.64-0.98,51.35-14.77l31.53-31.59
                    c5.57-5.53,13.35-8.37,20.79-8.55c7.84,0.05,15.18,3.15,20.67,8.73l59.66,60.92c11.13,11.36,11.04,29.78-0.22,41.03l-46.4,46.38
                    c-4.57,4.57-11.98,4.57-16.55,0c-4.57-4.57-4.57-11.98,0-16.55l46.4-46.38c2.22-2.22,2.24-5.85,0.05-8.11l-59.66-60.89
                    c-1.45-1.49-4.01-1.37-4.09-1.71c-0.91,0-2.63,0.23-4.1,1.69l-31.51,31.59c-19.55,19.61-47.82,27.61-73.83,20.87
                    c-40.09-10.47-80.81-34.86-114.65-68.69c-33.76-33.78-58.14-74.4-68.62-114.4c-6.85-26.15,1.28-54.56,21.2-74.2l31.62-31.18
                    c1.49-1.49,1.71-3.18,1.71-4.07c0-0.91-0.21-2.63-1.67-4.09l-60.62-60.62c-2.24-2.24-5.9-2.24-8.14,0L48.05,79.24
                    c-11.87,11.89-22.87,36.71-23.53,53.14c-2.98,74.42,38.77,164.3,108.96,234.5c63.88,63.89,144.2,104.53,214.85,108.73
                    c6.45,0.39,11.37,5.92,10.98,12.37C358.95,494.2,353.8,499,347.65,499z"/>
                </svg>
            </div>
            <div className="content-wrap">
                <span className="info-content">{ info.contact.default ? "지금 전화하기" : "연락처 없음" }</span>
            </div>
            <div className="content-specific-hyperlink">
                <span className="spec-hyper" onClick={ () => openInfoSpecific("CONTACT") }>{ info.contact ? "연락처 보기" : "연락처 추가" }</span>
            </div>
        </div>
    </div>
};

export default ShopSpecific;