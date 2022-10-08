
// Interface Declaration: recoil/state ( state )
import React, { CSSProperties } from "react";
import { alertSizeOptions } from "@organism/ServiceAlert/types";
import { ServiceButtonThemes } from "@atom/ServiceButton/types";

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

export type AlertOption = {
    active: true
    title: {
        text: string
        style?: CSSProperties
    }
    descriptions: Array<{
        text: string
        style?: CSSProperties
    }>
    content?: JSX.Element
    buttons: Array<{
        text: string
        theme?: ServiceButtonThemes
        style?: CSSProperties
        onAction?: ( closeAlert: () => any ) => any
    }>
    size: alertSizeOptions
    backgroundOff?: boolean
    onBackgroundClick?: ( closeAlert: () => any ) => any
} | { 
    active: false
    title?: any
    descriptions?: any
    content?: any
    buttons?: any
    size?: any
    backgroundOff?: any
    onBackgroundClick?: any
}