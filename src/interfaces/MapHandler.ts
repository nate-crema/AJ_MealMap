// Interface Declaration: MapHandler ( comp )
import React from "react";

export type MapHandlerCommonOptions = {
    onPlaceClicked?: MapOnPlaceClickedFunction
    location?: { lat: number, long: number }
    level?: number
    markers?:  Array<{ position: any, image: any }>
}

export type MapHandlerOptionDisplay = {
    location: { lat: number, long: number }
    level: number
    markers?: Array<{ position: any, image: any }>
}

export type MapHandlerOptionInput = {
    onPlaceClicked: MapOnPlaceClickedFunction
}

export type MapOnPlaceClickedFunction = ( location: { lat: number, long: number } ) => any;

export type MapHandlerModeDisplay = {
    type: "display"
    option: Partial<MapHandlerCommonOptions & MapHandlerOptionDisplay>
}

export type MapHandlerModeInput = {
    type: "input"
    option: Partial<MapHandlerCommonOptions & MapHandlerOptionInput>
}