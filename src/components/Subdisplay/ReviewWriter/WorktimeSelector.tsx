import { useState, useEffect, useRef, MouseEvent, useMemo, useCallback, TouchEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/WorktimeSelector.css';

// components

// interfaces
type catType = "work" | "rest" | "close";

type WorktimeSelectorProps = {
    onAnswered: ( answer: any ) => any
}

const WorktimeSelector: React.FC<WorktimeSelectorProps> = ({ onAnswered }) => {

    // category control
    const [ curr_cat, setCurrCat ] = useState<catType>( "work" );
    const TIME_CATS = [
        { type: "work", color: "lightblue", text: "영업시간" },
        { type: "rest", color: "lightpink", text: "휴식시간" },
        { type: "close", color: "lightgray", text: "마감시간" },
    ];

    // timeline control
    const [ timeline_type, setTimelineType ] = useState<"am" | "pm">( "am" );
    const TIMELINES = [
        { type: "am", display: "오전" },
        { type: "pm", display: "오후" }
    ];

    // selecting control
    const selecting = useRef<boolean>( false );
    const selectedPosition = useRef<number>( 0 );

    const [ selectedRange , setSelectedRange ] = useState<{ [ keys in catType ]: { from: number, to: number } }>({
        work: { from: 0, to: 0 },
        rest: { from: 0, to: 0 },
        close: { from: 0, to: 0 }
    });

    const [ timeline_layout, setTimelineLayout ] = useState<DOMRect>();

    const TIMELINE_CELLWIDTH = useMemo( () => (timeline_layout?.width || 0) / 12, [ timeline_layout ] );

    const getUserPointerLocation = ( e: any ) => {
        console.log(e?.pageX || e.touches);
        return e?.pageX || e.touches[0].clientX;
    }

    const updateTimelineType = ( e: MouseEvent | TouchEvent ) => {
        console.log(e.target);
        const timeline_type_current: "pm" | "am" = ( e.currentTarget.id || "am" ) as "pm" | "am";
        setTimelineType( timeline_type_current );
        return timeline_type_current;
    }

    const findSelectPosition = useCallback(( e: MouseEvent | TouchEvent, type: "start" | "move" ) => {
        if ( !selecting.current ) return;
        
        const timeline_layout_current = e.currentTarget.getBoundingClientRect();
        setTimelineLayout( timeline_layout_current );

        const timeline_type_current = updateTimelineType( e );
        console.log( "timeline_type_current", timeline_type_current );

        const { width: timeline_width, left: timeline_left } = timeline_layout_current;
        const rel_clickpoint = Math.floor(( getUserPointerLocation( e ) - timeline_left ) / timeline_width * 100);
        const time_clickvalue = Math.ceil( rel_clickpoint / 100 * 12 ) + ( ( timeline_type_current === "pm" ) ? 12 : 0 );
        
        setSelectedRange( p => ({ ...p, [ curr_cat ]: { ...p[ curr_cat ], [ ( type === "start" ) ? "from" : "to" ]: time_clickvalue } }) );
        // console.log( timeline_type );
        console.log( time_clickvalue );
    }, [ timeline_type ]);

    const timelineMouseDownHandler = ( e: MouseEvent ) => {
        try {
            // pass when touch event trigger mouse down event handler
            document.createEvent("TouchEvent");
        } catch(_) {
            e.stopPropagation();
            setSelectedRange({
                work: { from: 0, to: 0 },
                rest: { from: 0, to: 0 },
                close: { from: 0, to: 0 }
            })
            selecting.current = true;
            findSelectPosition( e, "start" );
        }
    }

    const timelineTouchStartHandler = ( e: TouchEvent ) => {
        e.stopPropagation();
        setSelectedRange({
            work: { from: 0, to: 0 },
            rest: { from: 0, to: 0 },
            close: { from: 0, to: 0 }
        })
        selecting.current = true;
        findSelectPosition( e, "start" );
    }

    const timelineMouseUpHandler = ( e: MouseEvent ) => {
        console.log("mouse up");
        e.stopPropagation();
        selecting.current = false;
        findSelectPosition( e, "move" );
    }

    const timelineMouseMoveHandler = useCallback(( e: MouseEvent | TouchEvent ) => {
        console.log("move", selecting.current);
        if ( !selecting.current ) return;
        findSelectPosition( e, "move" );
    }, [ timeline_type ])

    const timelineMouseOverHandler = ( i: number ) => {
        // console.log("OVER", i);
        setTimelineType( i ? "pm" : "am" );
    }
    
    
    return <div className="worktime-selector"
        onMouseUp={ timelineMouseUpHandler }
        onMouseMove={ timelineMouseMoveHandler }
        onTouchMove={ timelineMouseMoveHandler }
    >
        <div className="categories">
            { TIME_CATS.map( cat => <div className="category cat-worktime">
                <div className="cat-palate" style={{ backgroundColor: cat.color }}/>
                <span className="cat-desctext">{ cat.text }</span>
            </div> ) }
        </div>
        <div className="timeline-wrap">
            {
                TIMELINES.map( ( time_info, i ) => <>
                    <span className="timeline-typetext">{ time_info.display }</span>
                    <div className="timeline"
                        id={ i ? "pm" : "am" }
                        onMouseDown={ timelineMouseDownHandler }
                        onTouchStart={ timelineTouchStartHandler }
                        onMouseOver={ () =>timelineMouseOverHandler(i) }
                    >
                        <div className="timeline-selected" style={{
                            backgroundColor: TIME_CATS.find( v => v.type === curr_cat )?.color,
                            left: `${ ( selectedRange[ curr_cat ].from - ( i * 12 ) ) * ( TIMELINE_CELLWIDTH - 1 || 0 ) }px`,
                            width: `calc(${ (( selectedRange[ curr_cat ].to)  - ( i * 12 ) - ( selectedRange[ curr_cat ].from - ( i * 12 ) )) * ( TIMELINE_CELLWIDTH - 1 || 0 ) }px)`
                        }}/>
                        <div className="timeline-texts">
                            { Array.from({ length: 11 }).map( _ => <div className="timeline-bar"/> ) }
                        </div>
                    </div>
                </>
                )
            }
        </div>
    </div>
};

export default WorktimeSelector