import { Container, Ticker, IRenderer } from "pixi.js";
import SceneDirector from "./SceneDirector";

export type PropRefs = {
    renderer: IRenderer;
    director: SceneDirector;
};

export default class Scene extends Container {
    public renderer: IRenderer;
    public director: SceneDirector;
    public ticker: Ticker;

    constructor(propRefs: PropRefs) {
        super();

        this.renderer = propRefs.renderer;
        this.director = propRefs.director;
        this.ticker = new Ticker();
    }

    async load(): Promise<void> {
        return await Promise.resolve();
    }

    public init(...args: Array<any>): void {}

    public destroy(): void {}

    public resize(width: number, height: number): void {}

    public update?(timeSinceLastFrame: number, timeSinceSceneInitiated: number) {}
}
