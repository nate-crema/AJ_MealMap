import { useState, useEffect, useRef } from 'react';

//recoil
import recoil from 'recoil';

//css
import '@styles/DisplayHandler.css';

// interfaces
import { DisplayHandlerProps, WindowSize } from "./interfaces/DisplayHandler";


const DisplayHandler: React.FC<DisplayHandlerProps> = ({ children }) => {

    // window size control
    const [ size, setSize ] = useState<WindowSize>({ width: 0, height: 0 });

    useEffect(() => {
        const updateWindow = (): void => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        updateWindow();
        window.addEventListener( "resize", updateWindow );
        return () => {
            window.removeEventListener( "resize", updateWindow );
        }
    }, []);
    

    return <div className={ "application" + ( ( size.width > 500 ) ? " size_short" : "" ) }>
        { children }
    </div>
};

export default DisplayHandler