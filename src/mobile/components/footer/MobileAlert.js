import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/MobileAlert.css";

// component
import Friendlist from '../../../components/FriendList';
import DateSelector from '../../../components/DateSelector';
import { AlergicBlockList } from '../../../components/AlergicBlock';

function AlertInnerBtn({ options, state, closeAlert }) {

    return <div className="alert-inner-btn" style={{ ...options?.style }} onMouseUp={() => setTimeout(() => {
        let alert_close = true;
        if (options?.onClick) alert_close = options.onClick(state);
        if ( alert_close !== false ) closeAlert();
    }, 200)}>
        <span>{ options.text }</span>
    </div>;
}

function MobileAlert() {

    const { mobile: { alert_object } } = useSelector(state => state);
    const dispatch = useDispatch();

    // alert state control
    const [ isActive, setIsActive ] = useState(false);
    const [ innerCompMode, setInnerCompMode ] = useState(null); // === alert_object.component
    const [ selections, setSelections ] = useState([]); // rendering selections

    const closeAlert = () => {
        setIsActive(false);
        return dispatch({ type: "mobile/SETALERT", alert_object: null });
    }

    const _alertBackgroundClickHandler = ( event, alert_info ) => {
        if (alert_info?.onBackgroundClick) alert_info.onBackgroundClick( closeAlert );
    }

    useEffect(() => {
        // alert state control
        // console.log(alert_object);
        if (alert_object) {
            setIsActive(true);

            if ( alert_object.type === "component" && alert_object.component ) {

                setInnerCompMode( alert_object.component );

                // type: component -> state control
        
                    let innerComponentStates = [];   
        
                    if ( alert_object?.component === "FriendList" ) {
                        innerComponentStates = [
                            {
                                statename: "friend_list",
                                initial: []
                            }, {
                                statename: "friend_selected",
                                initial: []
                            }
                        ];
                    } else if ( alert_object?.component === "TimeSelector" ) {
                        innerComponentStates = [
                            {
                                statename: "time_selected",
                                initial: []
                            } 
                        ]
                    } else if ( alert_object?.component === "FilterSelector" ) {
                        innerComponentStates = [
                            {
                                statename: "filter",
                                initial: alert_object?.component_states?.filter
                            } 
                        ]
                    }
        
                    // set state
                    innerComponentStates.forEach( innerCompOption => {
                        setCompState( alert_object?.component, innerCompOption.statename, innerCompOption.initial );
                    });
        
                // type: component -> initial functions control
        
                    if ( alert_object?.component === "FriendList" ) {
                        ( async function() {
                            const friends = await getFriendList();
                            setCompState( "FriendList", "friend_list", friends );
                        }() );
                    }
            } else setInnerCompMode( null );

        } else setInnerCompMode( null );

    }, [ alert_object ]);    


    // type: component control

        const [ compState, setInnerComponentState ] = useState({});
        const setCompState = ( component, state_name, value ) => {
            if (typeof value !== "function") {
                // console.log(`${ component }'s Alert Component State update: [${ state_name }: ${ value }]`);
                setInnerComponentState( prev => ( { ...prev, [ component ]: { ...prev[ component ], [ state_name ]: value } } ) );
            } else {
                setInnerComponentState( prev => {
                    const calced_value = value( prev[ component ][ state_name ] );
                    // console.log(`${ component }'s Alert Component State update: [${ state_name }: (calced)]`, calced_value);
                    return {
                        ...prev,
                        [ component ]: {
                            ...prev[ component ],
                            [ state_name ]: calced_value
                        }
                    }
                } );
            }
        }

        // const [ friend_list, setFriendList ] = useState([]); // friend's object list
        // const [ friend_selected, setFriendSelected ] = useState([]); // selected friend's id list
        
        // get friend list
        const getFriendList = async () => {
            return [
                {
                    _id: "uid_0",
                    info: {
                        name: "방재훈",
                        pn: "01012345678",
                        college: "정보통신대학",
                        major: "국방디지털융합학과",
                        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_1",
                    info: {
                        name: "박상현",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_2",
                    info: {
                        name: "김건모",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_3",
                    info: {
                        name: "길멃",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_4",
                    info: {
                        name: "Ritta Siruang",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_5",
                    info: {
                        name: "ㄱㄱㄱ",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                },
                {
                    _id: "uid_6",
                    info: {
                        name: "ㄱㄱㄱ",
                        pn: "01000003030",
                        college: "의과대학",
                        major: "의예과",
                        img: null,
                    },
                    connected: true,
                    start: new Date("2022-01-01").getTime()
                }
            ];
        }

        // update selection when compState change
        useEffect(() => {
            if ( innerCompMode && alert_object?.selection ) {
                // calculate rendering selections
                setSelections( p => alert_object?.selection.filter(v => v.displayFilter ? v.displayFilter(
                    innerCompMode === "FriendList" ? compState.FriendList.friend_selected :
                    innerCompMode === "TimeSelector" ? compState.TimeSelector.time_selected : ""
                ) : true ));
            } else setSelections( alert_object?.selection );
        }, [ compState, innerCompMode ]);

    // test
    /*

    useEffect(() => {
        dispatch({ type: "mobile/SETALERT", alert_object: {
            type: "selectable",
            title: "선택한 n명의 친구들을 삭제할까요?",
            ment: "삭제한 친구는 회원님 목록과 삭제한 친구들의 ‘주변친구’ 목록에서만 지워져요.",
            style: {
                alerter_height: "350px",
                titleColor: "#aa2200"
            },
            selection: [
                { text: "취소", style: { color: "black" }, focus: true, onClick: () => {} },
                { text: "삭제", style: { color: "white", backgroundColor: "#aa2200" }, focus: true, onClick: () => {} },
            ]
        } })
    }, [])
    
    */

    return <>
        <div className="mobile-alert-background" style={{
            opacity: isActive ? "1" : "0",
            display: isActive ? "unset" : "none",
        }} onClick={ ( e ) => _alertBackgroundClickHandler( e, alert_object ) } ></div>
        <div className="mobile-alert" style={{
            bottom: isActive ? "0" : "-100px",
            height: isActive ? ( alert_object?.style?.alerter_height || "300px" ) : "0px"
        }}>
            {
                (isActive && alert_object) && <div className="mnoti-contents">
                    <p className="title" style={{ color: alert_object?.style?.titleColor }}>{ alert_object.title }</p>
                    <span className="ment" style={{ color: alert_object?.style?.mentColor }}>{ alert_object.ment }</span>
                    {
                        ( innerCompMode ) && 

                            ( innerCompMode === "FriendList" ) ? <Friendlist className="friend-selector"
                                friend_list={ compState.FriendList.friend_list }
                                list_mode="selection"
                                blockClickHandler={( id ) => {
                                    const addIdToSelectedList = () => setCompState( "FriendList", "friend_selected", p => {
                                        let arr = [ ...p ];
                                        const idx = arr.indexOf(id);
                                        if (idx === -1) {
                                            arr.push(id);
                                            return arr;
                                        } else {
                                            arr.splice(idx, 1);
                                            return arr;
                                        }
                                    } );

                                    if ( alert_object?.onComponentCustomAction?.blockClickHandler ) {
                                        const { friend_list, friend_selected } = compState.FriendList;
                                        if ( alert_object.onComponentCustomAction.blockClickHandler( id, friend_list, friend_selected ) ) addIdToSelectedList();
                                    } else addIdToSelectedList();

                                    // default action block
                                    return false;
                                }}
                                select_state={[ compState.FriendList.friend_selected, ( v ) => setCompState( "FriendList", "friend_selected", v ) ]}
                            /> :

                            ( innerCompMode === "TimeSelector" ) ? <div className="time-selector-wrap">
                                <DateSelector className="time-selector"
                                    inputValue={[ "time", "am/pm" ]}
                                    onValueSucceed={ ( value ) => {
                                        setCompState( "TimeSelector", "time_selected", value );
                                    } }
                                    button={false}
                                />
                            </div> :

                            ( innerCompMode === "FilterSelector" ) ? <div className="filter-selector-wrap">
                                <AlergicBlockList
                                    meeting_info={ { filter: compState.FilterSelector.filter } }
                                    mode="edit"
                                    onClick={ ( filter_info ) => {
                                        if ( alert_object?.component_functions?.onClick ) {
                                            let rv = alert_object?.component_functions?.onClick( filter_info );
                                            if ( rv !== undefined ) setCompState( "FilterSelector", "filter", [
                                                ...compState.FilterSelector.filter,
                                                ...rv
                                            ] );
                                        }
                                        
                                    } }
                                    onAlergicFilterClick={ ( filter_info ) => {
                                        if ( alert_object?.component_functions?.onAlergicFilterClick ) {
                                            alert_object?.component_functions?.onAlergicFilterClick( filter_info, () => {

                                                // find filter value
                                                const filter = [ ...compState.FilterSelector.filter ];
                                                const index = filter.indexOf(filter.find(v => v.filterInfo._id === filter_info._id));

                                                // console.log(filter, index, filter[index]);

                                                // save select result
                                                if ( filter[index].state !== true ) filter[index].disable_count++;
                                                else filter[index].disable_count--;
                                                filter[index].state = filter[index].state !== true;

                                                // update state
                                                setCompState( "FilterSelector", "filter", filter );

                                                return filter[index];
                                            } );
                                        }
                                        
                                    } }
                                />
                            </div> :


                            <></>
                    }

                    { 
                        // ( alert_object?.type == "selectable" ) ?
                        ( selections ) &&
                            <div className="btns" style={{
                                gridTemplateColumns: `repeat(${ selections.length }, calc(${ 100 / selections.length }% - 6px))`
                            }}>
                                { selections.map((options, i) => <AlertInnerBtn key={ i } options={options} state={ compState[ innerCompMode ] } closeAlert={closeAlert}/> )}
                            </div>
                    }
                    
                </div>
            }
        </div>
    </>;
}

export default MobileAlert;