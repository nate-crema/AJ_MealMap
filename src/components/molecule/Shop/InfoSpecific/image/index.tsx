import { useState, useEffect, useRef, useMemo, MouseEvent, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import SvgManager from "@assets/svg";
import InfoSpecificButton from "../InfoSpecificButton";

// interfaces
type imageInfoSpecificProps = {}

// components


const ImageInfoSpecific: React.FC<imageInfoSpecificProps> = ({}) => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );
    const images = useMemo( () => {
        const keys = Object.keys( info.imgs );

        const image_list =
            Object.values( info.imgs )
            .map( (v, i) => ({ url: v, key: keys[i] }) );

        if ( info.imgs["default"] ) {
            const default_image = image_list.findIndex( v => v.key === "default" );
            image_list.splice( default_image, 1 );
            
            return [
                { url: info.imgs["default"], key: "default" },
                ...image_list
            ];
        }

        return image_list;
    }
    , [ info ] );

    // 이미지 정사각형 표시 구현
    const imgWrapRef = useRef(null);
    const [ boxSize, setBoxSize ] = useState<number>(0);
    useEffect(() => {
        setTimeout(() => {
            const { current }: { current: any } =  imgWrapRef;
            setBoxSize( current.clientWidth/3 );
        }, 100);
    }, []);

    // 이미지 확대기능 구현
    const [ isSelected, setIsSelected ] = useState<string>( "" );

    // 이미지 클릭 이벤트 처리
    const imageClickHandler = useCallback( ( key: string ) => {
        if ( isSelected === key ) setIsSelected("");
        else setIsSelected( key );
    }, [ isSelected ] )

    return <div className="shop-specinfo-image">
        <div className="shop-images-wrap" ref={ imgWrapRef }>
            { images.map( (image, i) => 
                <div className="shop-image-grid" style={{
                    width: `${ boxSize }px`,
                    height: `${ boxSize }px`,
                    top: `${ Math.floor( i / 3 ) * boxSize }px`,
                    left: `${ (i % 3) * 33 }%`,
                    backgroundColor: `rgba(0, 90, 180, ${ 1- (i / images.length) })`,
                }}>
                    <div className={ "shop-image-content" + ( isSelected === image.key ? " image-selected" : "" ) } style={{
                        backgroundImage: `url(${ image.url })`,
                        animation: `.2s ease ${ i * 0.05 }s both image-display-in`
                    }} onClick={ () => imageClickHandler( image.key ) }/>                
                </div>
            ) }
        </div>
        <InfoSpecificButton className="image-add-btn" type="plus">사진 추가하기</InfoSpecificButton>
    </div>
};

export default ImageInfoSpecific