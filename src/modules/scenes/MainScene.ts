import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import Scene, { FacadeRefs } from "../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import parseTiledMap from "../core/tiled/parseMap";

export default class MainScene extends Scene {
    private _viewport: Viewport;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._viewport = this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: 1024,
                worldHeight: 768,
            }),
        );
    }

    init() {
        const levelData = Assets.cache.get("assets/levels/main.tiled.json") as TiledMap;
        const world = parseTiledMap(levelData);

        this._viewport.resize(undefined, undefined, world.staticBounds.width, world.staticBounds.height);
        this._viewport.addChild(world);
    }

    async load(): Promise<void> {
        await Assets.load("assets/levels/main.tiled.json");
    }

    resize(width: number, height: number) {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
    }
}
