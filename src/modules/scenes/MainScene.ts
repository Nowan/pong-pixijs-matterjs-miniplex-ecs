import { Loader, Sprite } from "pixi.js";
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
        return new Promise((resolve, reject) => {
            const loader = Loader.shared;

            loader.add("assets/textures/background.jpg", "assets/textures/background.jpg");
            loader.add("assents/textures/cardsDeck.json", "assets/textures/cardsDeck.json");

            loader.onComplete.once(() => resolve());
            loader.onError.once(() => reject());

            loader.load();
        });
    }

    resize(width: number, height: number) {
        this.viewport.resize(width, height);
        this.viewport.moveCenter(0, 0);
        this.viewport.fitWorld();
    }
}
