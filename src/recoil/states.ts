import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

// interfaces
import { Login } from "@src/interfaces/recoil/State";
/*

testState: atom({
    key: "[unique-key]",
    default: "[default_value]"
})

*/

export default new ( function( this: any ): void {

    // State: login

    this.name = atom<String>({
        key: "nameState",
        default: ""
    });

    this.portalId = atom<String>({
        key: "portalIdState",
        default: ""
    });

    this.expires = atom<Date>({
        key: "expiresState",
        default: new Date
    });

    this.isLogined = atom<Boolean>({
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
    })
  
} as any );
