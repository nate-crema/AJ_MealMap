import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../../../css/MobileKeyboard.css";

function MobileKeyboard({ 
    /* eslint-disable */
    valueState: [ v, setV ] = useState(""),
    inputType: [ itype, setIT ] = useState(0), // 0: number | 1: string
    /* eslint-enable */
 }) {
     
    // leon-sans font initialization
    const [ leon, setLF ] = useState([]);
    const [ _ctx, setCtx ] = useState([]);
    const [ sfary, setSF ] = useState([]);
    const [ kb_len, setKBlen ] = useState(0);
    const keyboardRef=  useRef();

    
    const [sw, setSW] = useState(50);
    const [sh, setSH] = useState(20);
    const pixelRatio = 10;

    Array.prototype.shuffle = function() {
        const r = [];
        const isPushed = Array.from(new Array(10), (x, i) => false);
        let end_cnt = 0;
        while(1) {
            const randomVal = Math.floor(((Math.random() * 100) * new Date().getTime()) % this.length);
            if (!isPushed[randomVal]) {
                r.push(this[randomVal]);
                isPushed[randomVal] = true;
                end_cnt++;
            }
            if (end_cnt >= this.length) break;
        }
        return r;
        // array.sort(() => Math.random() - 0.5);
        // 출처: https://7942yongdae.tistory.com/96 [프로그래머 YD]
    }

    useEffect(() => {
        switch(itype) {
            case 0:
                const w = keyboardRef.current.getBoundingClientRect().width / 5 * 90 / 100;
                const h = keyboardRef.current.getBoundingClientRect().height / 3 * 90 / 100;
                console.log(w, h);
                setSW(w);
                setSH(h);
                setKBlen(10);
                const sf = Array.from(new Array(10), (x, i) => i).shuffle();
                setSF(sf);
                leonFullInit(w, h, sf);
                return;
            default:
                return;
        }
    }, [ itype ]);

    const leonInit = (i, w, h, icase) => {

        // console.log("i", i, icase[i]);
        
        const leonAnimate = (t) => {
            // requestAnimationFrame(leonAnimate);

            ctx.clearRect(0, 0, w, h);

            // value rendering
            const x = (w - leon.rect.w) / 2;
            const y = (h - leon.rect.h) / 2;
            
            leon.position(x, y);
            leon.draw(ctx);

            // watermark rendering
            const w_x = 0;
            const w_y = (h - leon.rect.h)/2;

            /* eslint-disable */
            const wmark_po = [-20, 0, 20, 40]
            for (var i = 0; i < 4; i++) {
                const watermark = new LeonSans({
                    text: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'ajoumeal'].shuffle().slice(0, 7).concat(['ajoumeal']).toString().replace(/\,/g, ''),
                    color: [
                        '#cccccc', '#dddddd', '#eeeeee',
                        '#cccccc', '#dddddd', '#eeeeee',
                        '#cccccc', '#dddddd', '#eeeeee',
                        '#cccccc', '#dddddd', '#eeeeee',
                    ].shuffle().slice(0, 3),
                    size: 10,
                    weight: 100 * (Math.floor(Math.random()*10)%2 + 2)
                })
                
                watermark.position(w_x, w_y + wmark_po[i]);
                watermark.draw(ctx);
            }
            /* eslint-enable */


            /* eslint-disable */
            // let i, total = l.drawing.length;
            // for (i = 0; i < total; i++) {
            //     TweenMax.fromTo(l.drawing[i], 1.6, {
            //         value: 0
            //     }, {
            //         delay: i * 0.05,
            //         value: 1,
            //         ease: Power4.easeOut
            //     });
            // }
            /* eslint-enable */
        };

        const canvas = document.getElementsByClassName("ments-display")[i];
        console.log(canvas);

        if (!canvas) throw new Error("canvas not found");
        const ctx = canvas.getContext("2d");

        canvas.width = w * pixelRatio;
        canvas.height = h * pixelRatio;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.scale(pixelRatio, pixelRatio);

        /* eslint-disable */
        const leon = new LeonSans({
            text: icase[i] + "",
            color: ['#000000'],
            size: 37,
            weight: 500
        })
        /* eslint-enable */


        requestAnimationFrame(leonAnimate);
    };
  
    const leonFullInit = (w, h, icase) => setTimeout(() => {
        const canvases = document.getElementsByClassName("ments-display");
        for (var i = 0; i < canvases.length; i++) leonInit(i, w, h, icase);
    }, 150);

    return <div className="seckeyboard-mobile">
        <div className="btns-cover" ref={keyboardRef} style={
            ( itype == 0 ) ? {
                gridTemplateRows: "repeat(3, 33%)",
                gridTemplateColumns: "repeat(5, calc(19% + 2px))"
            } 
            : {}
        }>
            { (itype == 0) && Array.from(new Array(kb_len), (x, i) => i).map((_, _i) => <div className="click_btns">
                <canvas className="ments-display" onClick={() => `${setV(sfary[_i])}`}/>
            </div>) }
        </div>
    </div>;
}

export default MobileKeyboard;