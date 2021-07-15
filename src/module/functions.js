import axios from "axios";

// assets

// img
import bI_1 from "../assets/img/blockImg1.png";
import bI_2 from "../assets/img/blockImg2.png";
import bI_3 from "../assets/img/blockImg3.png";
import bI_4 from "../assets/img/blockImg4.png";
import bI_5 from "../assets/img/blockImg5.png";
import bI_6 from "../assets/img/blockImg6.png";

// components - fnc for menu
import Filter from "../components/Filter";

const exporters = new function() {

    let GT = this;

    // DOM API
    let menuRef, logoRef, wrapRef, titleRef, titlerRef, wrapperRef, isRefReady = false;

    DOM_Refinder();

    
    // DOM Refinder

    function DOMPender() {
        return new Promise((resolve, reject) => {
            DOM_Refinder();
            setTimeout(() => {
                if (isRefReady) resolve(true);
                else DOMPender();
            }, 100);
        })
    }

    function DOM_Refinder() {
        if (!menuRef) menuRef_Refinder(); 
        if (!logoRef) logoRef_Refinder(); 
        if (!wrapRef) wrapRef_Refinder(); 
        if (!titleRef) titleRef_Refinder(); 
        if (!titlerRef) titlerRef_Refinder(); 
        if (!wrapperRef) wrapperRef_Refinder(); 
    }

    function menuRef_Refinder() {
        if (!menuRef) {
            // console.log("menuRef: not found -> reload");
            menuRef = document.getElementById("menuRef"); 
            if (!menuRef) setTimeout(menuRef_Refinder, 100);
            else readySetter();
        }
    }
    function logoRef_Refinder() {
        if (!logoRef) {
            // console.log("logoRef: not found -> reload");
            logoRef = document.querySelector("div.logoMain"); 
            if (!logoRef) setTimeout(logoRef_Refinder, 100);
            else readySetter();
        }
    }
    function wrapRef_Refinder() {
        if (!wrapRef) {
            // console.log("wrapRef: not found -> reload");
            wrapRef = document.querySelector("#wrapRef"); 
            if (!wrapRef) setTimeout(wrapRef_Refinder, 100);
            else readySetter();
        }
    }
    function titleRef_Refinder() {
        if (!titleRef) {
            // console.log("titleRef: not found -> reload");
            titleRef = document.querySelector("#titleRef"); 
            if (!titleRef) setTimeout(titleRef_Refinder, 100);
            else readySetter();
        }
    }
    function titlerRef_Refinder() {
        if (!titlerRef) {
            // console.log("titlerRef: not found -> reload");
            titlerRef = document.querySelector("p.titler"); 
            if (!titlerRef) setTimeout(titlerRef_Refinder, 100);
            else readySetter();
        }
    }
    function wrapperRef_Refinder() {
        if (!wrapperRef) {
            // console.log("wrapperRef: not found -> reload");
            wrapperRef = document.querySelector("div.wrapper"); 
            if (!wrapperRef) setTimeout(wrapperRef_Refinder , 100);
            else readySetter();
        }
    }

    function readySetter() {
        if (
            (
                window.location.href != "/" || (window.location.href == "/" && menuRef)
            ) && (
                logoRef && wrapRef && titleRef && titlerRef && wrapperRef
            )
        ) isRefReady = true;
    }

    this.menuList = [
        {
            title: "메인화면",
            route: "/",
            displayTitle: ""
        },
        {
            title: "지도",
            route: "/mealmap",
            displayTitle: "#지도",
            displaySubtext: `???: 니들이 밥집을 알아?\n동기와 선배들이 정리한\n아대 밥좌표`,
            img: bI_1,
            subTextCss: { fontSize: "14px" },
            imgCss: {
                width: "180px",
                height: "auto",
                position: "absolute",
                bottom: "20px",
                right: "20px"
            },
            subarea: <Filter filter={this.filter}/>
        },
        {
            title: "술지도",
            route: "/alcholmap",
            displayTitle: "#알지? 나와",
            displaySubtext: `밥먹자는데, 과연 밥만 먹을까?\n주변 술집정도는 상.식.`,
            img: bI_2,
            subTextCss: { fontSize: "12px" }
        },
        {
            title: "룰렛",
            route: "/random",
            displayTitle: "#ㅁㄴㅇㄹ",
            displaySubtext: `뭐먹지?\n뇌빼고 룰렛 한판`,
            img: bI_4
        },
        {
            title: "편의점지도",
            route: "/cvs",
            displayTitle: "#편ㄱ?",
            displaySubtext: `자취생에게\n편의점은 필수지`,
            img: bI_3,
            subTextCss: { fontSize: "14px" },
        },
        {
            title: "광고블록",
            route: "#",
            displayTitle: "#이거? 광고야 >_<",
            displaySubtext: `서버 운영비인데..\nAdBlock은 좀..풀어줘`,
            img: bI_6,
            subTextCss: { fontSize: "14px" },
            clickUnavailable: true
        },
        {
            title: "검색",
            route: "#",
            displayTitle: "#그_뭐더라",
            displaySubtext: `검색.\nprint(결과)`,
            img: bI_5,
            clickUnavailable: true
        }
    ]
    this.initMenuN = async (listId) => {
        // DOM API Load Breaker
        await DOMPender();
        // moveLogo
        logoRef.style.left = "50%";
        setTimeout(() => {
            logoRef.style.top = "250px";
        }, 300);
    
        // update grid
        wrapperRef.style.gridTemplateColumns = "25% 75%";
    
        // set subTitle
        GT.setTitler(GT.menuList[listId].title, true, titleRef);
    };
    this.changeMenuUI = async (listId, pusher) => {
        // DOM API Load Breaker
        await DOMPender();
        if (listId < 0 || listId == undefined) return;
        if (listId == undefined) listId = 0;
        
        // block Informations load
        const { menuList, boxSize } = GT;


        if ((boxSize.cvtPoint[0] == 0 ? window.innerWidth : boxSize.cvtPoint[0] == 1 && window.innerHeight) > boxSize.cvtPoint[1]) {
            // if window size is bigger than convert point

            if (listId != 0) {
                // if position is not undefined
                // regard user move to specific menu from main page
                if (menuRef) {
                    // close menus
                    menuRef.style.opacity = 0;
                    menuRef.style.marginTop = "10px";
                    setTimeout(() => menuRef.style.display = "none", 30);
                }
                // moveLogo
                logoRef.style.left = "25%";
                setTimeout(() => {
                    logoRef.style.transition = 'initial'; 
                    wrapRef.style.transition = 'initial'; 
                    setTimeout(() => { 
                        wrapRef.style.gridTemplateColumns = "25% 75%";
                        logoRef.style.left = "50%";
                        setTimeout(() => {
                            logoRef.style.transition = null; 
                            wrapRef.style.transition = null; 
                            logoRef.style.top = "250px";
                        }, 90);
                    }, 10)
                }, 50);
    
                // set subTitle

                console.log(listId);
                console.log(menuList);
                console.log(menuList[listId]);
                setTitler(menuList[listId].displayTitle, true, titlerRef);

                setTimeout(() => pusher(menuList[listId].route || "#"), 50);
            } else {

                console.log("regard user move to main page from specific menu");

                // move page
                pusher("/");
    
                // moveLogo
                logoRef.style.top = null;
                setTimeout(() => {
                    logoRef.style.transition = "initial";
                    setTimeout(() => {
                        wrapRef.style.gridTemplateColumns = null;
                        menuRef.style.gridTemplateColumns = "50% 50%";
                        logoRef.style.left = "25%";
                        setTimeout(() => {
                            logoRef.style.transition = null; 
                            logoRef.style.left = null;
                            menuRef.style.gridTemplateColumns = null;
                        }, 90);
                    }, 10);
                }, 50);

                setTitler("", false, titleRef);
            }
        } else {
            // if window size is smaller than convert point
            if (listId != 0) {
                // if position is nGT undefined
                // regard user move to specific menu from main page
                if (menuRef) {
                    // close menus
                    menuRef.style.opacity = 0;
                    menuRef.style.marginTop = "10px";
                    setTimeout(() => menuRef.style.display = "none", 30);
                }
    
                // set subTitle
                setTitler(menuList[listId].displayTitle, true, titleRef);

                setTimeout(() => {
                    // move page
                    pusher(menuList[listId-1].to || "#");
                }, 50);
            } else {

                // console.log("regard user move to main page from specific menu");

                // move page
                pusher("/");

                setTitler("", false, titleRef);
            }
        }
    };
    this.setTitler = async (text, setDisplayStat, titlerObj) => {
        // DOM API Load Breaker
        await DOMPender();
        // disable display
    
        if( titlerObj.parentElement.style.display != "none") {
            titlerObj.parentElement.style.top = ((titlerObj.parentElement.style.top.split("px")[0]*1) - 10) + "px";
            titlerObj.parentElement.style.opacity = "0";
        }
        
        setTimeout(() => {
            
            // change text
            titlerObj.innerHTML = text || titlerObj.textContent;
        
            if (setDisplayStat == true) {
                // able display
                titlerObj.parentElement.style.display = "block";
                setTimeout(() => {
                    titlerObj.parentElement.style.top = ((titlerObj.parentElement.style.top.split("px")[0]*1) + 10) + "px";
                    titlerObj.parentElement.style.opacity = "1";
                }, 200);
            } else titlerObj.parentElement.style.display = "none";
        }, 200);
    };
    this.getNowInfo = () => { // 오늘 날짜 정보 가져오기
        return new function() {
            const dayTextList = [
                [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ],
                [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            ];
            this.today = new Date();
            this.dayNumber = this.today.getDay();
            this.dayTextKO = dayTextList[0][this.dayNumber];
            this.dayTextEN = dayTextList[1][this.dayNumber];
            this.date = this.today.getDate();
            this.month = this.today.getMonth()+1;
            this.year = this.today.getFullYear();
            this.isYun = false;
            this.h = this.today.getHours();
            this.m = this.today.getMinutes();
            this.s = this.today.getSeconds();
            if (this.year%4 == 0) 
                if (this.year%100 == 0) 
                    if (this.year%400 == 0) this.isYun = true;
                    else this.isYun = false;
                else this.isYun = true;
            else this.isYun = false;
            this.weekCutDate = [1];
            const monthStartDay = new Date(`2021.${this.month}.1`).getDay()
            let recPushDate = -1;
            const lastDayMonth = this.month == 2 ? (this.isYun ? 29 : 28 ) : ((this.month%2 == 1 ? (this.month <= 7) : (this.month > 7)) ? 31 : 30);
            if (monthStartDay == 6) {
                this.weekCutDate.push(2);
                recPushDate = 2;
            } else if (monthStartDay == 0) {
                recPushDate = 1;
            } else {
                this.weekCutDate.push(8-monthStartDay)
                recPushDate = 8-monthStartDay;
            } 
            while(true) {
                if (recPushDate < this.date) this.nthWeekToday = this.weekCutDate.length;
                if (recPushDate+7 <= lastDayMonth) {
                    recPushDate+=7;
                    this.weekCutDate.push(recPushDate);
                } else break;
            }
        }
    };

    // map
    this.loadList = () => {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:3001/api/shopList`)
            .then(({data}) => {
                console.log(data);
                resolve(data);
            })
            .catch((e) => {
                reject(e);
            })
        })
    }

    // register event
    
    this.displayWidth = (function() {
        return window.innerWidth;
    })()

    this.displayHeight = (function() {
        return window.innerHeight;
    })()

    this.boxSize = {
        Mobile: ["100%", "250px"],
        cvtPoint: [0, 1000], // width: 1000
        // default: [400, 300, "px"],
        default: ["auto", "auto"]
    };

    function _resizeHandler() {
        
    }

    window.addEventListener("resize", _resizeHandler);
    // return () => window.removeEventListener("resize", _resizeHandler);
    
};

// new
export const initMenuN = exporters.initMenuN;
export const changeMenuUI = exporters.changeMenuUI;
export const setTitler = exporters.setTitler;
export const getNowInfo = exporters.getNowInfo;
export const loadList = exporters.loadList;
export const constant = {
    menuList: exporters.menuList,
    boxSize: exporters.boxSize
};