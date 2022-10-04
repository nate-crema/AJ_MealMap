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
        <div className="answerhandler-selector" style={{
            height: `calc( 70px * ${ Math.floor( selections.length / 2 ) } + 60px )`,
            gridTemplateRows: `repeat( ${ Math.floor( selections.length / 2 ) }, 60px )`
        }}>
            { selections.map( selection => 
                <div
                    key={ selection.aid }
                    className="selection-block"
                    onClick={ () => onAnswered( selection.aid ) } 
                >
                    <span>{ selection.selectionText }</span>
                </div>
            ) }
        </div>
    </div>
};

export default Selector