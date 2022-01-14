import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/mobile_comp/Sub.Manage.Meeting.css";

function BottomManageMeeting({ props }) {

    const titleRef = useRef();
    const titleImgRef = useRef();
    const [ menu_title, setMenuTitle ] = useState("밥약속 관리");
    const [ description, setDescription ] = useState("초대장을 선택해 더 많은 정보를 확인하세요!");

    return <div className="meeting-manage-menu">
        <div className="title-area">
            <img ref={titleImgRef}/>
            <span className="menu_title" ref={titleRef}>{ menu_title }</span>
            <span className="description">{ description }</span>
        </div>
    </div>;
}

export default BottomManageMeeting;