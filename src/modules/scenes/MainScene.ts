import { Sprite } from "pixi.js";
import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import Scene, { PropRefs } from "../core/sceneManagement/Scene";

export default class MainScene extends Scene {
    private _viewport: Viewport;

    constructor(refs: PropRefs) {
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
        const background = Sprite.from("assets/textures/background.jpg");
        this._viewport.addChild(background);

        const card = Sprite.from("assets/textures/cardsDeck/BackFace.png");
        this._viewport.addChild(card);
    }

    async load(): Promise<void> {
        // Assets.loadBundle() seem to have spritesheet textures mapping broken, loading single assets instead
        await Assets.load("assets/textures/background.jpg");
        await Assets.load("assets/textures/cardsDeck.json");
    }

    resize(width: number, height: number) {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
    }
}
