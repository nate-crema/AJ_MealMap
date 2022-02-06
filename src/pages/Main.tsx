import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/pages/Main.css';


// components
import Locator from "@src/components/Locator";
import ServiceTitler from "@src/components/ServiceTitler";
import Restaurants from "@src/components/Restaurants";


// interfaces

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

    return <>
        <Locator/>
        <div className="main-area">
            <ServiceTitler title={ title } ment={ ment } />
            <Restaurants type="display"/>
        </div>
    </>
};

export default Main;