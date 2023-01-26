import { Sprite } from "pixi.js";
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

        const background = Sprite.from("assets/textures/background.jpg");
        background.anchor.set(0.5);
        world.addChild(background);

        const card = Sprite.from("assets/textures/cardsDeck/BackFace.png");
        card.anchor.set(0.5);
        world.addChild(card);
    }

    async load(): Promise<void> {
        // Assets.loadBundle() seem to have spritesheet textures mapping broken, loading single assets instead
        await Assets.load("assets/levels/main.tiled.json");
        await Assets.load("assets/textures/background.jpg");
        await Assets.load("assets/textures/cardsDeck.json");
    }

    resize(width: number, height: number) {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(0, 0);
    }
}
