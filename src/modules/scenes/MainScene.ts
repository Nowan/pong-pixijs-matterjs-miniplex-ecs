import { Assets, Sprite } from "pixi.js";
import Scene, { PropRefs } from "../core/sceneManagement/Scene";

export default class MainScene extends Scene {
    constructor(refs: PropRefs) {
        super(refs);
    }

    init() {
        const background = Sprite.from("assets/textures/background.jpg");
        background.anchor.set(0.5);
        this.addChild(background);

        const card = Sprite.from("assets/textures/cardsDeck/BackFace.png");
        card.anchor.set(0.5);
        card.scale.set(0.5);
        this.addChild(card);
    }

    async load(): Promise<void> {
        await Assets.load("assets/textures/background.jpg");
        await Assets.load("assets/textures/cardsDeck.json");
    }

    resize(width: number, height: number) {}
}
