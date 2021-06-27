import "../css/Logo.css";
import img_A from "../assets/img/img_a.gif";


function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}


function Logo({ style, className, onClick }) {
    return (
        <div style={Object.assign({ cursor: "pointer" }, style)} className={`logoWrapper` + (className ? ` ${className}` : '')}
            onClick={onClick}
        >
            <img className="imgMain" src={img_A}/>
            <p className="seviceName">아대 밀맵</p>
            <p className="seviceNameEn" style={{
                width: getTextWidth("아대 밀맵", "bold 40px arial")
            }}>AJ Meal Map</p>
        </div>
    )
}

export default Logo;