import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// css
import './style.css';

// interfaces
type ContactBlockProps = {
    contactInfo: { contact_name: string, contact: string }
}

// components


const ContactBlock: React.FC<ContactBlockProps> = ({ contactInfo }) => {

    const { contact_name: name, contact: contact } = useMemo( () => contactInfo, [ contactInfo ] );
    const isDefaultContact = useMemo( () => name === "default", [ name ] );

    const contactClickHandler = useCallback(() => {
        window.location.href = `tel:${ contact }`
    }, [ contact ]);

    return <div className="contact-block">
        <div className="contact-name-area">
            <span className="contact-name" style={{ color: !isDefaultContact ? "lightgray" : "" }}>{ isDefaultContact ? "기본연락처" : name }</span>
        </div>
        <div className="contact-content-area" onClick={ contactClickHandler }>
            <span className="contact-number" style={{ color: !isDefaultContact ? "lightgray" : "" }}>{ `${ contact.split("-")[0] }) ${ contact.replace(contact.split("-")[0] + "-", "") }` }</span>
        </div>
    </div>
};

export default ContactBlock