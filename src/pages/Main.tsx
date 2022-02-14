import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/pages/Main.css';


// components
import Locator from "@src/components/Locator";
import ServiceTitler from "@src/components/ServiceTitler";
import Restaurants from "@src/components/Restaurants";
import ReviewEntrypoint from "@components/ReviewEntrypoint";


// interfaces
import { SubdisplayDisplayMode } from "@interfaces/Subdisplay";
import { RestaurantID } from "@interfaces/Restaurant";

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
    const setRestaurantSpecific = useSetRecoilState<RestaurantID | undefined>( states.restaurantSpecific )
    const setSubdisplayDisplayMode = useSetRecoilState<SubdisplayDisplayMode>( states.subdisplayDisplayMode );

    const displayRestaurantSpecific = ( id: RestaurantID ) => {
        setRestaurantSpecific( id );
        setSubdisplayDisplayMode( "INFO/READ" );
    }

    const displayReviewWriter = () => {
        console.log("REVIEW/WRITE");
        setSubdisplayDisplayMode( "REVIEW/WRITE" );
    }

    const unDisplayRestaurantSpecific = () => {
        setRestaurantSpecific( undefined );
        setSubdisplayDisplayMode( "CLOSED" );
    }

    useEffect(() => {
        const paths = location.pathname.split("/");
        if ( paths.length > 2 ) {
            const [ _, func_path, func_params ] = paths;
            if ( func_path === "restaurant" ) displayRestaurantSpecific( func_params );
        } else if ( paths.length > 1 && paths[1] === "review" ) displayReviewWriter();
        else unDisplayRestaurantSpecific();
    }, [ location ]);

    return <>
        <Locator/>
        <div className="main-area">
            <ServiceTitler title={ title } ment={ ment } />
            <Restaurants type="display"/>
        </div>
        <ReviewEntrypoint/>
    </>
};

export default Main;