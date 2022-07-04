import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import MapHandler from "@molecule/MapHandler/MapHandler";
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import SvgManager from "@assets/svg";

// interfaces
type LocationInfoSpecificProps = {}

// components


const LocationInfoSpecific: React.FC<LocationInfoSpecificProps> = ({}) => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );

    const mapLoadHandler = ( ref: any ) => {
        setTimeout(() => {  
            console.log("LocationInfoSpecific: relayout");
            ref.current.relayout();

            ref.current.panTo(new window.kakao.maps.LatLng( info.loc.lat, info.loc.long ));
        }, 200);
    }

    const locationTextClickHandler = useCallback( () => {
        if ( !info.loc.address ) return;

        window.navigator.clipboard.writeText( info.loc.address )
        .then( () => {
            alert("복사됨");
        } );
    }, [ info ]);

    return <div className="shop-specinfo-location">
        <MapHandler 
            className="minimap" type="display"
            option={{
                location: info.loc,
                level: 3,

                markers: [
                    {
                        position: new window.kakao.maps.LatLng( info.loc.lat, info.loc.long ),
                        image: new window.kakao.maps.MarkerImage(
                            `https://assets.mail.mealmap.app/api/host/shared/RMTRIUHOHTWUMWUGRQGT`,
                            new window.kakao.maps.Size(30, 50),
                            { offset: new window.kakao.maps.Point(27, 69) }
                        )
                    }
                ]
            }}
            onMapLoaded={ mapLoadHandler }
        />
        <div className="shop-location-text" onClick={ locationTextClickHandler }>
            <span>{ info.loc.address || "도로명주소 변환중..." }</span>
        </div>
    </div>
};

export default LocationInfoSpecific