import axios from "axios";

const exporters = new function() {
    let OT = this;
        this.initMenu = (title) => {
            // moveLogo
            document.querySelector("div.logoMain").style.left = "50%";
            setTimeout(() => {
                document.querySelector("div.logoMain").style.top = "250px";
            }, 300);
        
            // update grid
            document.querySelector("div.wrapper").style.gridTemplateColumns = "25% 75%";
        
            // set subTitle
            OT.setTitler(title, true, document.querySelector("p.titler"));
        };
        this.changeMenuUI = (pos, pusher, state) => {
            console.log(`changeMenuUI: ${pos}`);
            if (pos < 0 || pos == undefined) return;
            const { def: { blocks, boxSize } } = state;
            if ((boxSize.cvtPoint[0] == 0 ? window.innerWidth : boxSize.cvtPoint[0] == 1 && window.innerHeight) > boxSize.cvtPoint[1]) {
                // if window size is bigger than convert point

                if (pos != 0) {
                    // if position is not undefined
                    // regard user move to specific menu from main page
                    if (document.getElementById("menuRef")) {
                        // close menus
                        document.getElementById("menuRef").style.opacity = 0;
                        document.getElementById("menuRef").style.marginTop = "10px";
                        setTimeout(() => document.getElementById("menuRef").style.display = "none", 30);
                    }
                    // moveLogo
                    document.querySelector("div.logoMain").style.left = "25%";
                    setTimeout(() => {
                        document.querySelector("div.logoMain").style.transition = 'initial'; 
                        document.querySelector("#wrapRef").style.transition = 'initial'; 
                        setTimeout(() => { 
                            document.getElementById("wrapRef").style.gridTemplateColumns = "25% 75%";
                            document.querySelector("div.logoMain").style.left = "50%";
                            setTimeout(() => {
                                document.querySelector("div.logoMain").style.transition = null; 
                                document.querySelector("#wrapRef").style.transition = null; 
                                document.querySelector("div.logoMain").style.top = "250px";
                                // wrapRef.current.style.gridTemplateColumns = null;
                            }, 90);
                        }, 10)
                    }, 50);
        
                    // set subTitle
                    setTitler(blocks[pos-1].title, true, document.getElementById("titleRef"));
    
                    setTimeout(() => {
                        // move page
                        pusher(blocks[pos-1].to || "#");
                    }, 50);
                } else {

                    console.log("regard user move to main page from specific menu");
    
                    // move page
                    pusher("/");
        
                    // moveLogo
                    document.querySelector("div.logoMain").style.top = null;
                    setTimeout(() => {
                        document.querySelector("div.logoMain").style.transition = "initial";
                        setTimeout(() => {
                            document.getElementById("wrapRef").style.gridTemplateColumns = null;
                            document.getElementById("menuRef").style.gridTemplateColumns = "50% 50%";
                            document.querySelector("div.logoMain").style.left = "25%";
                            setTimeout(() => {
                                document.querySelector("div.logoMain").style.transition = null; 
                                document.querySelector("div.logoMain").style.left = null;
                                document.getElementById("menuRef").style.gridTemplateColumns = null;
                            }, 90);
                        }, 10);
                    }, 50);

                    setTitler("", false, document.getElementById("titleRef"));
                }
            } else {
                // if window size is smaller than convert point
                if (pos != 0) {
                    // if position is not undefined
                    // regard user move to specific menu from main page
                    if (document.getElementById("menuRef")) {
                        // close menus
                        document.getElementById("menuRef").style.opacity = 0;
                        document.getElementById("menuRef").style.marginTop = "10px";
                        setTimeout(() => document.getElementById("menuRef").style.display = "none", 30);
                    }
        
                    // set subTitle
                    setTitler(blocks[pos-1].title, true, document.getElementById("titleRef"));
    
                    setTimeout(() => {
                        // move page
                        pusher(blocks[pos-1].to || "#");
                    }, 50);
                } else {

                    console.log("regard user move to main page from specific menu");
    
                    // move page
                    pusher("/");

                    setTitler("", false, document.getElementById("titleRef"));
                }
            }
        };
        this.setTitler = (text, setDisplayStat, titlerObj) => {
            // disable display
        
            if( titlerObj.parentElement.style.display != "none") {
                titlerObj.parentElement.style.top = ((titlerObj.parentElement.style.top.split("px")[0]*1) - 10) + "px";
                titlerObj.parentElement.style.opacity = "0";
            }
            
            setTimeout(() => {
                
                // change text
                titlerObj.innerHTML = text;
            
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
};

export const initMenu = exporters.initMenu;
export const changeMenuUI = exporters.changeMenuUI;
export const setTitler = exporters.setTitler;
export const getNowInfo = exporters.getNowInfo;
export const loadList = exporters.loadList;