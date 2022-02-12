import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Restaurants.css';

// api
import { getRestaurantList } from "@api/service";

// components


// interfaces
import { RestaurantListAPIResult } from "@interfaces/api/service";
import { RestaurantList } from "@interfaces/Restaurant";
import { Location } from "@interfaces/recoil/State";
import Restaurant from "./Restaurants/Restaurant";
type RestaurantsProps = {
    type: string
}


const Restaurants: React.FC<RestaurantsProps> = ({ type }) => {

    // restaurant list control
    const { lat, long } = useRecoilValue<Location>( states.location );
    const [ restaurants, setRestaurants ] = useRecoilState<RestaurantList>( states.restaurants );

    const getRestaurantInfos = async (): Promise<RestaurantList> => {
        const restaurant_list: RestaurantListAPIResult = await getRestaurantList( lat, long );
        if ( restaurant_list.result === "FAILED" ) return {};
        return restaurant_list.list;
    }

    useEffect(() => {
        ( async () => {
            if ( lat < 0 || long < 0 ) return;
            const restaurant_list = await getRestaurantInfos();
            console.log(restaurant_list);
            setRestaurants( restaurant_list );
        } )()
    }, [ lat, long ]);
    
    return <div className="restaurants-list">
        {
            Object.values(restaurants).map( 
                restaurant => <Restaurant key={ restaurant.restaurant_id } id={ restaurant.restaurant_id }/>
            )
        }
    </div>
};

export default Restaurants