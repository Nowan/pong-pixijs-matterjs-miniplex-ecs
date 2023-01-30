import { Application } from "pixi.js";
import { Assets } from "@pixi/assets";
import SceneDirector from "./core/sceneManagement/SceneDirector";
import { GameScene, SummaryScene, TitleScene } from "./scenes";

export default class App extends Application {
    public director: SceneDirector;

    constructor() {
        super({ backgroundColor: 0x000000 });

        Assets.init({ manifest: "assets/manifest.json" });

        this.director = new SceneDirector(this);
        this.director.register(TitleScene.NAME, TitleScene);
        this.director.register(GameScene.NAME, GameScene);
        this.director.register(SummaryScene.NAME, SummaryScene);

        this.director.goTo(TitleScene.NAME);
    }
}
