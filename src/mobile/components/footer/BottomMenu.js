import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, withRouter, useHistory } from "react-router-dom";


// css
import "../../../css/mobile_comp/footer/BottomMenu.css";

export const BottomMenu = function({ mBottomRef, history }) {

    const { user: { uinfo }, map: { stat }, mobile: { bottom_comp: Bcomp, mealfriend } } = useSelector(state => state);


    // bottom menu UI control
    const openMenu = (menu) => {
        mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "rgba(0, 0, 0, 0.1)");
        mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "rgba(0, 0, 0, 0.5)");
        switch(menu) {
            case "friend":
                mBottomRef.current.querySelectorAll(".btn-friend .img path").forEach(v => v.style.fill = "var(--theme-color-C)");
                mBottomRef.current.querySelectorAll(".btn-friend span").forEach(v => v.style.color = "var(--theme-color-C)");
                history.push("/friend");
                return;
            case "review":
                mBottomRef.current.querySelectorAll(".btn-review .img path").forEach(v => v.style.fill = "var(--theme-color-C)");
                mBottomRef.current.querySelectorAll(".btn-review span").forEach(v => v.style.color = "var(--theme-color-C)");
                history.push("/review");
                return;
            case "login":
                mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "var(--theme-color-C)");
                mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "var(--theme-color-C)");
                history.push("/login");
                return;
            default:
                mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "var(--theme-color-C)");
                mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "var(--theme-color-C)");
                return;
        }
    }

    const closeMenu = (menu) => {
        mBottomRef.current.querySelectorAll(".img path").forEach(v => v.style.fill = "var(--theme-color-C)");
        mBottomRef.current.querySelectorAll("span").forEach(v => v.style.color = "var(--theme-color-C)");
        history.push("/");
    }

    return <div className="mobile-bottom" ref={mBottomRef}>
        <div className="contents-area">
            <div className="contents-wrap">
                <div className="btn-bottom btn-friend" onClick={() => Bcomp?.mode == "friend" ? closeMenu() : openMenu("friend")}>
                    { (mealfriend.list.length > 0) ? <>
                        <svg className="img friend_svg" xmlns="http://www.w3.org/2000/svg" width="34.006" height="28.308" viewBox="0 0 34.006 28.308">
                            <g id="Group_381" data-name="Group 381" transform="translate(-439.161 -208.87)">
                                <g id="Group_378" data-name="Group 378" transform="translate(446.008 213.067)">
                                <path id="Path_109" data-name="Path 109" d="M467.554,241.3a.585.585,0,0,1-.586-.585,9.087,9.087,0,1,0-18.174,0,.585.585,0,0,1-1.171,0,10.257,10.257,0,1,1,20.515,0A.585.585,0,0,1,467.554,241.3Z" transform="translate(-447.624 -217.189)" fill="#005bae"/>
                                <path id="Path_110" data-name="Path 110" d="M458.951,225.517a5.73,5.73,0,1,1,5.729-5.73A5.736,5.736,0,0,1,458.951,225.517Zm0-10.289a4.559,4.559,0,1,0,4.559,4.559A4.564,4.564,0,0,0,458.951,215.229Z" transform="translate(-448.693 -214.058)" fill="#005bae"/>
                                </g>
                                <g id="Group_379" data-name="Group 379" transform="translate(458.331 208.87)">
                                <path id="Path_111" data-name="Path 111" d="M478.794,236.235a.585.585,0,0,1-.585-.585,9.092,9.092,0,0,0-6.121-8.592.585.585,0,0,1,.382-1.106,10.262,10.262,0,0,1,6.909,9.7A.585.585,0,0,1,478.794,236.235Z" transform="translate(-464.543 -212.126)" fill="#005bae"/>
                                <path id="Path_112" data-name="Path 112" d="M470.476,219.333a.585.585,0,0,1-.347-1.057,4.561,4.561,0,0,0-3.894-8.077,4.532,4.532,0,0,0-2.341,1.527.585.585,0,1,1-.909-.739,5.73,5.73,0,1,1,7.836,8.233A.581.581,0,0,1,470.476,219.333Z" transform="translate(-462.855 -208.87)" fill="#005bae"/>
                                </g>
                                <g id="Group_380" data-name="Group 380" transform="translate(439.161 208.87)">
                                <path id="Path_113" data-name="Path 113" d="M439.746,236.235a.585.585,0,0,0,.585-.585,9.092,9.092,0,0,1,6.121-8.592.585.585,0,1,0-.382-1.106,10.262,10.262,0,0,0-6.909,9.7A.585.585,0,0,0,439.746,236.235Z" transform="translate(-439.161 -212.126)" fill="#005bae"/>
                                <path id="Path_114" data-name="Path 114" d="M447.445,219.333a.585.585,0,0,0,.347-1.057,4.561,4.561,0,0,1,3.894-8.077,4.532,4.532,0,0,1,2.341,1.527.585.585,0,1,0,.909-.739,5.73,5.73,0,1,0-7.836,8.233A.58.58,0,0,0,447.445,219.333Z" transform="translate(-440.23 -208.87)" fill="#005bae"/>
                                </g>
                            </g>
                        </svg>
                        <span className="btn-name">밥친구 {mealfriend.list.length}명</span>
                    </> : <>
                        <svg id="loupe_1_" className="img friend_svg" data-name="loupe (1)" xmlns="http://www.w3.org/2000/svg" width="26.795" height="27.929" viewBox="0 0 26.795 27.929">
                            <g id="Group_319" data-name="Group 319" transform="translate(-190.79 -66.831)">
                                <g id="Group_319-2" data-name="Group 319" transform="translate(190.79 70.973)">
                                <path id="Path_82" data-name="Path 82" d="M210.452,107.376a.577.577,0,0,1-.577-.577,8.965,8.965,0,0,0-17.931,0,.577.577,0,1,1-1.155,0,10.12,10.12,0,1,1,20.24,0A.577.577,0,0,1,210.452,107.376Z" transform="translate(-190.79 -83.589)" fill="#005bae"/>
                                <path id="Path_83" data-name="Path 83" d="M204.181,85.311a5.653,5.653,0,1,1,5.653-5.653A5.659,5.659,0,0,1,204.181,85.311Zm0-10.151a4.5,4.5,0,1,0,4.5,4.5A4.5,4.5,0,0,0,204.181,75.16Z" transform="translate(-194.061 -74.005)" fill="#005bae"/>
                                </g>
                                <g id="Group_320" data-name="Group 320" transform="translate(202.947 66.831)">
                                <path id="Path_84" data-name="Path 84" d="M231.074,100.583a.578.578,0,0,1-.577-.577,8.969,8.969,0,0,0-6.039-8.477.577.577,0,0,1,.376-1.092,10.126,10.126,0,0,1,6.817,9.569A.578.578,0,0,1,231.074,100.583Z" transform="translate(-217.014 -76.795)" fill="#005bae"/>
                                <path id="Path_85" data-name="Path 85" d="M219.367,77.155a.577.577,0,0,1-.342-1.043,4.5,4.5,0,0,0-3.842-7.969,4.471,4.471,0,0,0-2.309,1.506.577.577,0,0,1-.9-.728,5.653,5.653,0,0,1,10.041,3.563,5.677,5.677,0,0,1-2.31,4.559A.578.578,0,0,1,219.367,77.155Z" transform="translate(-211.848 -66.831)" fill="#005bae"/>
                                </g>
                            </g>
                        </svg>
                        <span className="btn-name">친구</span>
                    </> }
                </div>
                <div className="btn-bottom btn-route" onClick={() => Bcomp?.mode == "route" ? closeMenu() : openMenu("route")}>
                    <svg className="img route_svg" xmlns="http://www.w3.org/2000/svg" width="28.104" height="27.959" viewBox="0 0 28.104 27.959">
                    <g id="Group_321" data-name="Group 321" transform="translate(-66.066 -66.336)">
                        <path id="Path_86" data-name="Path 86" d="M70.283,105.97c-1.179,0-4.217-7.037-4.217-8.613a4.217,4.217,0,0,1,4.217-4.218h0A4.222,4.222,0,0,1,74.5,97.355v0C74.5,98.933,71.462,105.97,70.283,105.97Zm0-11.7h0a3.089,3.089,0,0,0-3.088,3.089c0,1.5,2.182,5.873,3.089,7.217.908-1.344,3.089-5.719,3.089-7.217v0A3.092,3.092,0,0,0,70.284,94.268Z" transform="translate(0 -11.675)" fill="#005bae"/>
                        <path id="Path_87" data-name="Path 87" d="M105.131,79.167c-1.179,0-4.217-7.037-4.217-8.613a4.223,4.223,0,0,1,4.216-4.219h0a4.222,4.222,0,0,1,4.217,4.216v0C109.349,72.13,106.31,79.167,105.131,79.167Zm0-11.7h0a3.093,3.093,0,0,0-3.088,3.09c0,1.5,2.182,5.873,3.089,7.217.908-1.344,3.089-5.719,3.089-7.217v0A3.092,3.092,0,0,0,105.131,67.465Z" transform="translate(-15.179)" fill="#005bae"/>
                        <path id="Path_88" data-name="Path 88" d="M84.338,93.254a.565.565,0,0,1-.038-1.128c.051,0,5.164-.384,6.672-3.116a.773.773,0,0,0,.134-.647c-.221-.492-1.579-.8-2.57-1.022-1.333-.3-2.483-.56-2.878-1.334a1.25,1.25,0,0,1,0-1.1c1.027-2.386,5.422-3.453,5.92-3.567a.564.564,0,1,1,.252,1.1c-1.2.275-4.456,1.335-5.135,2.914-.007.018-.044.107-.028.139.154.3,1.338.568,2.121.745,1.425.322,2.9.654,3.351,1.66a1.8,1.8,0,0,1-.175,1.655c-1.805,3.272-7.348,3.681-7.584,3.7Z" transform="translate(-7.713 -6.53)" fill="#005bae"/>
                    </g>
                    </svg>
                    <span className="btn-name">경로</span>
                </div>
                <div className="btn-bottom btn-review" onClick={() => Bcomp?.mode == "review" ? closeMenu() : openMenu("review")}>
                    <svg className="img review_svg" xmlns="http://www.w3.org/2000/svg" width="23.944" height="29.262" viewBox="0 0 23.944 29.262">
                        <g id="Group_322" data-name="Group 322" transform="translate(-257.523 -68.462)">
                            <path id="Path_89" data-name="Path 89" d="M269.495,106.5c-6.031,0-11.171-4.792-11.955-11.146a2.13,2.13,0,0,1,.509-1.675,1.9,1.9,0,0,1,1.435-.656h20.023a1.9,1.9,0,0,1,1.434.656,2.133,2.133,0,0,1,.51,1.675C280.666,101.713,275.526,106.5,269.495,106.5ZM259.484,94.313a.628.628,0,0,0-.472.222.845.845,0,0,0-.2.666c.7,5.711,5.3,10.018,10.68,10.018s9.975-4.307,10.68-10.018a.843.843,0,0,0-.2-.666.627.627,0,0,0-.472-.222Z" transform="translate(0 -8.781)" fill="#005bae"/>
                            <path id="Path_90" data-name="Path 90" d="M259.421,80.432a.482.482,0,0,1-.482-.487l.028-2.6a1.659,1.659,0,0,1-.742-.553,2.267,2.267,0,0,1-.452-1.388V70.49a1.881,1.881,0,0,1,1.68-2.028h20.262a1.881,1.881,0,0,1,1.68,2.028V75.4a1.88,1.88,0,0,1-1.68,2.027l-16.026,0-3.985,2.911A.48.48,0,0,1,259.421,80.432Zm.033-3.968a.482.482,0,0,1,.482.487l-.022,2.043,3.335-2.437a.483.483,0,0,1,.285-.093l16.183,0c.388,0,.716-.487.716-1.063V70.49c0-.577-.328-1.064-.716-1.064H259.453c-.389,0-.716.487-.716,1.064V75.4a1.321,1.321,0,0,0,.25.8.621.621,0,0,0,.466.266h0Z" transform="translate(-0.089 0)" fill="#005bae"/>
                            <path id="Path_91" data-name="Path 91" d="M278.774,73.634H261.892a.482.482,0,1,1,0-.964h16.882a.482.482,0,0,1,0,.964Z" transform="translate(-1.389 -1.504)" fill="#005bae"/>
                            <path id="Path_92" data-name="Path 92" d="M272.514,76.856H261.892a.482.482,0,1,1,0-.964h10.622a.482.482,0,1,1,0,.964Z" transform="translate(-1.389 -2.656)" fill="#005bae"/>
                        </g>
                    </svg>
                    <span className="btn-name">리뷰</span>
                </div>
            </div>
        </div>
    </div>
}