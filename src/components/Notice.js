import "../css/Notice.css";

// img
import type_info from "../assets/img/notice_info.svg";
import type_warning from "../assets/img/notice_warning.svg";
import type_alert from "../assets/img/notice_alert.svg";

function Notice({ style, notice = {} }) {
    return <div className="noticeArea" style={{ ...style }}>
        <img className="not_img" src={
            (notice?.type <= 2) ? type_info :
            (notice?.type == 3) ? type_warning :
            (notice?.type == 4) ? type_alert :
            type_info
        }/>
        <div className="textArea">
            <span className="notice-title">{ notice?.title }</span>
        </div>
    </div>
}

export default Notice;