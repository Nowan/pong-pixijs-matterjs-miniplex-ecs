import { Container, Ticker, AbstractRenderer } from "pixi.js";
import SceneDirector from "./SceneDirector";

export type FacadeRefs = {
    renderer: AbstractRenderer;
    director: SceneDirector;
};

export default class Scene extends Container {
    public renderer: AbstractRenderer;
    public director: SceneDirector;
    public ticker: Ticker;

    constructor(facadeRefs: FacadeRefs) {
        super();

        this.renderer = facadeRefs.renderer;
        this.director = facadeRefs.director;
        this.ticker = new Ticker();
    }

    async load(): Promise<void> {
        return await Promise.resolve();
    }

    public init(...args: Array<any>): void {}

    public destroy(): void {}

    public resize(width: number, height: number): void {}

    public update?(timeSinceLastFrameInS: number, timeSinceSceneInitiatedInS: number) {}
}
