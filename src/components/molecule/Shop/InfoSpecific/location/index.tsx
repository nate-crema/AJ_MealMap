import { useState, useEffect, useRef, useCallback, MouseEvent } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import MapHandler from "@molecule/MapHandler/MapHandler";
import { ServiceCoordinateType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import SvgManager from "@assets/svg";
import AddressDisplay, { AddressDisplayMode } from "@molecule/AddressDisplay";
import { MapHandlerCommonOptions, MapHandlerOptionDisplay, MapHandlerOptionInput, MapOnPlaceClickedFunction } from "@interfaces/MapHandler";
import { getSvgImageURI } from "@api/service";

// interfaces
type LocationInfoSpecificProps = {}

// components


const LocationInfoSpecific: React.FC<LocationInfoSpecificProps> = ({}) => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );

    // 지도 상태관리
    const [ mapMode, setMapMode ] = useState<"display" | "input">("display");
    const [ mapOption, setMapOption ] = useState<Partial<MapHandlerCommonOptions & MapHandlerOptionDisplay> | Partial<MapHandlerCommonOptions & MapHandlerOptionInput>>({});

    useEffect(() => {
        ( async () => {
            const locator_imguri_result = await getSvgImageURI( "locator_mapmode" );
            if ( locator_imguri_result.result === "FAILED" )
                throw new Error("URI ERROR");

            const { data: locator_img_code } = locator_imguri_result;
            const locator_img_uri = process.env.REACT_APP_ASSETSV_URI + "icn/" + locator_img_code;
            // console.log("locator_img_uri", locator_img_uri);

            if ( mapMode === "display" ) setMapOption({
                location: info.loc,
                level: 1,
    
                markers: [
                    {
                        position: new window.kakao.maps.LatLng( info.loc.lat, info.loc.long ),
                        image: new window.kakao.maps.MarkerImage(
                            locator_img_uri,
                            new window.kakao.maps.Size(30, 50),
                            { offset: new window.kakao.maps.Point(27, 69) }
                        )
                    }
                ]
            })
            else if ( mapMode === "input" ) setMapOption({
                onPlaceClicked: mapClickHandler,
            })
            else setMapOption({});
        } )()
    }, [ info, mapMode ]);

    // 컴포넌트 크기 변화로 인한 지도 밀림현상 해결을 위한 함수
    const mapLoadHandler = ( ref: any ) => {
        setTimeout(() => {  
            console.log("LocationInfoSpecific: relayout");
            ref.current.relayout(); // 지도 위치 재연산
            ref.current.panTo(new window.kakao.maps.LatLng( info.loc.lat, info.loc.long )); // 중심에 맞게 지도 위치 부드럽게 이동
        }, 200);
    }

    // 주소 클릭 이벤트 처리
    const locationTextClickHandler = useCallback( () => {
        if ( !info.loc.address ) return;

        window.navigator.clipboard.writeText( info.loc.address )
        .then( () => {
            alert("복사됨");
        } );
    }, [ info ]);

    // 수정버튼 클릭 이벤트 처리
    const [ addressDisplayMode, setAddressDisplayMode ] = useState<AddressDisplayMode>( "display" );
    const addressDisplayLocationClickedHandler = useRef<( loc: ServiceCoordinateType ) => any>();
    
    const locationEditClickHandler = ( e: MouseEvent, onLocationClicked: ( loc: ServiceCoordinateType ) => any ) => {
        setAddressDisplayMode( "edit" );
        setMapMode( "input" );

        addressDisplayLocationClickedHandler.current = onLocationClicked;
    }

    const mapClickHandler: MapOnPlaceClickedFunction = ( location ) => {
        if ( !addressDisplayLocationClickedHandler.current ) return;
        addressDisplayLocationClickedHandler.current( location );
    }

    // 수정 -> 표시모드 전환 시 지도에서 더이상 수정되지 않도록 모드 자동 변경
    useEffect(() => {
        if ( addressDisplayMode === "display" )
            setMapMode("display");
    }, [ addressDisplayMode ]);

    return <div className="shop-specinfo-location">
        <MapHandler 
            className="minimap" type={ mapMode }
            option={ mapOption }
            onMapLoaded={ mapLoadHandler }
        />
        <AddressDisplay
            className="shop-address-displayer"
            modeState={ [ addressDisplayMode, setAddressDisplayMode ] }
            onAddressClick={ locationTextClickHandler }
            onEditClick={ locationEditClickHandler }
        />
    </div>
};

export default LocationInfoSpecific