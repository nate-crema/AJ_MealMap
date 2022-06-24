import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// interfaces
import { Login, Location, alertOption } from "@interfaces/service/recoil/State";
import { ComponentOpenState, SubdisplayDisplayMode, SubdisplayMountMode } from "@src/interfaces/Subdisplay";
import { ShopIDType, ShopServiceType } from "@interfaces/service/service.data.types/Shop";
/*

testState: atom({
    key: "[unique-key]",
    default: "[default_value]"
})

*/

export default new ( function( this: any ): void {

    // State: login

    this.name = atom<string>({
        key: "nameState",
        default: ""
    });

    this.emailId = atom<string>({
        key: "emailIdState",
        default: ""
    });

    this.expires = atom<Date>({
        key: "expiresState",
        default: new Date
    });

    this.isLogined = atom<boolean>({
        key: "isLoginedState",
        default: false
    });

    this.login = selector({
        key: "loginSelector",
        get: ( { get } ) => ({
            name: get( this.name ),
            emailId: get( this.emailId ),
            expires: get( this.expires ),
            isLogined: get( this.isLogined )
        })
    });

    // State: Location

    this.location = atom<Location>({
        key: "locationState",
        default: {
            lat: -1,
            long: -1,
            address: ""
        }
    });

    // State: Shops

    this.shops = atom<Array<ShopServiceType>>({
        key: "Shops",
        default: []
    });

    // States: Subdisplay

    this.subdisplayMountMode = atom<SubdisplayMountMode>({
        key: "SubdisplayMounState",
        default: "UNMOUNTED"
    })

    this.subdisplayDisplayMode = atom<SubdisplayDisplayMode>({
        key: "SubdisplayDisplayModeState",
        default: "CLOSED"
    })

    this.subdisplayDisplaySize = atom<ComponentOpenState>({
        key: "subdisplayDisplaySizeState",
        default: "LARGE"
    })

    // States: Specific

    // this.shopSpecific = atom<ShopIDType | undefined>({
    //     key: "retaurantSpecificState",
    //     default: undefined
    // })
    this.shopSpecific = atom<ShopServiceType | undefined>({
        key: "shopSpecificState",
        default: undefined
    })


    // States: alert

    this.alert = atom<alertOption>({
        key: "alertState",
        default: { active: false }
    })

  
} as any );
