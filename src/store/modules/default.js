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
import Filter from "../../components/Filter";

const LOGPREV = "prev/LOGPREV";

export const logPrev = createAction({ type: LOGPREV });


const initState = new function() {
    const OTHIS = this;
    this.blocks = [
        {
            title: "#지도",
            
            
        },
        {
            title: "#알지? 나와",
            
        },
        {
            title: "#편ㄱ?",
        },
        {
            title: "#ㅁㄴㅇㄹ",
            
        },
        {
            title: "#그_뭐더라",
            
        },
        {
            title: "#이거? 광고야 >_<",
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