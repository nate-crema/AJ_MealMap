import { useState, useEffect, useRef } from 'react';

//recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import states from './recoil/states';

//css
import '@styles/DisplayHandler.css';

// interfaces
import { DisplayHandlerProps, WindowSize } from "./interfaces/DisplayHandler";
import { SubdisplayDisplayMode, SubdisplayMountMode } from './interfaces/Subdisplay';
import Subdisplay from './components/template/Subdisplay';


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

    // application size control
    const [ packing, setPacking ] = useState<boolean>( false );
    const [ subdisplayMountMode, setSubdisplayMountMode ] = useRecoilState<SubdisplayMountMode>( states.subdisplayMountMode );
    const subdisplayDisplayMode = useRecoilValue<SubdisplayDisplayMode>( states.subdisplayDisplayMode );

    useEffect((): void => {
        if ( size.width > 850 ) setSubdisplayMountMode( "UNMOUNTED" );
        else setSubdisplayMountMode( "MOUNTED" );

        if ( size.width > 400 ) setPacking( true );
        else setPacking( false );
    }, [ size ]);

    // application preload animation block control
    const [ init, setInit ] = useState( false );
    
    useEffect(() => {
        setTimeout(() => {
            setInit( true );
        }, 300);
    }, []);
    

    return <div className="application-control">
        <div className={ 
            "application"
            + ( ( packing ) ? " size_short" : "" ) 
            + ( ( subdisplayMountMode === "UNMOUNTED" && subdisplayDisplayMode !== "CLOSED" ) ? " subdisplay-unmounted" : " subdisplay-mounted" )
        }>
            { children }
        </div>
        <div className={ 
            "application" 
            + ( ( packing ) ? " size_short" : "" ) 
            + ( ( subdisplayMountMode === "UNMOUNTED" && subdisplayDisplayMode !== "CLOSED" ) ? " unmounted" : " mounted" ) 
            + ( ( subdisplayDisplayMode === "CLOSED" ) ? " subdisplay-closed" : " subdisplay-opened" ) 
        } style={{ animationDuration: !init ? "0s" : undefined }}>
            <Subdisplay/>
        </div>
    </div>
};

export default DisplayHandler