import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// interfaces
import { Login, Location, alertOption } from "@src/interfaces/recoil/State";
import { RestaurantList, RestaurantID } from "@interfaces/Restaurant";
import { ComponentOpenState, SubdisplayDisplayMode, SubdisplayMountMode } from "@src/interfaces/Subdisplay";
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

    this.portalId = atom<string>({
        key: "portalIdState",
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
            portalId: get( this.portalId ),
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

    // State: Restaurants

    this.restaurants = atom<RestaurantList>({
        key: "restaurants",
        default: {}
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

    this.restaurantSpecific = atom<RestaurantID | undefined>({
        key: "retaurantSpecificState",
        default: undefined
    })


    // States: alert

    this.alert = atom<alertOption>({
        key: "alertState",
        default: { active: false }
    })

  
} as any );
