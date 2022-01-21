import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// css
import "../css/mobile_comp/FriendList.css";


function FriendBlock({ profile: { info, connected, start }, mode, delay, onClick, checked }) {

    return <div className="friend-list-block" style={{
        animationDelay: delay
    }} onClick={ onClick }>
        <div className="profile-img" style={{
            backgroundImage: `url(${ info?.img || "" })`
        }}></div>
        <span className="user-name">{ ( info.name.split(" ")[0].length > 3 ? info.name.split(" ")[0].substr(0, 2) + "..." : info.name.split(" ")[0] ) }</span>
        <div className="department">
            <span className="college" style={{
                opacity: ( mode === "selection" ) ? "0" : "1"
            }}>{ ( info.college.length > 6 ? info.college.substr(0, 5) + "..." : info.college ) }</span>
            <span className="major" style={{
                top: ( mode === "selection" ) && "50%",
                transform: ( mode === "selection" ) && "translateY(-50%)",
                bottom: ( mode === "selection" ) && "unset"
            }}>{ 
                ( mode === "selection" ) ? 
                ( info.major.length > 3 ? info.major.substr(0, 2) + "..." : info.major )
                :
                ( info.major.length > 6 ? info.major.substr(0, 5) + "..." : info.major )
            }</span>
        </div>
        <div className={ "checkbox" + ( checked ? " check" : " uncheck" )} style={{
                opacity: ( mode === "selection" ) ? "1" : "0"
            }}>
            <svg viewBox="0 0 19.867 20.275"  className={( checked ? " check" : " uncheck" )}>
                <path id="Path_223" data-name="Path 223" d="M267.611,562.049l6.253,10.312,10.867-17.9" transform="translate(-266.238 -553.087)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
            </svg>
        </div>
    </div>
}

function FriendList({ style, className, onTouchStart, friend_list, blockClickHandler, list_mode,
    select_state: [ selected, setSelected ]
}) {

    const _clickHandler = ( friend ) => {
        let result = true;
        if ( blockClickHandler ) result = blockClickHandler( friend._id );
        if ( result !== false ) setSelected(p => {
            let arr = [ ...p ];
            const idx = arr.indexOf(friend._id);
            if (idx === -1) {
                arr.push(friend._id);
                return arr;
            } else {
                arr.splice(idx, 1);
                return arr;
            }
        })
    }

    return <div className={ "friend-list-blocks" + ( className ? ` ${ className }` : "" ) } style={ style || {} }
    onTouchStart={ onTouchStart }>
        { friend_list.map( ( friend, i ) => 
            <FriendBlock
                key={ i }
                profile={ friend }
                delay={ `${ i * 0.01 }s` }
                onClick={ () => _clickHandler( friend ) }
                mode={ list_mode }
                checked={ selected.includes( friend._id ) }
            />
        ) }
    </div>;
}

export default FriendList;