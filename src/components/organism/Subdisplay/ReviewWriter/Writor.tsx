import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/ReviewWriter/Writor.css';

// components
import GlobalInput from "@molecule/Input/GlobalInput";

// interfaces
import { MapOnPlaceClickedFunction } from "@interfaces/MapHandler";
import ServiceButton from "@atom/Button";
import { alertOption } from "@interfaces/recoil/State";

type WritorProps = {
    placeholder?: Array<{ text: string, width: string, necessary: boolean }>
    prevValues?: Array<string>
    maxInput?: number
    onAnswered: ( value: any ) => any
}


const Writor: React.FC<WritorProps> = ({ placeholder = [{ text: "", width: "0px", necessary: true }], prevValues, maxInput, onAnswered }) => {

    // global alert control
    const setGlobalAlert = useSetRecoilState<alertOption>( states.alert );


    // input values control
    const [ values, setValues ] = useState<Array<any>>([]);
    const setValue = ( update_value: any, index: number ) => {
        console.log( update_value, index );
        setValues( ( p: Array<any> ) => {
            p[ index ] = update_value;
            return p;
        } )
    }


    // input count control
    const [ input_counts, setInputCounts ] = useState<number>( 1 );


    // prev inputed values control
    useEffect(() => {
        if ( !prevValues ) return;
        setInputCounts( prevValues.length );
        prevValues.map( ( v, i ) => ( v.length > 0 ) && setValue( v, i ) );
    }, [ prevValues ]);

    
    // button click handler
    const addInputHandler = useCallback( () => {
        if ( maxInput && maxInput > 0 && maxInput < input_counts + 1 ) {
            alert(`한번에 최대 ${ maxInput }개의 입력만 할 수 있습니다`);
            return;
        }
        setInputCounts( p => p+1 );
    }, [ input_counts ]);

    const finishInputHandler = useCallback( () => {
        let nonInputField = 0;
        values.forEach( v => {            
            if ( v.length === 0 ) nonInputField++;
        } )
        if ( nonInputField > 0 ) setGlobalAlert({
            active: true,
            title: { text: "아직 비어있는 입력란이 있어요" },
            descriptions: [{ text: `${ nonInputField }개의 입력란이 아직 입력되지 않았어요. 그대로 저장할까요?` }],
            buttons: [
                { text: "아니요", theme: "sub-selection", style: { width: "calc(50% - 5px)", position: "absolute", left: "0" }, onAction: ( closeAlert ) => closeAlert() },
                { text: "네", theme: "defalut", style: { width: "calc(50% - 5px)", position: "absolute", right: "0" }, onAction: ( closeAlert ) => {
                    onAnswered( values );
                    closeAlert();
                } },
            ],
            size: "half",
            backgroundOff: true
        });
        else onAnswered( values );
    }, [ values ] );

    return <div className="answerhandler-writor-wrap">
        <div className="multiple-inputs"> 
            {
                Array.from({ length: input_counts }).map( ( v, i ) =>
                    <div className="service-input" key={ i }>
                        { console.log( ( i < ( placeholder?.length || 1 ) ) ? placeholder[ i ].width : placeholder[ ( placeholder.length || 1 )-1 ].width ) }
                        <GlobalInput
                            className="value-writor"
                            valueState={ [ values[i] || "", ( value: any ) => setValue( value, i ) ] }
                            prevValueSync={ true }
                            placeholder={ ( i < ( placeholder?.length || 1 ) ) ? placeholder[ i ].text : placeholder[ ( placeholder.length || 1 )-1 ].text }
                            phWidth={[ 
                                ( i < ( placeholder?.length || 1 ) ) ? placeholder[ i ].width : placeholder[ ( placeholder.length || 1 )-1 ].width,
                                () => {}
                            ]}
                            type="number"
                        />
                    </div>
                )
            }
        </div>
        <div className="input-control-btns">
            <ServiceButton text="입력란 추가" theme="main-selection" onClick={ addInputHandler }/>
            <ServiceButton text="입력완료" theme="sub-selection" onClick={ finishInputHandler } />
        </div>
    </div>
};

export default Writor