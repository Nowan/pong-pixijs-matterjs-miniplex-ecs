import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import Scene, { FacadeRefs } from "../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import parseLevel from "../game/parseLevel";
import Game from "../game/Game";

export default class GameScene extends Scene {
    private _game: Game | null;
    private _viewport: Viewport;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._game = null;
        this._viewport = this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: 1024,
                worldHeight: 768,
            }),
        );
    }

    public async load(): Promise<void> {
        await Assets.load("assets/levels/main.tiled.json");
    }

    public init(): void {
        const levelData = Assets.cache.get("assets/levels/main.tiled.json") as TiledMap;
        const level = parseLevel(levelData);
        const game = new Game(level);

        this._viewport.resize(undefined, undefined, level.staticBounds.width, level.staticBounds.height);
        this._viewport.addChild(level);

        this._game = game;
    }

    public resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
    }

    public update(timeSinceLastFrameInS: number): void {
        this._game?.update(timeSinceLastFrameInS);
    }
}
