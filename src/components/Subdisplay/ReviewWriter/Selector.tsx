import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/Selector.css';
import { AnswerID, ReviewSelectionFormat } from "@src/interfaces/ReviewWriter";

// interfaces
type SelectorProps = {
    selections: Array<ReviewSelectionFormat>
    onAnswered: ( aid: AnswerID ) => void
}

// components


const Selector: React.FC<SelectorProps> = ({ selections, onAnswered }) => {
    return <div className="answerhandler-selector-wrap">
        <div className="answerhandler-selector">
            { selections.map( selection => 
                <div className="selection-block">
                    <span>{ selection.selectionText }</span>
                </div>
            ) }
        </div>
    </div>
};

export default Selector