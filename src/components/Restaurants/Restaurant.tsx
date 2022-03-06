import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import '@styles/components/Restaurants/Restaurant.css';

// api
import { getRestaurant, getRestaurantList } from "@src/api/service";

// components


// interfaces
import { RestaurantList, RestaurantCompInfo, RestaurantID, RestaurantInfo } from "@interfaces/Restaurant";
import { RestaurantAPIResult } from "@interfaces/api/service";
import { SubdisplayDisplayMode } from "@interfaces/Subdisplay";
import { RestaurantCompType } from "@src/interfaces/Restaurant/comp";


type RestaurantProps = {
    id: RestaurantID
    mode: RestaurantCompType
    onClick?: ( info: RestaurantCompInfo ) => void
}


const Restaurant: React.FC<RestaurantProps> = ({ id, mode, onClick }) => {

    // restaurant info control
    const restaurants = useRecoilValue<RestaurantList>( states.restaurants );
    const [ info, setInfo ] = useState<RestaurantCompInfo>( { loaded: false } );

    const getRestaurantInfo = async (): Promise<RestaurantCompInfo> => {
        const restaurant: RestaurantAPIResult = await getRestaurant( id );
        if ( restaurant.result === "FAILED" ) return { loaded: false };
        return restaurant.data;
    }

    useEffect(() => {
        ( async (): Promise<void> => {
            const restaurant = restaurants[ id ] || await getRestaurantInfo();
            setInfo({
                loaded: true,
                ...restaurant
            });
        } )();
    }, [ id ]);


    // restaurant block click handler
    const navigate = useNavigate();

    const restaurantBlockClickHandler = useCallback( () => {
        if ( onClick ) return onClick( info );
        displayRestaurantSpecific();
    }, [ info ] );
    
    const displayRestaurantSpecific = () => {
        navigate(`/restaurant/${ id }`);
    }

    return ( info.loaded ) ?
        <div className="restaurant-block" onClick={ restaurantBlockClickHandler } style={{
            height: ( mode === "review" ) ? "50px" : "180px"
        }}>
            {
                ( mode === "display" ) && <>
                    <div className="restaurant-image">
                        { info.img.map( ( url: string, i: number, imgs: Array<string> ) => ( i <= 4 ) && <div style={
                            Object.assign(
                                [ 0, 1 ].includes( imgs.length ) ? {
                                    gridColumnStart: 1,
                                    gridColumnEnd: 5,
                                    gridRowStart: 1,
                                    gridRowEnd: 3
                                } :
                                [ 2 ].includes( imgs.length ) ? {
                                    gridColumnStart: i * 2 + 1,
                                    gridColumnEnd: i * 2 + 3,
                                    gridRowStart: 1,
                                    gridRowEnd: 3
                                } :
                                [ 3 ].includes( imgs.length ) ? {
                                    gridColumnStart: Math.floor( ( i + 1 ) / 2 ) * 2 + 1,
                                    gridColumnEnd: Math.floor( ( i + 1 ) / 2 ) * 2 + 3,
                                    gridRowStart: i || 1,
                                    gridRowEnd: ( ( i + 1 ) % 2 ) + 2
                                } :
                                [ 4 ].includes( imgs.length ) ? {
                                    gridColumnStart: ( !i ) ? 1 : ( i % 2 ) ? 3 : 4,
                                    gridColumnEnd: ( !i ) ? 3 : Math.floor( i / 3 ) ? 5 : ( i + 3 ),
                                    gridRowStart: Math.floor( i / 3 ) ? 1 : 2,
                                    gridRowEnd: i % 3 ? 2 : 3
                                } :
                                {
                                    gridColumnStart: ( !i ) ? 1 : ( i % 2 ) ? 3 : 4,
                                    gridColumnEnd: ( !i ) ? 3 : ( i % 2 ) ? 4 : 5,
                                    gridRowStart: Math.floor( i / 3 ) + 1,
                                    gridRowEnd: ( !i ) ? 3 : Math.floor( ( i - 1 ) / 2 ) + 1
                                }
                            , { backgroundImage: `url(${ url })`, backgroundPosition: "center" })
                        } key={ i }/> ) }
                    </div>
                </>
            }
            <div className="restaurant-text">
                <span className="restaurant-title">{ info.name }</span>
                <span className="restaurant-duration">걸어서 { Math.floor( info.duration / 60 ) }분</span>
                <span className="restaurant-review">{ info.short_review || info.common_review }</span>
            </div>
        </div>
    : <></>
};

export default Restaurant