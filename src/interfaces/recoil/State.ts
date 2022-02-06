// Interface Declaration: recoil/state ( state )
import React from "react";

export interface Login {
    isLogined: boolean,
    name: string,
    portalId: string,
    expires: Date | any
}

export interface Location {
    lat: number,
    long: number,
    address: string
}