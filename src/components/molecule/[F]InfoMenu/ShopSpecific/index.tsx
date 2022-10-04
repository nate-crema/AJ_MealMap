import { useState, useEffect, useRef, CSSProperties, useMemo } from "react";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { InfoSpecificOpenInfoType } from "@template/InfoSpecific/type";
import { WORK_DAYS, WORK_DAYS_KEY } from "@constant/service/Shop";
import SvgManager from "@assets/svg";

// interfaces
type ShopBriefProps = {
    info: ShopServiceType
    className?: string
    style?: CSSProperties
}

// components

const ShopSpecific: React.FC<ShopBriefProps> = ({ info, className, style }) => {
    
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
            start: worktime_yesterday.start[0] * 60 + worktime_yesterday.start[1],
            end: worktime_yesterday.end[0] * 60 + worktime_yesterday.end[1],
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

        console.log( "now_min", now_min );
        console.log( "worktime_today_min", worktime_today_min );
        console.log( "worktime_yesterday_min", worktime_yesterday_min );

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

            const remain_worktime = starttime_base - now_min;

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
                <SvgManager svg_type="locator" style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
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
              <SvgManager svg_type="menu" style={{ ".st0": { fill: "var(--theme-color-C)" } }}/>
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
                <SvgManager svg_type="worktime" style={{ ".st0": { fill: "var(--theme-color-C)" }, ".st1": { fill: "var(--theme-color-C)", opacity: "0.2" } }}/>
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
                <SvgManager svg_type="contact"/>
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