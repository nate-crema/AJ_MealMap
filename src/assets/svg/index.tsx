import { useState, useEffect, useRef, useCallback, CSSProperties, useMemo } from "react";
import dompurify from "dompurify";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import { APIResult, getSvgImage } from "@api/service";
import ReactDOM from "react-dom";

// interfaces
type StyleProperties = CSSProperties | { [ key in string ]: CSSProperties };

type SvgManagerProps = {
    svg_type: string
    style?: StyleProperties
}

// components


const SvgManager: React.FC<SvgManagerProps> = ({ svg_type, style }) => {
    
    const [ svgList, setSvgList ] = useRecoilState<{ [ svg_type in string ]: string }>( states.svgList );
    const [ svgDoc, setSvgDoc ] = useState<any>(null);

    const senitizer = dompurify.sanitize;
    const styled_css = useMemo(() => {
        return !style ?
            "" :
            Object.keys( style ).map( v => {
                const convert_text = `${ v }${ JSON.stringify((style as unknown as any)[v]).replaceAll("\"", "").replaceAll(",", ";") }\n`;
                return convert_text;
            } ).toString().replaceAll(",","")
    }, [ style ]);

    const getSvgFromServer = useCallback( async () => {
        const assetsv_result = await getSvgImage( svg_type );
        if ( assetsv_result.result === APIResult.FAILED ) return "";
        
        const { data: svgServerData } = assetsv_result;
        let svgData = senitizer(svgServerData);
        
        const style_sidx = svgData.indexOf("<style type=\"text/css\">");
        const style_eidx = svgData.indexOf("</style>") + 8;

        const prev_style = svgData.slice( style_sidx, style_eidx );
        svgData = svgData.replace( prev_style, `<style type="text/css">${ styled_css }</style>` );
        
        setSvgList( ( prev ) => ({ ...prev, [ svg_type ]: svgData }));
        return svgData as string;
    }, [ svg_type ]);

    useEffect(() => {
        ( async () => {
            const unparsed_svg = svgList[ svg_type ] || await getSvgFromServer();
            setSvgDoc(unparsed_svg);
        } )()
    }, []);

    return <div dangerouslySetInnerHTML={{ __html: svgDoc }}/>;
};

export default SvgManager