import { useState, useEffect, useRef, useMemo, useCallback, CSSProperties } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components


// interfaces
import { AlertOption } from "@recoil/types";
import { alertSizeOptions } from "@organism/ServiceAlert/types";
import ServiceButton from "@atom/ServiceButton";
import { ServiceButtonThemes } from "@atom/ServiceButton/types";


const Alert: React.FC = () => {

    // global alert control
    const [ alert_option, setAlertOption ] = useState<AlertOption>({ active: false });
    const { active, title, descriptions, content, buttons, size, backgroundOff } = useMemo<AlertOption>(() => alert_option, [ alert_option ]);

    // window alert overwrite
    const serviceAlertDisplayer = ( options: AlertOption ) => {
        setAlertOption( options );
    }

    useEffect(() => {
        window.ServiceAlert = serviceAlertDisplayer;
    }, []);

    // alert size control
    const MAX_HEIGHT = "80%";
    const alertHeightPresets = {
        "minimum": `calc( ${ MAX_HEIGHT } / 8 )`,
        "quarter": `calc( ${ MAX_HEIGHT } / 4 )`,
        "half": `calc( ${ MAX_HEIGHT } / 2 )`,
        "thirdQuarter": `calc( ${ MAX_HEIGHT } / 4 * 3 )`,
        "full": `calc( ${ MAX_HEIGHT } / 1 `
    };

    // alert display control
    const [ alertDisplay, setAlertDisplay ] = useState<"unset" | "none">( "none" );
    const [ alertHeight, setAlertHeight ] = useState<string>( "0px" );

    useEffect(() => {
        setTimeout(() => {
            if ( active ) {
                setAlertDisplay( "unset" );
                setTimeout(() => {
                    setAlertHeight( alertHeightPresets[ size as alertSizeOptions ] );
                }, 100);
            } else {
                setAlertHeight( "0px" );
                setTimeout(() => {
                    setAlertDisplay( "none" );
                }, 100);
            }
        }, 100);
    }, [ alert_option ]);

    const closeAlert = () => {
        setAlertOption({ active: false });
    }

    // alert background click handler
    const backgroundClickHandler = useCallback(() => {
        if ( active && ( backgroundOff !== false ) ) setAlertOption({ active: false });
    }, [ active, backgroundOff ]);


    return <div className="service-alert-comp" style={{
        display: alertDisplay
    }}>
        <div className={ "service-alert-background" + ( active ? " bg-active" : " bg-deactive" ) } onClick={ backgroundClickHandler } />
        <div className="service-alert-wrap" style={{
            height: alertHeight
        }}>
            {
                ( active ) && <div className="alert-contents">
                    <span className="alert-title" style={ title?.style }>{ title.text }</span>
                    <div className="alert-descriptions">
                        { descriptions.map( ( desc: { text: string, style?: CSSProperties }, i: number ) =>
                            <p key={ i } style={ desc?.style || {} }>{ desc.text }</p>
                        ) }
                    </div>
                    { content || <></> }
                    <div className="alert-buttons">
                        { buttons.map( ( { text, theme, style, onAction }: { text: string, theme?: ServiceButtonThemes, style?: CSSProperties, onAction?: ( closeAlert: () => any ) => any }, i: number ) => 
                            <ServiceButton
                                text={ text }
                                theme={ theme || "defalut" }
                                style={{
                                    width: style?.width || "100%",
                                    height: style?.height || "100%",
                                    ...style
                                }}
                                key={ i }
                                onClick={ ( () => onAction ? onAction( closeAlert ) : closeAlert() ) }
                            />
                        ) }
                    </div>
                </div>
            }
        </div>
    </div>
};

export default Alert