import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, withRouter, useHistory } from "react-router-dom";

// security keyboard
import SKB from "../security/MobileKeyboard";

// sub-rendering component
import Search from "../mobile_comps/Search";
import SearchNear from "../mobile_comps/SearchNear";
import Specific from "../mobile_comps/Specific";
import Friend from '../mobile_comps/Friend';
import Login from '../mobile_comps/Login';
import Review from '../mobile_comps/Review';
import MobileNotification from './MobileAlert';
import BottomManageMeeting from '../mobile_comps/Sub.Manage.Meeting';
import { BottomMenu } from './BottomMenu';
import { BottomRender } from './BottomRender';

export const MobileBottom = function({ width, height, history }) {

    const mBottomRef = useRef();

    // keyboard state control
    const [ keyboard_open, setKO ] = useState(false);
    const [ m_kboard, setMK ] = useState("");
    const [ m_itype, setMIT ] = useState(0);
    

    return <>
        <BottomMenu mBottomRef={ mBottomRef } history={ history } />
        <BottomRender 
            mBottomRef={ mBottomRef }
            width={ width } height={ height }
            history={ history }
            setKO={ setKO }
            MKBState={ [ m_kboard, setMK ] }
            MITState={ [ m_itype, setMIT ] }
        />
        <MobileNotification/>
        { keyboard_open && 
            <SKB 
                width={500} height={300}
                valueState={[ m_kboard, setMK ]}
                inputType={[ m_itype, setMIT ]}
            />
        }
    </>
}