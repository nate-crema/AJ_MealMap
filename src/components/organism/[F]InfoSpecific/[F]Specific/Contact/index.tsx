import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';

// components
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import ContactBlock from "@molecule/[F]Blocks/ContactBlock";
import InfoSpecAddButton from "@molecule/[F]Buttons/InfoSpecAddButton";

// interfaces
type ContactInfoSpecificProps = {
    info: ShopServiceType
}

const ContactInfoSpecific: React.FC<ContactInfoSpecificProps> = ({ info }) => {

    const contacts = useMemo( () => Object.keys(info.contact).map( v => ({ contact_name: v, contact: info.contact[v] || "" })), [ info ] );

    useEffect(() => console.log( "ContactInfoSpecific", info.contact ), [ info ]);

    return <div className="shop-specinfo-contact">
        <div className="contacts-wrap">
            { contacts.map( contact_info => <>
                <ContactBlock contactInfo={ contact_info }/>
            </> ) }
        </div>
        <InfoSpecAddButton className="contact-add-btn" type="plus" specinfo_type="CONTACT">연락처 추가하기</InfoSpecAddButton>
    </div>
};

export default ContactInfoSpecific