import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { shop } from '../../apis';

// mobile-rendering component

function MobileHandler({ width, height, children, history }) {

    // click position displayer
    const { stat, customClick, customClickedPo } = useSelector(state => state.map);
    const dispatch = useDispatch();

    const displaySearch = async (lat, long, range) => {
        try {
            // search
            const results = await shop.findShopByLocation(lat, long, range);
    
            // open search result component
            history.push("/near");
            dispatch({ type: "mobile/SETCOMP", comp: { mode: "nearby", value: results } })
        } catch(e) {
            throw e;
        }
    }

    useEffect(() => {
        // initializer
        if (isMobile() && stat) dispatch({ type: "map/SETMCLICK", active: true });
    }, [ stat ]); 

    useEffect(() => {
        // map click detection
        if (stat && customClick) {
            const [ lat, long ] = customClickedPo;
            // remove markers (except selected)
            dispatch({ 
                type: "map/SETLIST", 
                list: [{
                    loc: { lat, long },
                    overlay: false,
                    _id: Math.floor((lat+long)*10000)
                }]
            })
            console.log(`Pointer Id is: ${Math.floor((lat+long)*10000)}`);
            // move map position
            dispatch({ type: "map/SETMAPTO", loc: [ lat, long ] });
            // deactivate map click movement
            dispatch({ type: "map/SETMCLICK", active: false });

            // Search & Display results
            displaySearch(lat, long, 100);
        }
    }, [ customClickedPo ]);

    const isMobile = function() {
        return (width < height) || ( width < 600 );
    }

    // if ( !isMobile() ) return <>{ children }</>;
    return <>{ children }</>;
}

export default MobileHandler;