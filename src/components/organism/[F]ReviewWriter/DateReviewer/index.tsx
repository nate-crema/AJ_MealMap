import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import DatetimeSelector from "@molecule/[F]Selector/DatetimeSelector";
import ServiceButton from "@atom/ServiceButton";

// interfaces
type DatetimeSelectorResponse = {
    month: number | null
    year: number | null
    ampm: number | null
}

type DateReviewerProps = {
    onAnswered: ( value: any ) => any
}

const DateReviewer: React.FC<DateReviewerProps> = ({ onAnswered }) => {

    const [ selected, setSelected ] = useState<boolean>( false );
    const [ date, setDate ] = useState<DatetimeSelectorResponse>( { month: -1, year: -1, ampm: -1 } );

    const onValueInputHandler = ( v: DatetimeSelectorResponse ) => {
        if ( !Object.values( v ).includes( null ) ) {
            setSelected( true );
            setDate( v );
        }
    }

    const finishButtonClickHandler = useCallback( () => {
        onAnswered( date );
    }, [ date ] );

    return <div className="review-dateselector-wrap">
        <div className="time-selector-wrap">
            <div className="time-selector-fader fader-top"/>
            {/* <DatetimeSelector
                inputValue={[ "date", "am/pm" ]}
                onValueSucceed={ onValueInputHandler }
                className="time-selector"

                displayKO={ "ko" }
                init={ undefined }
                init_assign={ undefined }
            /> */}
            <div className="time-selector-fader fader-bottom"/>
        </div>
        <ServiceButton 
            { ...( ( selected ) ? {
                text: "다음",
                theme: "main-selection"
            } : {
                text: "잘 모르겠어요",
                theme: "sub-selection"
            } ) }
            className="time-selector-finish-button"
            style={{ fontSize: "16px" }}
            onClick={ finishButtonClickHandler }
        />
    </div>
};

export default DateReviewer