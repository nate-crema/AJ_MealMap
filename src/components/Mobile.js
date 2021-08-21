
// css
import { useEffect, useState } from "react";
import "../css/Mobile.css";


function MobileStyler({ children }) {

    const [ open, setOpen ] = useState(false); // menu wide open state

    function _scrollHandler() {
        let doc = document.getElementById("scroll-detection");
        if (open) {
            if (doc.scrollTop >= 100) setOpen(true);
            else if (doc.scrollTop <= -50) setOpen(false);
        } else {
            if (doc.scrollTop >= 100) setOpen(true);
            else if (doc.scrollTop <= -50) setOpen(false);
            document.querySelector("zz").innerHTML = document.getElementById("scroll-detection").scrollTop;
        }
    }

    useEffect(() => {
        let doc = document.getElementById("scroll-detection");
        if (doc) doc.addEventListener("scroll", _scrollHandler );
        return () => {
            if (doc) doc.removeEventListener("scroll", _scrollHandler);
        }
    }, []);

    return  (
        <div className="scroll-detection" id="scroll-detection" style={open ? {
            height: "100vh",
            top: "20px"
        } : {}}>
            <div className="style-background-mobile"> {/* css on Wrapper.css */}
                { children }
            </div>
        </div>
    )
    
}

export default MobileStyler;