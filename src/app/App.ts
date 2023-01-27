import { Application } from "pixi.js";
import { Assets } from "@pixi/assets";
import SceneDirector from "./core/sceneManagement/SceneDirector";
import GameScene from "./scenes/GameScene";

export default class App extends Application {
    public director: SceneDirector;

    constructor() {
        super({ backgroundColor: 0x000000 });

        Assets.init({ manifest: "assets/manifest.json" });

        this.director = new SceneDirector(this);
        this.director.register("Game", GameScene);

        this.director.goTo("Game");
    }
}
