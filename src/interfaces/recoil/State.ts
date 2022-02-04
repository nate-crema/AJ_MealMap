// Interface Declaration: recoil/state
import React from "react";

export interface Login {
    isLogined: Boolean,
    name: String,
    portalId: String,
    expires: Date | any
}