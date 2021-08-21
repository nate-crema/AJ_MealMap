import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// components
import Block from "../components/Block";
import Notice from "../components/Notice";

// css
import "../css/Index.css";
import "../css/Global.css";

// img
import bI_1 from "../assets/img/blockImg1.png";
import bI_2 from "../assets/img/blockImg2.png";
import bI_3 from "../assets/img/blockImg3.png";
import bI_4 from "../assets/img/blockImg4.png";
import bI_5 from "../assets/img/blockImg5.png";
import bI_6 from "../assets/img/blockImg6.png";

function Index({ window: { width, height }, history }) {

    const { menu: { menu } } = useSelector(state => state);
    const dispatch = useDispatch();

    const menu_list = [
        {
            title: "지도",
            route: "/mealmap",
            isOpen: true,
            isOpenMsg: `2021년 8월 21일 9:00 서비스 시작 😆`,
            displayTitle: "#지도",
            displaySubtext: `???: 니들이 밥집을 알아?\n동기와 선배들이 정리한\n아대 밥좌표`,
            css: {},
            img: bI_1,
            menu_index: 2,
            subTextCss: { fontSize: "14px" },
            imgCss: { width: "180px", height: "auto", bottom: "10px", right: "10px" },
            // subarea: <Filter filter={this.filter}/>
        },
        {
            title: "술지도",
            route: "/alcholmap",
            isOpen: false,
            displayTitle: "#알지? 나와",
            displaySubtext: `밥먹자는데, 과연 밥만 먹을까?\n주변 술집정도는 상.식.`,
            css: {},
            img: bI_2,
            menu_index: -100,
            imgCss: { top: "50%", right: "30px", transform: "translate(0, -50%)", width: "180px", height: "auto" },
            subTextCss: { fontSize: "12px" }
        },
        {
            title: "편의점지도",
            route: "/cvs",
            isOpen: false,
            displayTitle: "#편ㄱ?",
            displaySubtext: `자취생에게\n편의점은 필수지`,
            css: {},
            img: bI_3,
            menu_index: -100,
            imgCss: { top: "50%", right: "30px", transform: "translate(0, -50%)", width: "130px", height: "auto" },
            subTextCss: { fontSize: "14px" },
        },
        {
            title: "룰렛",
            route: "/random",
            isOpen: false,
            displayTitle: "#ㅁㄴㅇㄹ",
            displaySubtext: `뭐먹지?\n뇌빼고 룰렛 한판`,
            css: {},
            img: bI_4,
            menu_index: -100,
            imgCss: { bottom: "10px", right: "10px", width: "180px", height: "auto" }
        },
        {
            title: "검색",
            route: "#",
            isOpen: false,
            displayTitle: "#그_뭐더라",
            displaySubtext: `검색.\nprint(결과)`,
            css: {},
            img: bI_5,
            menu_index: -100,
            imgCss: { bottom: "10px", right: "10px", width: "180px", height: "auto" },
            clickUnavailable: true
        },
        {
            title: "광고블록",
            route: "#",
            isOpen: false,
            displayTitle: "#이거? 광고야 >_<",
            displaySubtext: `서버 운영비인데..\nAdBlock은 좀..풀어줘`,
            css: {},
            img: bI_6,
            menu_index: -100,
            imgCss: { bottom: "10px", right: "10px", width: "180px", height: "auto" },
            subTextCss: { fontSize: "14px" },
            clickUnavailable: true
        }
    ]

    const notice_grid_css = [
        // for notice
        { gridRow: "2 / 4" },
        { gridRow: "" },
        { gridRow: "3 / 5" },
        { gridRow: "4 / 6" },
        { gridRow: "5 / 7" },
        { gridRow: "" },
    ]

    const grid_css = [
        { gridRow: "1 / 3" },
        { gridRow: "" },
        { gridRow: "2 / 4" },
        { gridRow: "3 / 5" },
        { gridRow: "4 / 6" },
        { gridRow: "" },
    ]

    // useEffect(() => {
    //     const go_menu = menu_list.find((e, i) => e.menu_index === menu);
    //     history.push(go_menu.route);
    // }, [ menu ]);

    // notice control

    const [ notice, setNotice ] = useState(false);

    useEffect( async () => {
        try {
            const { data: notices } = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST}/notice`);
            console.log("notice", notices);
            if (notices.list.length <= 0) return;
            else setNotice(notices.list);
        } catch(e) {
            console.error(e);
        }
    }, []);


    return <div className="serviceArea menuBlocksCover" id="serviceArea" doc-contype="menu-content">
        <div className="menuBlocks" style={ ( width > 700 ) ? {
            gridTemplateColumns: "calc(50%) calc(50%)",
            // gridTemplateRows: "240px 100px 130px 110px 230px"
            gridTemplateRows: "100px 240px 100px 130px 110px 230px"
        } : {
            gridTemplateColumns: "100%",
            gridTemplateRows: "repeat(6, 250px)"
        }}>
            { notice && notice.map(not => <Notice notice={not} style={{ gridRow: "1", gridColumn: "1 / 3" }}/>)}
            { menu_list.map( ( block_info, i ) => 
                <Block key={i} indexing={i} style={
                    ( width > 700 ) ? 
                        notice ? 
                            { ...block_info.css, ...notice_grid_css[i] } : 
                            { ...block_info.css, ...grid_css[i] } 
                        : 
                    { ...block_info.css } 
                } info={block_info} onClick={() => dispatch({ type: "menu/SETMENU", menu: block_info.menu_index })}/>
            ) }
        </div>
    </div>
}

export default Index;