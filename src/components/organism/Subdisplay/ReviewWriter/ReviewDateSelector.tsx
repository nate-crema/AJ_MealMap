import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/ReviewDateSelector.css';

// components
import DateSelector from "@src/components/molecule/Selectors/DateSelector";
import ServiceButton from "@src/components/atom/Button";

// interfaces
type DateSelectorResponse = {
    month: number | null
    year: number | null
    ampm: number | null
}

type ReviewDateSelectorProps = {
    onAnswered: ( value: any ) => any
}

const ReviewDateSelector: React.FC<ReviewDateSelectorProps> = ({ onAnswered }) => {

    const [ selected, setSelected ] = useState<boolean>( false );
    const [ date, setDate ] = useState<DateSelectorResponse>( { month: -1, year: -1, ampm: -1 } );

    const onValueInputHandler = ( v: DateSelectorResponse ) => {
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
            <DateSelector
                inputValue={[ "date", "am/pm" ]}
                onValueSucceed={ onValueInputHandler }
                className="time-selector"

                displayKO={ "ko" }
                init={ undefined }
                init_assign={ undefined }
            />
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

export default ReviewDateSelector