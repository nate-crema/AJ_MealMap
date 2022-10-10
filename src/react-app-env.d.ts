/// <reference types="react-scripts" />

import { AlertOption } from "@recoil/types";

declare global {
    interface Window {
        ServiceAlert: ( options: AlertOption ) => any
    }
}