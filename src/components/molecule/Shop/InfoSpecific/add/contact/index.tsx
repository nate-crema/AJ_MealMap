import { useState, useEffect, useRef, useCallback } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import InfoSpecificAddCommon, { StageAction } from "../common";
import GlobalInput from "@molecule/Input/GlobalInput";
import { addContact } from "@api/service";
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";

// interfaces
type ContactInfoAddProps = {
    info: ShopServiceType
}

// components


const ContactInfoAdd: React.FC<ContactInfoAddProps> = ({ info }) => {


    // 표시 텍스트 관련
    const [ title, setTitleText ] = useState<string>("연락처 추가");
    const [ titleActive, setTitleActive ] = useState<boolean>(true);
    const [ subtitle, setSubtitleText ] = useState<string>("연락처에 대한 정보를 입력해주세요");
    const [ subtitleActive, setSubtitleActive ] = useState<boolean>(true);
    const [ inputActive, setInputActive ] = useState<boolean>(true);

    const setTitle = ( val: string ) => {
        setTitleActive(false);
        setTimeout(() => {
            setTitleText( val );
            setTimeout(() => {
                setTitleActive(true);
            }, 150);
        }, 150);
    }

    const setSubtitle = ( val: string ) => {
        setSubtitleActive(false);
        setTimeout(() => {
            setSubtitleText( val );
            setTimeout(() => {
                setSubtitleActive(true);
            }, 150);
        }, 150);
    }

    // 입력값 관련
    const [ contact, setContact ] = useState<string>("");
    const [ nickname, setNickname ] = useState<string>("");


    // 상단 단계별 버튼 관련
    const setOpenInfo = useSetRecoilState( states.infoSpecificOpenInfo );
    const setInfo = useSetRecoilState( states.shopSpecific );

    const registerContact = useCallback( async () => {
        if ( contact.length === 0 ) {
            alert("'연락처'는 필수로 입력해야해요!");
            return false;
        } else {
            const formed_contact = contact.split("-").length === 3 ? contact : contact.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
            if ( !/^(?:(010-\d{4})|(0(3[1]))-(\d{3,4}))-(\d{4})$/.test( formed_contact ) ) {
                if ( /^(\d{3})-\d{4}-(\d{4})$/.test( formed_contact ) ) {
                    alert("대학교가 속한 지역의 국번(031)이나 개인 전화번호(010)만 등록할 수 있어요.");
                } else alert("'연락처'의 형식이 올바르지 않아요. 다시 입력해주세요.");
                return false;
            } else if ( nickname && /^a-zA-Z0-9가-힣/.test( nickname ) ) {
                alert("연락처 별명에 올바르지 않은 문자가 있어요. 다시 입력해주세요.");
                return false;
            }
        }

        setInputActive(false);
        setTitle("연락처 등록중");
        setSubtitle("연락처를 등록하는 중이에요. 잠시만 기다려주세요");

        const update_result = await addContact( info.shopID, contact.split("-").length === 3 ? contact : contact.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`), nickname );
        const { result } = update_result;
        if ( result === 'FAILED' ) {
            alert("연락처를 추가하는데 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
        } else {
            const { data: { result } } = update_result;
            setTitle("연락처 추가됨");
            setSubtitle("입력해주신 연락처가 추가됐어요! 추가된 연락처는 일정 기간 경과 후 다른 사용자들에게도 보여져요.");

            setInfo(( prev ) => ( !prev ) ? undefined : ({ ...prev, contact: result }) )
        }

    }, [ contact, nickname ] ) ;

    const contact_add_stagelist:Array<StageAction> = [
        { text: "등록하기", afterAction: registerContact },
        { text: "연락처로 돌아가기", size: 130, afterAction: async () => setOpenInfo( "CONTACT" ) }
    ];

    return <InfoSpecificAddCommon stage_list={ contact_add_stagelist }>
        <div className="shop-specinfo-contact-add">
            <div className={ "title-wrap" + ( !inputActive ? " input-deactivated" : "" ) }>
                <p className={ "add-title" + ( titleActive ? " text-active" : " text-deactive" )}>{ title }</p>
                <p className={ "add-subtitle" + ( subtitleActive ? " text-active" : " text-deactive" )}>{ subtitle }</p>
            </div>
            <div className={ "input-wrap" + ( !inputActive ? " input-deactivated" : "" ) }>
                <GlobalInput className="input-contact" valueState={ [ contact, setContact ] } placeholder="연락처" phWidth={ [ "55px", () => {} ] } changeable={ inputActive }/>
                <GlobalInput className="input-nickname" valueState={ [ nickname, setNickname ] } placeholder="연락처 별명" phWidth={ [ "80px", () => {} ] } onInputDisplayText="(선택입력)" changeable={ inputActive }/>
            </div>
        </div>
    </InfoSpecificAddCommon>
};

export default ContactInfoAdd