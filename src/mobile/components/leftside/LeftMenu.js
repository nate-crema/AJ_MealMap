import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// css
import "../../../css/mobile_comp/LeftMenu.css";

// img
import full_logo from "../../../assets/img/full_logo@2x.png";
import univ_logo from "../../../assets/img/logo_ajouuniv@2x.png";
import user_icon from "../../../assets/img/user@2x.png";
import verify_icon from "../../../assets/img/verify@2x.png";

function SelectionCategory({ title, contents }) {
    return <div className="selection-category">
        <div className="category-title-area">
            <span className="category-title">{ title }</span>
            <div className="split-bar"/>
            <div className="submenu-area">
                { contents.map((v, i) => <>
                    <div className="submenu-selection" key={ i } onClick={ v.onClick || function() {} }>
                        <span className="submenu-title">{ v.title }</span>
                    </div>
                </>) }
            </div>
        </div>
    </div>
}

function UserProfile({ value }) {

    return <div className="user-profile-block">
        <div className="univ-logo" style={{
            backgroundImage: `url(${ univ_logo })`
        }}></div>
        <div className="user-infos">
            <div className="user-profile-img" style={ value.img ? {
                backgroundImage: `url(${ value.img })`
            } : { 
                backgroundColor: "white"    
            }}></div>
            <span className="username">{ value.name }</span>
            <div className="major-info">
                <p className="college">{ value.department }</p>
                <p className="major">{ value.major }</p>
            </div>
        </div>
        <div className="certificates">
            <div className="cert-open-btn profile">
                <img src={ user_icon }/>
                <span className="cert-open-text">인증</span>
            </div>
            <div className="cert-open-btn vaccinate">
                <img src={ verify_icon }/>
                <span className="cert-open-text">백신</span>
            </div>
        </div>
    </div>
}

function LeftMenu() {

    const { menu: { menu, mopen }, user: { uinfo } } = useSelector( state => state );
    const dispatch = useDispatch();
    const history = useHistory();

    const [ backgorund_display, setBackgroundDisplay ] = useState(false);
    const [ backgorund_visible, setBackgroundVisible ] = useState(false);

    useEffect(() => {
        if (mopen === true) {
            setBackgroundDisplay(true);
            setTimeout(() => {
                setBackgroundVisible(true);
            }, 300);
        } else if (mopen === false) {
            setBackgroundVisible(false);
            setTimeout(() => {
                setBackgroundDisplay(false);
            }, 300);
        }
    }, [ mopen ]);

    const menuCloseHandler = () => {
        dispatch({ type: "menu/SETMOPEN", mopen: false });
    }

    const moveMenu = ( b_menu, s_menu ) => {
        menuCloseHandler();
        history.push(`/${b_menu}` + (s_menu ? `/${s_menu}` : ""));
    }

    return <>
        <div className="mobile-menu-background" style={{
            display: backgorund_display ? "unset" : "none",
            opacity: backgorund_visible ? "1" : "0",
        }} onClick={ menuCloseHandler }/>
        <div className="mobile-menu" style={{
            left: backgorund_visible ? "-2px" : "-100%"
        }}>
            <div className="content-area">
                <div className="full-logo" onClick={() => moveMenu("")}>
                    <img src={ full_logo }/>
                </div>
                <UserProfile value={ uinfo }/>
                <div className="submenus">
                    {/* <SelectionCategory title="기록" contents={[
                        { title: "검색기록", onClick: () => {} },
                        { title: "리뷰기록", onClick: () => {} },
                    ]}/> */}
                    <SelectionCategory title="관리" contents={[
                        { title: "밥약속관리", onClick: () => moveMenu("manage", "meeting") },
                        // { title: "친구관리", onClick: () => {} },
                        // { title: "계정관리", onClick: () => {} },
                    ]}/>
                </div>
                <div className="logout-selection" onClick={ function() {} }>
                    <span className="logout-text">로그아웃</span>
                </div>
            </div>
        </div>
    </>;
}

export default LeftMenu;