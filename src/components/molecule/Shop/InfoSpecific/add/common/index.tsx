import { useState, useEffect, useRef, ReactChild, useCallback, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import InfoSpecCtrlBtn from "../../button";

// interfaces
export type StageAction = {
    text: string,
    size?: number,
    beforeAction?: ( stage: number ) => Promise<Partial<{
        stage: number,
        text: string
    }> | boolean | void | undefined>
    afterAction?: ( stage: number ) => Promise<Partial<{
        stage: number,
        text: string
    }> | boolean | void | undefined>
}

type InfoSpecificAddCommonProps = {
    children?: ReactChild,
    stage_list: Array<StageAction>
}

// components


const InfoSpecificAddCommon: React.FC<InfoSpecificAddCommonProps> = ({ children, stage_list }) => {

    const [ stage_text, setStageText ] = useState<string>("");
    const [ stage, setStage ] = useState<number>(0);
    
    const stage_content = useMemo( () => stage_list[ stage ], [ stage_list, stage ] );

    const stageBtnClickHandler = useCallback( async () => {

        const { afterAction } = stage_content;
        if ( afterAction ) {
            const return_values = await afterAction( stage );
            if ( return_values === false ) return;
            else if ( typeof return_values === "object" ) {
                setStage( return_values.stage || stage+1 );
                setStageText( return_values.text || stage_list[ stage+1 ].text );
                return;
            }
        }
        
        if ( !stage_list[stage+1] ) return;
        setStage( stage+1 );
        setStageText( stage_list[ stage+1 ].text );
    }, [ stage, stage_list ]);

    useEffect(() => {
        ( async () => {
            const { beforeAction, text } = stage_list[ stage ];
            if ( beforeAction ) {
                const return_values = await beforeAction( stage );
                if ( typeof return_values === "object" ) {
                    setStageText( return_values.text || text );
                    if ( return_values.stage ) setStage( return_values.stage );
                    return;
                }
            }
            setStageText( text );
        } )()
    }, [ stage, stage_list ]);

    return <div className="shop-infospec-add">
        <InfoSpecCtrlBtn type="stage" className="add-stage-btn" style={{
            width: stage_content.size ? `${ stage_content.size }px` : undefined
        }} onClick={ stageBtnClickHandler }>{ stage_text }</InfoSpecCtrlBtn>
        { children }
    </div>
};

export default InfoSpecificAddCommon