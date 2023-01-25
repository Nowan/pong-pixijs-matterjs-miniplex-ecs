import { useApp } from "@pixi/react";

export type ResizeEffectState = {
    width: number;
    height: number;
};

export function useAppResize(): ResizeEffectState {
    const app = useApp();
    return { width: app.renderer.width, height: app.renderer.height };
}
