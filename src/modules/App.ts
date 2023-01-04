import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";

const gameWidth = 1024;
const gameHeight = 768;

export default class App extends Application {
    viewport: Viewport;

    constructor() {
        super({
            backgroundColor: 0x000000,
            width: gameWidth,
            height: gameHeight,
        });

        this.viewport = this.stage.addChild(new Viewport({
            screenWidth: gameWidth,
            screenHeight: gameHeight,
            worldWidth: gameWidth,
            worldHeight: gameHeight
        }));
    }
}