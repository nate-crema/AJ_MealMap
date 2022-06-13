import { useState, useEffect, useRef } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Restaurants.css';

// api
import { getRestaurantList } from "@api/service";

// components
import Restaurant from "../../organism/Restaurant";

// interfaces
import { RestaurantListAPIResult } from "@interfaces/api/service";
import { RestaurantCompInfo, RestaurantInfo, RestaurantList } from "@interfaces/Restaurant";
import { Location } from "@interfaces/recoil/State";
import { RestaurantCompDisplayType, RestaurantCompReviewType, RestaurantCompType } from "@interfaces/Restaurant/comp";

type RestaurantsProps = {
    mode: RestaurantCompReviewType
    onBlockClick?: ( info: string | null, index: number ) => void
} | {
    mode: RestaurantCompDisplayType
    onBlockClick?: ( info: RestaurantCompInfo | null, index: number ) => void
}


const Restaurants: React.FC<RestaurantsProps> = ({ mode, onBlockClick }) => {

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
            // if ( lat < 0 || long < 0 ) return;
            const restaurant_list = await getRestaurantInfos();
            console.log(restaurant_list);
            setRestaurants( restaurant_list );
        } )()
    }, [ lat, long ]);


    // restaurant block click handler
    const restaurantBlockClickHandler = ( info: RestaurantCompInfo, index: number ) => {
        if ( !info.loaded || !onBlockClick ) return;
        return onBlockClick( info.restaurant_id as (string & RestaurantCompInfo) | null, index );
    };
    
    return <div className={ `restaurants-list listmode-${ mode }` }>
        {
            Object.values(restaurants).map( 
               
                ( restaurant, index: number ) => <Restaurant
                    key={ restaurant.restaurant_id }
                    id={ restaurant.restaurant_id }
                    mode={ mode }
                    onClick={ ( mode === "review" ) ? ( info: RestaurantCompInfo ) => restaurantBlockClickHandler( info, index ) : undefined }
                />
            )
        }
        {
            (mode === "review") && <div className="restaurant-notfound restaurant-block"
                key={ "restaurant_notfound" }
                onClick={ onBlockClick ? ( () => onBlockClick( null, -1 ) ) : undefined }
            >
                <span>찾는 식당이 없어요</span>
            </div>
        }
    </div>
};

export default Restaurants