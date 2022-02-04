import { useState, useEffect, useRef, useCallback } from 'react';

// recoil
import { useRecoilState } from 'recoil';
import states from '@src/recoil/states';

// css
import "@styles/components/GlobalInput.css";

function GlobalInput({ 
    className, placeholder = "", phWidth, type, value, _ref, changeable, focusState,
    onBlur, onFocus
}) {

    const [ v, setV ] = useRecoilState( states[value] );
    const [ ph, setPh ] = useState(placeholder || "");
    const [ focused, setIsFocus ] = useState(false);
    const [ init, setInit ] = useState(false);

    const phRef = useRef();
    const thRef = useRef();
    const inpRef = useRef();

    // make input focus when component clicked
    const indirectFocus = (e) => {
        e.stopPropagation();
        setFocus();
    }

    // set input default state blured
    useEffect(() => {
        setInit(true);
    }, []);

    // update focus state when input focus state change
    useEffect(() => {
        if (focusState) focusState[1](focused);
    }, [ focused ]);

    // detect placeholder value change
    useEffect(() => {
        console.log( ph, placeholder, init );
        if ( ph === placeholder ) return;
        if (!phRef?.current?.style || !thRef?.current?.style) return;
        phRef.current.style.opacity = 0;
        setTimeout(() => {
            setPh(placeholder);
            phRef.current.style.opacity = 1;
            if ( init ) thRef.current.style.width = phWidth[0];
        }, 100);
    }, [ placeholder, init ]);

    // detect value changeable state
    useEffect(() => { 
        if ((changeable !== undefined || changeable !== null) && changeable === false) inpRef.current.disabled = "disabled";
        else inpRef.current.disabled = null;
    }, [ changeable ]);

    // make input tag focus
    const setFocus = useCallback(() => {
        if ((changeable !== undefined || changeable !== null) && changeable === true) inpRef.current.focus();
    }, [ changeable ])

    // when focus:
    const inputFocused = useCallback(( e ) => {
        if ((changeable !== undefined || changeable !== null) && changeable === false) {
            inpRef.current.blur();
            return;
        }
        setIsFocus(true);
        setTimeout(() => {
            inputFocusedAction( e );
        }, 1);
    }, [ changeable ]);

    useEffect(() => {
        console.log("width", phWidth[0]);
    }, [ phWidth[0] ]);
    
    const inputFocusedAction = useCallback((e) => {
        console.log( phWidth[0] );
        if ( onFocus ) onFocus(e);
        if (!phRef?.current || v.length > 0) return;
        phRef.current.style.marginTop = "-26px";
        phRef.current.style.fontSize = "14px";
        phRef.current.style.color = "var(--theme-color-C)";
        thRef.current.style.width = phWidth[0] || "40px";
    }, [ changeable, phWidth[0] ])

    // when blured:
    const inputBlured = (e) => {
        setIsFocus(false);
        if (onBlur) onBlur(e);
        if (!phRef?.current || v.length > 0) return;
        phRef.current.style.marginTop = "0px";
        phRef.current.style.fontSize = null;
        phRef.current.style.color = null;
        thRef.current.style.width = null;
    }

    return <div className={'global-input ' + (className || "")} onClick={indirectFocus} ref={_ref}>
        <div className="text-hider" ref={thRef}></div>
        <span className="global-input-placeholder" ref={phRef} onClick={indirectFocus}>{ ph }</span>
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