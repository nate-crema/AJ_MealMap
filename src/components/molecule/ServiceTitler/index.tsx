import { useState, useEffect, useRef, CSSProperties } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components


// interfaces
type ServiceTitlerProps = {
    title: string,
    ment: string,
    className?: string,
    style?: CSSProperties,
    titleStyle?: CSSProperties,
    mentStyle?: CSSProperties
}



const ServiceTitler: React.FC<ServiceTitlerProps> = ({ 
    // component option
    title, ment,
    // DOM Option
    className, style, titleStyle, mentStyle
}) => {

    // text change control
    const [ titleDisplay, setTitleDisplay ] = useState<boolean>( false );
    const [ mentDisplay, setMentDisplay ] = useState<boolean>( false );

    const [ titleText, setTitleText ] = useState<string>( "" );
    const [ mentText, setMentText ] = useState<string>( "" );

    useEffect((): void => {
        setTitleDisplay( false );
        setTimeout(() => {
            setTitleText( title );
            setTitleDisplay( true );
        }, 300);
    }, [ title ]);

    useEffect((): void => {
        setMentDisplay( false );
        setTimeout(() => {
            setMentText( ment );
            setMentDisplay( true );
        }, 300);
    }, [ ment ]);

    return <div className={ "common-titler" + ( className ? ` ${ className }` : "" ) } style={ style }>  
        <span
            className={ "titler-text titler-title" + ( titleDisplay ? " fadeIn" : " fadeOut" ) }
            style={ titleStyle }
        >{ titleText }</span>
        <span
            className={ "titler-text titler-ment" + ( mentDisplay ? " fadeIn" : " fadeOut" ) }
            style={ mentStyle }
        >{ mentText }</span>
    </div>
};

export default ServiceTitler;