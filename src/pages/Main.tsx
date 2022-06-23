import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/pages/Main.css';


// components
import Locator from "@molecule/Locator";
import ServiceTitler from "@molecule/Titler";
import Shops from "@template/Shops";
// import ReviewEntrypoint from "@molecule/ReviewEntrypoint/ReviewEntrypoint";


// interfaces
import { SubdisplayDisplayMode } from "@interfaces/Subdisplay";
import { ShopIDType } from "@interfaces/service/service.data.types/Shop";

const Main: React.FC = () => {

    // login state control
    const name = useRecoilValue( states.name );


    // main text control
    const [ title, setTitle ] = useState<string>( "" );
    const [ ment, setMent ] = useState<string>( "" );

    useEffect(() => {
        const title: string = `${ name }님 안녕하세요!`;
        let ment: string = "맛있는 식사 하세요 ;)";
        const hour: number = new Date().getHours();
        if ( hour < 4 ) ment = "맛있게 먹는 야식은 0칼로리래요 😉";
        else if ( hour < 10 ) ment = "맛있는 아침식사 하세요 ;)";
        else if ( hour < 15 ) ment = "맛있는 점심식사 하세요 ;)";
        else if ( hour < 22 ) ment = "즐거운 저녁식사 하세요 ;)";
        else ment = "맛있게 먹는 야식은 0칼로리래요 😉";

        setTitle( title );
        setMent( ment );
    }, []);


    // url control
    const location = useLocation();
    const setShopSpecific = useSetRecoilState<ShopIDType | undefined>( states.shopSpecific )
    const setSubdisplayDisplayMode = useSetRecoilState<SubdisplayDisplayMode>( states.subdisplayDisplayMode );

    const displayShopSpecific = ( id: ShopIDType ) => {
        setShopSpecific( id );
        setSubdisplayDisplayMode( "INFO/READ" );
    }

    const displayReviewWriter = () => {
        console.log("REVIEW/WRITE");
        setSubdisplayDisplayMode( "REVIEW/WRITE" );
    }

    const unDisplayShopSpecific = () => {
        setShopSpecific( undefined );
        setSubdisplayDisplayMode( "CLOSED" );
    }

    useEffect(() => {
        const paths = location.pathname.split("/");
        if ( paths.length > 2 ) {
            const [ _, func_path, func_params ] = paths;
            if ( func_path === "Shop" ) displayShopSpecific( func_params );
        } else if ( paths.length > 1 && paths[1] === "review" ) displayReviewWriter();
        else unDisplayShopSpecific();
    }, [ location ]);

    return <>
        <Locator/>
        <div className="main-area">
            <ServiceTitler title={ title } ment={ ment } />
            <Shops mode="display"/>
        </div>
        {/* <ReviewEntrypoint/> */}
    </>
};

export default Main;