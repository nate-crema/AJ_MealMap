import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// api
import { meeting, user } from '../../../apis';

// components
import DateSelector from '../../../components/DateSelector';
import FilterIcon from '../FilterIcon';

// css
import "../../../css/mobile_comp/Sub.Manage.Meeting.css";


const webQueryParser = ( raw_query ) => {
    console.log(raw_query);
    if (raw_query[0] != "?") return null;
    let queries = raw_query.replace("?", "").split("&");
    queries = queries.map(v => ({ [ v.split("=")[0] ]: v.split("=")[1] }));
    return { ...queries[0] };
}

const sizes = {
    maximize: "600px",
    sub_maximize: "530px",
    oh_default: "470px",
    default: "400px",
    half_default: "250px",
    quarter_default: "150px",
    minimize: "110px"
}

function BottomManageMeeting({ swipeEvent, history, bottomCompHandler }) {

    const { user: { uinfo }, map: { stat }, mobile: { bottom_comp: Bcomp, mealfriend } } = useSelector(state => state);
    const dispatch = useDispatch();

    const titleRef = useRef(); // title tag reference
    const titleImgRef = useRef(); // title image tag reference
    const [ menu_title, setMenuTitle ] = useState("밥약속 관리"); // title text state
    const [ description, setDescription ] = useState("초대장을 선택해 더 많은 정보를 확인하세요!"); // description text state

    const [ menu_open, setMenuOpen ] = useState(false); // menu open state
    const [ meeting_info, setMeetingInfo ] = useState(null); // meeting info
    const [ participant_limit, setParticipantLimit ] = useState(0); // meeting participants limit

    const [ timedisplay_animate, setTimedisplayAnimate ] = useState(false) // animation: time display
    const manage_session_close = useRef(true);

    // sync menu state with ui state
    const openMenu = ( { title, desc } ) => {
        setMenuOpen(true);
        bottomCompHandler(sizes.maximize);
        setMenuTitle( title );
        setDescription( desc );
    }

    const closeMenu = () => {
        setMenuTitle("밥약속 관리");
        setDescription("초대장을 선택해 더 많은 정보를 확인하세요!");
        bottomCompHandler(sizes.half_default);
        setMeetingInfo(null);
        setMenuOpen(false);
    }

    const initMeetingManager = async ( meetingId ) => {

        const minfo = await meeting.getInfo( meetingId, history.location.state );
        if (!minfo) return;

        setMeetingInfo( minfo );

        const { date, organizer } = minfo;
        console.log(minfo);

        // calculate passed_time
        let passed_time = "오래전";
        const passed = new Date().getTime() - date.getTime();

        if ( passed < 60 * 1000 ) passed_time = "방금전";
        else if ( passed < 60 * 60 * 1000 ) passed_time = `약 ${ Math.floor( passed / ( 60 * 1000 ) ) }분 전`;
        else if ( passed < 24 * 60 * 60 * 1000 ) passed_time = `약 ${ Math.floor( passed / ( 60 * 60 * 1000 ) ) }시간 전`;
        else if ( passed < 7 * 24 * 60 * 60 * 1000 ) passed_time = `약 ${ Math.floor( passed / ( 24 * 60 * 60 * 1000 ) ) }일 전`;
        else if ( passed < 9 * 7 * 24 * 60 * 60 * 1000 ) passed_time = `약 ${ Math.floor( passed / ( 7 * 24 * 60 * 60 * 1000 ) ) }주 전`;
        
        openMenu({ 
            title: `${ date.getMonth()+1 }월 ${ date.getDate() }일 약속`,
            desc: `${ organizer.name }님이 ${ passed_time } 초대한 약속`
        })
    }
    
    useEffect(() => {
        const { meetingId } = webQueryParser( window.location.search ) || {};
        if ( !meetingId ) return;
        
        initMeetingManager( meetingId );
    }, [ window.location.href ]);

    // get participant limit
    const getParticipantLimit = useCallback(async () => {
        const limit = await meeting.getParticipantLimit( meeting_info?.date.getTime() || new Date().getTime() );
        if (!limit) return;
        
        setParticipantLimit(limit);
    }, [ meeting_info ]);

    useEffect(() => getParticipantLimit(), []);

    const _scrollHandler = (e) => {
        // time-display animation
        if ((e.target.offsetHeight + e.target.scrollTop) > 350) setTimedisplayAnimate(true);
    }

    const _touchStartHandler = (e) => {
        // session_closeable check
        manage_session_close.current = (e.currentTarget.scrollTop === 0);
    }


    // meeting management: handle session closing
    const _closeManageSession = () => {
        if ( manage_session_close.current ) {
            closeMenu();
            history.push("/manage/meeting");
        }
    }

    const _closeManageControl = () => {
        history.push("/");
    }

    useEffect(() => {
        if ( menu_open ) swipeEvent.addEventListener("toDown", _closeManageSession);
        else swipeEvent.addEventListener("toDown", _closeManageControl);
        return () => {
            swipeEvent.removeEventListener("toDown", _closeManageSession);
            swipeEvent.removeEventListener("toDown", _closeManageControl);
        }
    }, [ menu_open ])

    // meeting management: handle editing meeting info
    const openEditor = ( opentype ) => {
        switch(opentype) {
            case "participants":
                return dispatch({ type: "mobile/SETALERT", alert_objet: {
                    type: "prompt/component",
                    stage_control: [
                        ( escape ) => ({
                            title: ( participant_limit - meeting_info.participants.length === 0 ) ? 
                                    "더이상 초대할 수 없어요"
                                    : "약속에 누구를 초대할까요?",
                            ment: ( participant_limit === 0 ) ? "원하는 친구를 선택해주시면 약속에 이미 참여한 다른분들께 물어보고 빠르게 초대할게요!" 
                            : ( participant_limit - meeting_info.participants.length === 0 ) ? "질병관리청 사회적 거리두기 강화조치에 따라 더이상 약속인원을 추가할 수 없어요"
                            : `약속에 최대 ${ participant_limit - meeting_info.participants.length }명까지 추가할 수 있어요`,
                            comp: <></>,
                            selection: ( participant_limit - meeting_info.participants.length === 0 )
                            ? [ { text: "확인", style: { color: "var(--theme-color-C)" }, focus: true, onClick: escape } ]
                            : [
                                { text: "취소", style: { color: "var(--theme-color-C)" }, focus: true, onClick: escape },
                                { text: "다음", style: { color: "var(--theme-color-C)" }, focus: true, onClick: 1 },
                            ]
                        }),
                        async ( escape, selected ) => {
                            try {
                                // register participant-add request on meeting state
                                const result = await meeting.registerRequest( meeting_info._id, "partcipant", selected );
                                
                                if (result) return {
                                    title: "추가한 친구가 공유되었어요",
                                    ment: `약속에 초대된 사람들에게 먼저 물어보고 추가한 친구${ selected.length > 1 ? "들" : "" }에게 초대장을 보낼게요!`,
                                    selection: [ { text: "확인", style: { color: "var(--theme-color-C)" }, focus: true, onClick: escape } ]
                                }
                                
                                throw new Error(result);

                            } catch(e) {
                                console.error(e);
                                return {
                                    title: "문제가 발생했어요",
                                    ment: "잠시후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요",
                                    selection: [ { text: "확인", style: { color: "black" }, focus: true, onClick: escape } ]
                                }
                            }
                        },
                    ]
                } })
            case "time":
                return dispatch({ type: "mobile/SETALERT", alert_objet: {
                    type: "prompt/time",
                    stage_control: [
                        
                    ]
                } })
            case "filters":
                return dispatch({ type: "mobile/SETALERT", alert_objet: {
                    type: "prompt/component",
                    stage_control: [
                        
                    ]
                } })
            default:
                return;
        }
    }

    return <div className="meeting-manage-menu">
        <div className="title-area">
            <img ref={titleImgRef}/>
            <span className="menu_title" ref={titleRef}>{ menu_title }</span>
            <span className="description">{ description }</span>
        </div>
        {
            ( meeting_info ) && <div className="meeting-info-wrapper"
                onTouchStart={_touchStartHandler}
                onScroll={_scrollHandler}
            >
                <div className="invited-list minfo-block" onClick={() => openEditor("participants")}>
                    <span className="context-title">약속에 초대된 사람</span>
                    <div className="user-list">
                        <div className="users-aligner" style={{
                            width: `${ ( 80 + 20 ) * meeting_info.participants.length + 20 }px`
                        }}>
                            { meeting_info.participants.map(({ user, confirmed }) => <div className="participate-user-block" style={{
                                backgroundColor: 
                                    ( confirmed === 0 ) ? "#B400001A" :
                                    ( confirmed === 1 ) ? "#005AB41A" :
                                    null
                            }}>
                                <div className="user-image" style={{
                                    backgroundImage: `url(${ user.img })`
                                }}/>
                                <span className="user-name">{ user.name }</span>
                            </div>) }
                        </div>
                    </div>
                    <span className="limit-notice">
                        { participant_limit === 0 ? <>
                            * 질병관리청 사회적 거리두기 강화조치가 해제되어 더이상 인원추가에 제한이 없어요
                        </> : <>        
                            *
                            <b onClick={
                                () => window.location.href = "https://www.suwon.go.kr/web/search/PD_searchList.do?pageNum=&searchCategory=swnews&searchSort=regDt&dateRange=all&startDt=&endDt=&searchFd=all&srchDtlFlag=false&preKwd=%EA%B1%B0%EB%A6%AC%EB%91%90%EA%B8%B0&searchCategory=swnews&kwd=%EA%B1%B0%EB%A6%AC%EB%91%90%EA%B8%B0"
                            }>질병관리청 사회적 거리두기 강화조치</b>
                            에 따라 같은 약속에 <nbsp/>
                            <b>최대 { participant_limit }명</b>
                            까지 인원추가가 가능해요
                        </>}
                    </span>
                </div>
                <div className="meeting-time minfo-block" onClick={() => openEditor("time")}>
                    <span className="context-title">약속시간</span>
                    <div className="meeting-time-display-wrap">
                        <DateSelector
                            className="meeting-time-display"
                            inputValue={[ "time", "am/pm" ]}
                            init={ {
                                hour: meeting_info?.meet_time?.getHours(),
                                minute: meeting_info?.meet_time?.getMinutes(),
                                ampm: meeting_info?.meet_time?.getHours() > 12 ? 2 : 1,
                            }}
                            init_assign={ timedisplay_animate }
                            editable={false}
                            displayKO={true}
                            button={false}
                        />
                    </div>
                </div>
                <div className="filtered-list minfo-block" onClick={() => openEditor("filters")}>
                    <span className="context-title">설정된 밥집 검색조건</span>
                    <div className="filters-wrap">
                        <div className="filters-aligner" style={{
                            width: `${ ( 80 + 20 ) * meeting_info.participants.length + 20 }px`
                        }}>
                            { meeting_info.filter.map( ({ filterInfo, assign_count, auth }) => <>
                                <div className="filter-block">
                                    <div className="filter-icon-wrap" style={{
                                        boxShadow: assign_count === 0 ? "rgb(0 108 255 / 50%) 0px 2px 5px" : "rgb(190 51 51 / 50%) 0px 2px 5px"
                                    }}>
                                        <FilterIcon className="filter-icon" id={ filterInfo.type } color={ assign_count === 0 ? "var(--theme-color-C)" : "#BE3333" }/>
                                    </div>
                                    <span className="filter-name">{ filterInfo.name } { ( assign_count === 0 ) ? "허용" : "제외" }</span>
                                </div>
                            </> ) }
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>;
}

export default BottomManageMeeting;