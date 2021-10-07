import { useState, useEffect } from "react";

// css
import "../css/Notification.css";

function Notification({ type, content, display, option, time }) {

    const [ text, setText ] = useState("");
    const [ text_opacity, setTO ] = useState(0);
    const [ text_display, setTD ] = useState(false);
    const [ timebar_len, setTL ] = useState(100);
    const [ rm, setR ] = useState(false);

    const enableText = () => {
        setTD(true);
        setTO(1);
    }

    const disableText = (timeout = 300) => {
        try {
            setTO(0);
            setTimeout(() => {
                setTD(false);
            }, timeout);
        } catch(e) {
            console.error(e);
        }
    }

    const updateText = (text) => {
        // disable display
        disableText()
        setTimeout(() => {
            console.log(`text`, text);
            setText(text);
            enableText();
        }, 300);
    }

    const updateTextReserve = (schedule) => {
        if (schedule.type == "infinite") {
            let cnt = 0;
            return setInterval(() => {
                updateText(schedule.texts[cnt%(schedule.texts.length)]);
                cnt++;
            }, schedule.interval || 1500);
        } else {
            const loop = (i) => {
                console.log(schedule[i]);
                updateText(schedule[i].text)
                if (schedule.length-1 > i) setTimeout(() => {
                    loop(i+1);
                }, schedule[i].interval);
            }
            loop(0);
        }
    }

    useEffect(() => {
        switch(display) {
            // case "remain":
                
            case "timeout":
                setTimeout(() => {
                    setR(true);
                }, time*1000);
        }
        switch(option?.text) {
            case "per-line":
                let schedule = [];
                let texts = content.split("\n");
                texts.forEach(text => schedule.push({
                    text,
                    interval: 1500
                }));
                updateTextReserve(schedule);
                break;
            case "all":
            default:
                setText(content);
                enableText();
                break;
        }
        setTimeout(() => {
            setTL(0);
        }, 100);
    }, []);
    
    
    return <div className={`notification_inarea`} id={new Date().getTime()}
        style={{
            animationName: rm ? "noti_outarea" : "noti_inarea"
        }}
    >
        <div className="notification">
            <span className="text" style={{
                opacity: text_opacity,
                display: text_display ? "block" : "none"
            }}>{ text }</span>
            <div className="timeout-bar" style={{
                width: timebar_len+"%",
                transitionDuration: time+"s"
            }}></div>
        </div>
    </div>
}

function NotificationArea() {

    const [ noti_arrs, setNA ] = useState([]);
    const [ noti_comps, setNC ] = useState({});

    const addNotification = (noti) => {
        setNC(prevs => {
            const rets = prevs;
            rets[noti.keys] = <Notification keys={noti.keys} type={noti.type} display={noti.display} content={noti.content} time={noti.time} option={noti.option}/>;
            return rets;
        })
        setNA(prev => [ ...prev, noti.keys ]);
    }

    useEffect(() => {
        addNotification({
            type: 0,
            display: "timeout",
            time: 3.5,
            content: "[공지] 현재 지도는 베타테스트 버전입니다!\n이용에 참고 부탁드립니다.",
            option: {
                text: "per-line"
            },
            keys: new Date().getTime()
        });
    }, []);
    
    return <div className="noti_wrap">
        { noti_arrs.map(v => noti_comps[v]) }
    </div>
    
}

export default NotificationArea;