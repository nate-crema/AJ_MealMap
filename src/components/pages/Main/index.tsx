import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';


// components
import Locator from "@molecule/[F]Main/Locator";
import ServiceTitler from "@molecule/ServiceTitler";
import ShopList from "@organism/ShopList";
// import ReviewEntrypoint from "@molecule/ReviewEntrypoint/ReviewEntrypoint";


// interfaces
import { SubdisplayDisplayMode } from "@pages/Subdisplay/types";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { getShopInfoByShopID } from "@api/service";
import ServiceSearcher from "@molecule/[F]Main/ServiceSearcher";

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
    const shops = useRecoilValue<Array<ShopServiceType>>( states.shops );
    const setShopSpecific = useSetRecoilState<ShopServiceType | undefined>( states.shopSpecific )
    const setSubdisplayDisplayMode = useSetRecoilState<SubdisplayDisplayMode>( states.subdisplayDisplayMode );

    const displayShopSpecific = async ( id: ShopIDType ) => {
        const shop = shops.filter( v => v.shopID === id )[0] || await getShopInfoByShopID(id);
        setShopSpecific( shop );
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


    // design control
    const is_search_active = useRecoilValue<boolean>( states.isSearchActive );

    return <div className="main-page">
        <div className={ `pagemode-main ${ is_search_active ? "pagemode-deactive" : "pagemode-active" }` }>
            <Locator className="mainpage-locator"/>
            <div className="main-area">
                <ServiceTitler title={ title } ment={ ment } className="mainpage-titler"/>
                <ShopList mode="display" className="main-shoplist"/>
            </div>
        </div>
        <div className={ `pagemode-search ${ is_search_active ? "pagemode-active" : "pagemode-deactive" }` }>
            <ServiceSearcher className="mainpage-searcher"/>
        </div>
        {/* <ReviewEntrypoint/> */}
    </div>
};

export default Main;