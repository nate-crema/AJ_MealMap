import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/Notification.css";

// api
import { service } from "../../../apis/index";

function Notification({ props }) {

    const [ noti_content, setNotiContent ] = useState({ notice: [], er_notice: [], mealreq: [] });

    useEffect(() => {
        ( async function() {
            const notice = await service.getNotification();
            setNotiContent(prev => ({ ...prev, notice }));
        }() )
    }, []);

    useEffect(() => {
        console.log(noti_content);
    }, [ noti_content ])

    return <div className="mobile-notis">
        <div className="service_noti">
            
        </div>
        <div className="request_noti">

        </div>
    </div>;
}

export default Notification;