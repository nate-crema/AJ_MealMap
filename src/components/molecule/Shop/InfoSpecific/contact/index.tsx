import { useState, useEffect, useRef, useMemo } from "react";

// recoil
import { useRecoilState, useSetRecoilState, useRecoilValue, ResetRecoilState } from "recoil";
import states from "@recoil/states";

// css
import './style.css';
import { ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import ContactBlock from "./ContactBlock";

// interfaces
type ContactInfoSpecificProps = {}

// components


const ContactInfoSpecific: React.FC<ContactInfoSpecificProps> = ({}) => {

    const info = useRecoilValue<ShopServiceType>( states.shopSpecific );
    const contacts = useMemo( () => Object.keys(info.contact).map( v => ({ contact_name: v, contact: info.contact[v] || "" })), [ info ] );

    useEffect(() => console.log( "ContactInfoSpecific", info.contact ), [ info ]);

    return <div className="shop-specinfo-contact">
        { contacts.map( contact_info => <>
            <ContactBlock contactInfo={ contact_info }/>
        </> ) }
    </div>
};

export default ContactInfoSpecific