import { useState, useEffect, useRef, useMemo, MouseEvent, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";

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
                        animation: `.1s ease ${ i * 0.05 }s both image-display-in`
                    }} onClick={ () => imageClickHandler( image.key ) }/>                
                </div>
            ) }
        </div>
        <div className="shop-images-addbtn">
            <div className="icn-wrap">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 500 500">
                    <g>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M491.93,262.65l-241.94-0.13c-4.46,0-8.06-3.61-8.06-8.07l0.13-246.03c0-4.46,3.61-8.06,8.07-8.06
                            s8.06,3.61,8.06,8.07l-0.13,237.97l233.87,0.13c4.46,0,8.06,3.61,8.06,8.07S496.39,262.65,491.93,262.65z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M210.63,262.5L8.06,262.39c-4.46,0-8.06-3.61-8.06-8.07c0-4.46,3.61-8.06,8.07-8.06l202.57,0.11
                            c4.46,0,8.06,3.61,8.06,8.07C218.7,258.89,215.09,262.5,210.63,262.5z"/>
                        <path style={{ fill: "var(--theme-color-C)" }} d="M249.86,500.36c-4.46,0-8.06-3.61-8.06-8.07l0.11-202.21c0-4.46,3.61-8.06,8.07-8.06s8.06,3.61,8.06,8.07
                            l-0.11,202.21C257.93,496.75,254.32,500.36,249.86,500.36z"/>
                    </g>
                </svg>
            </div>
            <span>사진 추가하기</span>
        </div>
    </div>
};

export default ImageInfoSpecific