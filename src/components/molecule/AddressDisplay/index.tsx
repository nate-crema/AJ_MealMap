import { useState, useEffect, useRef, MouseEvent, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ServiceCoordinateType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import SvgManager from "@assets/svg";
import { updateShopLocation } from "@api/service";

// interfaces
export type AddressDisplayModeDisplay = "display";
export type AddressDisplayModeEdit = "edit";
export type AddressDisplayMode = AddressDisplayModeDisplay | AddressDisplayModeEdit;

type AddressDisplayProps = {
    modeState: [ AddressDisplayMode, ( v: AddressDisplayMode ) => any ]
    className?: string
    onAddressClick?: ( e: MouseEvent ) => any
    onEditClick?: ( e: MouseEvent, onLocationClicked: ( loc: ServiceCoordinateType ) => any ) => any
}

// components

const AddressDisplay: React.FC<AddressDisplayProps> = ({ modeState, className, onAddressClick, onEditClick }) => {

    const [ info, setInfo ] = useRecoilState<ShopServiceType>( states.shopSpecific );
    
    const [ mode, setMode ] = modeState;
    const [ displayerMode, setDisplayerMode ] = useState<"S"|"L">("S");
    const [ text, setText ] = useState<string>( "" );

    const [ updatedCoordinate, setUpdatedCoordinate ] = useState<ServiceCoordinateType>();

    useEffect(() => {
        console.log( "updated: updatedCoordinate", updatedCoordinate );
    }, [ updatedCoordinate ]);

    // display모드에서 도로명주소 표시
    useEffect(() => {
        if ( mode === "edit" ) return;
        
        if ( info.loc.address ) setText( info.loc.address );
        else {
            // 도로명 주소 변환
            ( async () => {
                const address = await convertCoordToAddr( info.loc );
                setText( address || "주소 변환 중 오류가 발생했습니다." );
            } )()
        }
    }, [ info, mode ]);

    const convertCoordToAddr = async ( loc: ServiceCoordinateType ): Promise<string> => new Promise( ( resolve, reject ) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const { lat, long } = loc;
        geocoder.coord2Address( long, lat, ( res: any, status: any ) => {
            console.log( "geocoder.coord2Address", geocoder.coord2Address, res, status );
            if ( status !== window.kakao.maps.services.Status.OK ) {
                alert("주소 변환 중 오류가 발생했어요.");
                reject();
            }
            resolve(res[0].address.address_name as string);
        } ); 
    });

    // 주소 클릭 이벤트 처리
    const addressDisplayClickHandler = ( e: MouseEvent ) => {
        if ( onAddressClick ) onAddressClick( e );
    }

    // 수정버튼 클릭 이벤트 처리
    const addressEditBtnClickHandler = useCallback( ( e: MouseEvent ) => {
        if ( mode === "display" )
            // 수정모드로 전환 & 외부 클릭 이벤트 핸들러 실행
            setDisplayerModeEdit( e );
        
        else if ( mode === "edit" )
            // 입력받은 주소를 서버로 전송 & 표시모드로 전환
            setDisplayerModeDisplay();
        
    }, [ mode, updatedCoordinate ] );
    
    const setDisplayerModeEdit = ( e: MouseEvent ) => {
        if ( !onEditClick ) return;

        // 외부 클릭 이벤트 핸들러 실행
        onEditClick( e, onLocationClicked );
        
        // 텍스트 변경
        setText( "변경할 가게 위치를 지도에서 클릭해주세요." );
    }

    const setDisplayerModeDisplay = () => {
        submitUpdatedAddress();
        setDisplayerMode("S");
        setMode("display");
    }

    // 지도 클릭으로 입력된 위치에 대한 이벤트 처리
    const onLocationClicked = async ( loc: ServiceCoordinateType ) => {
        setDisplayerMode("L");

        const address = await convertCoordToAddr( loc );
        setText( address || "주소 변환 중 오류가 발생했습니다." );
        setUpdatedCoordinate( { ...loc, address: address || undefined } );
    }

    const submitUpdatedAddress = useCallback( async () => {
        if ( !updatedCoordinate ) return;

        // 업데이트 정보 전송
        const result = await updateShopLocation( info.shopID, updatedCoordinate );
        console.log( "submitUpdatedAddress", result );
        
        // 로컬에 업데이트 내용 적용
        setInfo( prev => ({ ...prev, loc: updatedCoordinate }) );
    }, [ info, updatedCoordinate ]);

    return <div className={ `shop-addressor ${ displayerMode === "S" ? " addressor-small" : " addressor-large" }` + ( className ? ` ${ className }` : "" ) }>
        <div className="textarea-wrap" onClick={ addressDisplayClickHandler }>
        {
            ( mode === "edit" && displayerMode === "L" ) ? <>
                <p className="notice-title">옆에 체크를 눌러 올바른 위치를 알려주세요!</p>
                <p className="notice-desc">변경된 주소는 일정 기간 경과 후 다른 사용자들에게도 적용됩니다 :)</p>
                <p className="notice-update-addr">{ text }</p>
            </> : <>
                <span>{ text }</span>
            </>
        }
        </div>
        <div className="icnarea-wrap" onClick={ addressEditBtnClickHandler }>
            <div className="icn-wrap">
                <SvgManager svg_type={
                    ( mode === "edit" && displayerMode === "L" ) ? "check_circle" : "edit"
                } style={{ "path": { fill: "var(--theme-color-C)" } }}/>
            </div>
        </div>
    </div>
};

export default AddressDisplay;