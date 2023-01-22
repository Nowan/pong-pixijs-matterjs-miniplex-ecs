import { Assets, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";
import Scene, { PropRefs } from "../core/sceneManagement/Scene";

export default class MainScene extends Scene {
    public viewport: Viewport;

    constructor(refs: PropRefs) {
        super(refs);

        this.viewport = this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: this.renderer.width,
                worldHeight: this.renderer.height,
            }),
        );
    }

    init() {
        const background = Sprite.from("assets/textures/background.jpg");
        background.anchor.set(0.5);
        this.viewport.addChild(background);

        const card = Sprite.from("assets/textures/cardsDeck/BackFace.png");
        card.anchor.set(0.5);
        card.scale.set(0.5);
        this.viewport.addChild(card);
    }

    async load(): Promise<void> {
        await Assets.load("assets/textures/background.jpg");
        await Assets.load("assets/textures/cardsDeck.json");
    }

    resize(width: number, height: number) {
        this.viewport.resize(width, height);
        this.viewport.moveCenter(0, 0);
        this.viewport.fitWorld();
    }
}
