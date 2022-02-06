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