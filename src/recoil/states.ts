import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// interfaces
import { Login, Location, alertOption } from "@interfaces/service/recoil/State";
import { ComponentOpenState, SubdisplayDisplayMode, SubdisplayMountMode } from "@pages/Subdisplay/types";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
import { InfoSpecificOpenInfoType, InfoSpecificOpenSize } from "@template/InfoSpecific/type";
/*

const [unique-key] = atom({
    key: "[unique-key]",
    default: "[default_value]"
})

*/



// State: login

const nameState = atom<string>({
    key: "nameState",
    default: ""
});

const emailIdState = atom<string>({
    key: "emailIdState",
    default: ""
});

const expiresState = atom<Date>({
    key: "expiresState",
    default: new Date
});

const isLoginedState = atom<boolean>({
    key: "isLoginedState",
    default: false
});

const loginSelector = selector<Login>({
    key: "loginSelector",
    get: ( { get } ) => ({
        name: get( nameState ),
        emailId: get( emailIdState ),
        expires: get( expiresState ),
        isLogined: get( isLoginedState )
    }),
    set: ( { set }, newValue: any ) => {
        set( nameState, newValue.name );
        set( emailIdState, newValue.emailId );
        set( expiresState, newValue.expires );
        set( isLoginedState, newValue.isLogined );
    }
});

// State: Location

const locationState = atom<Location>({
    key: "locationState",
    default: {
        lat: -1,
        long: -1,
        address: ""
    }
});

// State: Shops

const shopState = atom<Array<ShopServiceType>>({
    key: "ShopState",
    default: []
});

// States: Subdisplay

const subdisplayMountState = atom<SubdisplayMountMode>({
    key: "SubdisplayMountModeState",
    default: "UNMOUNTED"
})

const subdisplayDisplayModeState = atom<SubdisplayDisplayMode>({
    key: "SubdisplayDisplayModeState",
    default: "CLOSED"
})

const subdisplayDisplaySizeState = atom<ComponentOpenState>({
    key: "subdisplayDisplaySizeState",
    default: "LARGE"
})

// States: InfoSpecific

const infoSpecificOpenInfoState = atom<InfoSpecificOpenInfoType>({
    key: "infoSpecificOpenInfoState",
    default: "CLOSED"
})

// States: Specific

// this.shopSpecific = atom<ShopIDType | undefined>({
//     key: "retaurantSpecificState",
//     default: undefined
// })
const shopSpecificState = atom<ShopServiceType | undefined>({
    key: "shopSpecificState",
    default: undefined
})


// States: alert

const alertState = atom<alertOption>({
    key: "alertState",
    default: { active: false }
})

// States: SvgManager

const svgListState = atom<{ [ svg_type in string ]: string }>({
    key: "svgListState",
    default: {}
})

export default {
    name: nameState, 
    emailId: emailIdState, 
    expires: expiresState, 
    isLogined: isLoginedState, 
    login: loginSelector, 
    location: locationState, 
    shops: shopState, 
    subdisplayMountMode: subdisplayMountState, 
    subdisplayDisplayMode: subdisplayDisplayModeState, 
    subdisplayDisplaySize: subdisplayDisplaySizeState, 
    infoSpecificOpenInfo: infoSpecificOpenInfoState, 
    shopSpecific: shopSpecificState, 
    alert: alertState, 
    svgList: svgListState
};
