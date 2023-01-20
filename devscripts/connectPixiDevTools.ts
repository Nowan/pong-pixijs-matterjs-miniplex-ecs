import * as PIXI from "pixi.js";

declare global {
    interface Window {
        __PIXI_INSPECTOR_GLOBAL_HOOK__: any;
    }
}

export default function connectPixiDevTools(): void {
    // Register PIXI namespace for pixi-devtools
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}
