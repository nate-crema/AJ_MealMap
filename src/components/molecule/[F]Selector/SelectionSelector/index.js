import { useState, useEffect, useRef, useCallback } from 'react';

// css
import "@styles/components/GlobalSelection.css";

function SelectionBlock({ value, onClick, i = 0 }) {
    return <div
        className="global-selection-block"
        onClick={ (e) => onClick && onClick( e, value ) }
        style={{
            animationDelay: `${0.05 * i}s`
        }}
    >
        <span className="selection-value">{ value.text }</span>
    </div>
}

function SelectionSelector({ 
    className, placeholder = "", phWidth, type, value, _ref, changeable, focusState,
    onBlur, onFocus, selections: selectionList
}) {

    const [ v, setV ] = value;
    const [ ph, setPh ] = useState(placeholder || "");
    const [ focused, setIsFocus ] = useState(false);
    const [ closed, setIsClosed ] = useState(true);
    const [ selections, setSelections ] = useState([]);
    const [ init, setInit ] = useState(false);

    const wrapRef = useRef();
    const phRef = useRef();
    const thRef = useRef();
    const inpRef = useRef();

    // selections clicekd control
    const selectionClicked = ( e, value ) => {
        e.stopPropagation();
        // console.log(e, value);
        setV( value.text );
        closeSelection( value.text );
    }

    // update selections: when value change
    const updateSelections = ( value ) => {
        let filtered = []
        if ( value.length > 0 ) {
            filtered = selectionList.filter( select_value => select_value.text.includes(value) );
        }
        setSelections( filtered );
        // console.log(filtered);
        return filtered;
    }

    useEffect(() => {
        updateSelections( v );
    }, [ v ]);

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
        // console.log( ph, placeholder, init );
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
        setIsClosed(false);
        setTimeout(() => {
            inputFocusedAction( e );
        }, 1);
    }, [ changeable ]);

    const inputFocusedAction = useCallback((e) => {
        if ( onFocus ) onFocus(e);
        if (!phRef?.current || v.length > 0) return;
        wrapRef.current.style.height = `200px`;
        phRef.current.style.marginTop = "-26px";
        phRef.current.style.fontSize = "14px";
        phRef.current.style.color = "var(--theme-color-C)";
        thRef.current.style.width = phWidth[0] || "40px";
    }, [ changeable, phWidth[0] ])

    // when blured:
    const inputBlured = useCallback((e) => {
        setIsFocus(false);
        if (onBlur) onBlur(e);

        // console.log(v, e.target.value);
        // Update UI
        if (!(!phRef?.current || v.length > 0 || e.target.value)) {
            phRef.current.style.marginTop = "0px";
            phRef.current.style.fontSize = null;
            phRef.current.style.color = null;
            thRef.current.style.width = null;
        }
        closeSelection(v);
    }, [ v ])

    const closeSelection = useCallback(( selected ) => {
        setIsClosed(true);

        // console.log(selected, selections, v, !phRef?.current, v.length > 0, selected !== undefined);
        // assign value
        let selections_current = selections.length === 0 ? updateSelections( selected || v ) : selections;
        if ( selections_current.length === 1 ) setV( selections_current[0].text );
        
        // Update UI
        wrapRef.current.style.height = null;

        if (!phRef?.current || v.length > 0 || selected !== undefined) return;
        setIsFocus(false);
        phRef.current.style.marginTop = "0px";
        phRef.current.style.fontSize = null;
        phRef.current.style.color = null;
        thRef.current.style.width = null;
        
    }, [ selections, v ])
    
    useEffect(() => {
        if ( !focused && !closed ) window.addEventListener( "click", closeSelection );
        return () => {
            window.removeEventListener( "click", closeSelection );
        }
    }, [ focused, closed ]);

    return <div className={'global-selection-wrap ' + (className || "")} onClick={indirectFocus} ref={ wrapRef }>
        <div className="global-selection" ref={_ref}>
            <div className="text-hider" ref={thRef}></div>
            <span className="global-selection-placeholder" ref={phRef} onClick={indirectFocus}>{ ph }</span>
            <input type={"text"} ref={inpRef} className="global-selection-tag"
                onChange={(e) => setV(e.target.value)}
                onFocus={ inputFocused }
                onBlur={ inputBlured }
                value={v}
                pattern={type == "number" ? "\d*" : ""}
            />
        </div>
        <div className="selection-area">
            {
                selections.map( ( v, i ) => <>
                    <SelectionBlock 
                        key={ i }
                        i={ i }
                        value={ v }
                        onClick={ selectionClicked }
                    />
                </> )
            }
        </div>
    </div>;
}

export default SelectionSelector;