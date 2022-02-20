// Interface Declaration: Subdisplay ( comp )
import React from "react";

// SubDisplay

export type INFO_READ = "INFO/READ";
export type REVIEW_WRITE = "REVIEW/WRITE";
export type CLOSED = "CLOSED";

export type SubdisplayDisplayMode = INFO_READ | REVIEW_WRITE | CLOSED;


export type MOUNTED = "MOUNTED";
export type UNMOUNTED = "UNMOUNTED";

export type SubdisplayMountMode = MOUNTED | UNMOUNTED;


type SMALL = "SMALL";
type HALF_SMALL = "HALF_SMALL";
type MEDIUM = "MEDIUM";
type HALF_MEDIUM = "HALF_MEDIUM";
type LARGE = "LARGE";

export type ComponentOpenState = SMALL | HALF_SMALL | MEDIUM | HALF_MEDIUM | LARGE;