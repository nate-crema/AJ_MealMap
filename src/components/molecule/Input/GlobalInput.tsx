import { useState, useEffect, useRef, useCallback, MutableRefObject, RefObject } from 'react';

// recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import states from '@src/recoil/states';

// css
import "@styles/components/GlobalInput.css";

// interfaces

type GlobalInputCommonProps = {
    className?: string
    prevValueSync?: boolean
    placeholder?: string
    onInputDisplayText?: string
    phWidth?: [ string, Function ]
    type?: "text" | "number"
    _ref?: RefObject<HTMLDivElement>
    changeable?: boolean
    focusState?: any
    onBlur?: ( e: any ) => any
    onFocus?: ( e: any ) => any
}

type GlobalInputProps = GlobalInputCommonProps & ({
    value: string
    valueState?: null
} | {
    value?: null
    valueState: [ any, ( value: any ) => any ]
})

const GlobalInput: React.FC<GlobalInputProps> = ({ 
    className, prevValueSync, placeholder, phWidth: [ phWidth, setPhWidth ] = [ "", () => {} ], type, value, valueState, _ref, changeable, focusState, onInputDisplayText,
    onBlur, onFocus
}) => {

    /* eslint-disable-next-line */
    const setParentValue = value ? useSetRecoilState( states[ value ] ) : ( value: any ) => {};
    const [ v, setV ] = useState<any>( "" );
    const [ ph, setPh ] = useState<string | undefined>(placeholder || "");
    const [ focused, setIsFocus ] = useState(false);
    const [ init, setInit ] = useState(false);

    const phRef = useRef<HTMLElement | null>( null );
    const thRef = useRef<HTMLDivElement | null>( null );
    const inpRef = useRef<HTMLInputElement | null>( null );

    // sync prev value
    useEffect(() => {
        if ( valueState ) console.log(init, valueState);
        if ( prevValueSync === true && !init && valueState && valueState[0].length > 0 ) {
            console.log("valueState", valueState);
            inpRef.current?.focus();
            setV( valueState[0] );
            inpRef.current?.blur();
        }
    }, [ init, valueState, prevValueSync ]);

    // sync value's change with parent
    useEffect(() => {
        if ( valueState ) valueState[1]( v );
        else if ( value ) setParentValue( v );
    }, [ v ]);

    // make input focus when component clicked
    const indirectFocus = (e: any) => {
        e.stopPropagation();
        setFocus();
    }

    // update focus state when input focus state change
    useEffect(() => {
        if (focusState) focusState[1](focused);
    }, [ focused ]);

    // detect placeholder value change
    useEffect(() => {
        console.log( ph, placeholder, init );
        if ( ph === placeholder ) return;
        if (!phRef?.current?.style || !thRef?.current?.style) return;
        if ( phRef.current ) phRef.current.style.opacity = "0";
        setTimeout(() => {
            setPh(placeholder);
            if ( phRef.current ) phRef.current.style.opacity = "1";
            if ( init && thRef.current ) thRef.current.style.width = ( phWidth || "" );
        }, 100);
    }, [ placeholder, init ]);

    // detect value changeable state
    useEffect(() => { 
        if ( (changeable !== undefined || changeable !== null) && changeable === false && inpRef.current ) inpRef.current.disabled = true;
        else if ( inpRef.current ) inpRef.current.disabled = false;
    }, [ changeable ]);

    // make input tag focus
    const setFocus = useCallback(() => {
        if ( (changeable !== undefined || changeable !== null) && changeable === true && inpRef.current ) inpRef.current.focus();
    }, [ changeable ])

    // when focus:
    const inputFocused = useCallback(( e ) => {
        if ((changeable !== undefined || changeable !== null) && changeable === false && inpRef.current ) {
            inpRef.current.blur();
            return;
        }
        setIsFocus(true);
        setTimeout(() => {
            inputFocusedAction( e );
        }, 1);
    }, [ changeable ]);

    useEffect(() => {
        console.log("width", phWidth);
    }, [ phWidth ]);
    
    const inputFocusedAction = useCallback((e) => {
        console.log( phWidth );
        if ( onFocus ) onFocus(e);
        if (!phRef?.current || !thRef.current || v.length > 0) return;
        phRef.current.style.marginTop = "-26px";
        phRef.current.style.fontSize = "14px";
        phRef.current.style.color = "var(--theme-color-C)";
        thRef.current.style.width = phWidth || "40px";
    }, [ changeable, phWidth ])

    // when blured:
    const inputBlured = ( e: any ) => {
        setIsFocus(false);
        if (onBlur) onBlur(e);
        if ( !phRef?.current || !thRef?.current || v.length > 0 ) return;
        phRef.current.style.marginTop = "0px";
        phRef.current.style.setProperty( "font-size", null );
        phRef.current.style.setProperty( "color", null );
        thRef.current.style.setProperty( "width", null );
    }

    return <div className={'global-input ' + (className || "")} onClick={indirectFocus} ref={_ref || undefined}>
        <div className="text-hider" ref={thRef}></div>
        <span className="global-input-placeholder" ref={phRef} onClick={indirectFocus}>{ ph }</span>
        <span className="global-input-onInputDisplayText" style={{ opacity: focused ? 1 : 0 }} onClick={indirectFocus}>{ onInputDisplayText || "" }</span>
        <input type={"text"} ref={inpRef} className="global-input-tag"
            onChange={(e) => setV(e.target.value)}
            onFocus={ inputFocused }
            onBlur={ inputBlured }
            value={v}
            pattern={type == "number" ? "\d*" : ""}
        />
    </div>;
}

export default GlobalInput;