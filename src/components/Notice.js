import { useState, useEffect } from "react";

// css
import "../css/Notice.css";

// img
import type_info from "../assets/img/notice_info.svg";
import type_warning from "../assets/img/notice_warning.svg";
import type_alert from "../assets/img/notice_alert.svg";

function Notice({ window: _window, style, notices = [] }) {

    const [ dp_active, setActive ] = useState(false);
    const [ notice, setNotice ] = useState({});

    const _noticeIdxHandler = (idx) => {
        const n_idx = idx+1;
        _noticeCngHandler(notices[n_idx% (notices.length <= 0 ? 1 : notices.length) ]);
        setTimeout(() => ( window.location.pathname == "/" ) &&  _noticeIdxHandler(n_idx), 5 * 1000);
    }

    const _noticeCngHandler = (cont) => {
        setActive(false);
        setTimeout(() => {
            setNotice(cont);
            setTimeout(() => setActive(true), 150);
        }, 150);
    }

    useEffect(() => {
        _noticeIdxHandler(0);
    }, []);

    return <div className="noticeArea" style={{ ...style }}>
        <img className="not_img" src={
            (notice?.type <= 2) ? type_info :
            (notice?.type == 3) ? type_warning :
            (notice?.type == 4) ? type_alert :
            type_info
        } style={{
            opacity: dp_active ? "1" : "0",
            marginTop: dp_active ? "0px" : "-10px",
        }} />
        <div className="textArea" style={{
            opacity: dp_active ? "1" : "0",
            marginTop: dp_active ? "0px" : "-10px",
        }}>
            <span className="notice-title" style={{
                color: notice?.type == 3 ? "rgb(241 224 13)" : notice?.type == 4 && "#e40a0a"
            }}>{ _window?.width > 700 ? notice?.title : notice?.title?.slice(0, 13) + "..." }</span>
        </div>
    </div>
}

export default Notice;