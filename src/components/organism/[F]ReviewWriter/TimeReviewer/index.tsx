import { useState, useEffect, useRef, MouseEvent, useMemo, useCallback, TouchEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import DatetimeSelector from "@molecule/[F]Selector/DatetimeSelector";
import ServiceButton from "@atom/ServiceButton";
import MultiDatetimeSelector from "@molecule/[F]Selector/MultiDatetimeSelector";
import {
    MultiDatetimeSelectorInputCatRest,
    MultiDatetimeSelectorInputCatWork,
    MultiDatetimeSelectorInputModeFrom,
    MultiDatetimeSelectorInputModeTo,
    MultiDatetimeSelectorInputTimesType
} from "@molecule/[F]Selector/MultiDatetimeSelector/types";

// interfaces
type catType = "work" | "rest";
type modeType = "from" | "to";

type TimeReviewerProps = {
    selected: MultiDatetimeSelectorInputTimesType | undefined,
    onAnswered: ( answer: MultiDatetimeSelectorInputTimesType ) => any
}

const TimeReviewer: React.FC<TimeReviewerProps> = ({ selected, onAnswered }) => {

    return <div className="worktime-selector">
        <MultiDatetimeSelector
            INPUT_MODES={ [
                { type: MultiDatetimeSelectorInputCatWork, title: "영업시간", isMultiple: false, submodes: [ { type: MultiDatetimeSelectorInputModeFrom, text: "시작시간" }, { type: MultiDatetimeSelectorInputModeTo, text: "종료시간" } ] },
                { type: MultiDatetimeSelectorInputCatRest, title: "휴식시간", isMultiple: true, submodes: [ { type: MultiDatetimeSelectorInputModeFrom, text: "시작시간" }, { type: MultiDatetimeSelectorInputModeTo, text: "종료시간" } ] }
            ] }
            onAnswered={ onAnswered }
            init_value={ selected }
        />
    </div>
};

export default TimeReviewer