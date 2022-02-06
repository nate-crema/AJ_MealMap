import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Subdisplay/InfoDisplay/InfoBlock.css';

// components

// interfaces
import { RestaurantInfo } from "@src/interfaces/Restaurant";

type InfoBlockProps = {
    restaurant: RestaurantInfo
}

type InfoHeaderProps = {
    title: string,
    cat: string,
    worktime: Array<string>
}


const InfoHeader: React.FC<InfoHeaderProps> = ({ title, cat, worktime }) => {

    const [ remain_time, setRemainTime ] = useState<number>( -1 );
    
    useEffect((): void => {
        const currDateObject = new Date(),
        currYear = currDateObject.getFullYear(),
        currMonth = currDateObject.getMonth(),
        currDate = currDateObject.getDate(),
        currTime = currDateObject.getTime(),
        currHour = currDateObject.getHours(),
        currMinute = currDateObject.getMinutes();

        // const restaurantEnd = new Date( `${ currYear }-${ currMonth }-${ currDate } ${ worktime }` );
        // if (
        //     ( restaurantEnd.getTime() < currTime )
        // ) {
        //     // already closed
        // }
        
    }, [ worktime ]);

    return <div className="info-block-header">
        <p className="restaurant-title">{ title }</p>
        <p className="restaurant-category">{ cat }</p>
        <p className="restaurant-time-remain">{ remain_time }</p>
    </div>
}

const InfoBlock: React.FC<InfoBlockProps> = ({ restaurant }) => {
    return <div className="info-block">
        <InfoHeader title={ restaurant.name } cat={ restaurant.cat } worktime={[ "08:30", "02:10" ]}/>
    </div>
};

export default InfoBlock