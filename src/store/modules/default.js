import { createAction, handleActions } from 'redux-actions';

// assets

// img
import bI_1 from "../../assets/img/blockImg1.png";
import bI_2 from "../../assets/img/blockImg2.png";
import bI_3 from "../../assets/img/blockImg3.png";
import bI_4 from "../../assets/img/blockImg4.png";
import bI_5 from "../../assets/img/blockImg5.png";
import bI_6 from "../../assets/img/blockImg6.png";

// components - fnc for menu
import Filter from "../../components/filter";

const LOGPREV = "prev/LOGPREV";

export const logPrev = createAction({ type: LOGPREV });


const initState = new function() {
    const OTHIS = this;
    this.blocks = [
        {
            title: "#지도",
            subtext: `???: 니들이 밥집을 알아?\n동기와 선배들이 정리한\n아대 밥좌표`,
            img: bI_1,
            subTextCss: { fontSize: "14px" },
            imgCss: {
                width: "180px",
                height: "auto",
                position: "absolute",
                bottom: "20px",
                right: "20px"
            },
            to: "/mealmap",
            subarea: <Filter filter={this.filter}/>
        },
        {
            title: "#알지? 나와",
            subtext: `밥먹자는데, 과연 밥만 먹을까?\n주변 술집정도는 상.식.`,
            img: bI_2,
            subTextCss: { fontSize: "12px" },
        },
        {
            title: "#편ㄱ?",
            subtext: `자취생에게\n편의점은 필수지`,
            img: bI_3,
            subTextCss: { fontSize: "14px" },
        },
        {
            title: "#ㅁㄴㅇㄹ",
            subtext: `뭐먹지?\n뇌빼고 룰렛 한판`,
            img: bI_4
        },
        {
            title: "#그_뭐더라",
            subtext: `검색.\nprint(결과)`,
            img: bI_5,
            clickUnavailable: true
        },
        {
            title: "#이거? 광고야 >_<",
            subtext: `서버 운영비인데..\nAdBlock은 좀..풀어줘`,
            img: bI_6,
            subTextCss: { fontSize: "14px" },
            clickUnavailable: true
        },
    ];
    this.boxSize = {
        Mobile: ["100%", "250px"],
        cvtPoint: [0, 1000], // width: 1000
        // default: [400, 300, "px"],
        default: ["auto", "auto"]
    };
    this.size = {
        width: window.innerWidth,
        height: window.innerHeight,
        eventHandler: function(fnc) {
            window.addEventListener("resize", fnc)
            return () => window.removeEventListener("resize", fnc);
        }
    };
    this.prev = undefined;
}

// export reducer

export default handleActions({
    [ LOGPREV ]: (state, action) => {
        return {
            ...state,
            prev: action.v || undefined
        }
    }
}, initState);