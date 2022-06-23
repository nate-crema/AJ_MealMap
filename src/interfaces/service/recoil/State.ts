
// Interface Declaration: recoil/state ( state )
import React, { CSSProperties } from "react";
import { alertSizeOptions } from "../../Alert";
import { ServiceButtonThemes } from "../../ServiceButton";

export type Login = {
    isLogined: boolean
    name: string
    emailId: string
    expires: Date | any
}

export type Location = {
    lat: number
    long: number
    address: string
}

export type alertOption = {
    active: true
    title: {
        text: string
        style?: CSSProperties
    }
    descriptions: Array<{
        text: string
        style?: CSSProperties
    }>
    buttons: Array<{
        text: string
        theme?: ServiceButtonThemes
        style?: CSSProperties
        onAction?: ( closeAlert: () => any ) => any
    }>
    size: alertSizeOptions
    backgroundOff?: boolean
} | { 
    active: false
    title?: any
    descriptions?: any
    buttons?: any
    size?: any
    backgroundOff?: any
}