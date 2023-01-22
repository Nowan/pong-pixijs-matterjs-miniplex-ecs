import { Application } from "pixi.js";
import SceneDirector from "./core/sceneManagement/SceneDirector";
import MainScene from "./scenes/MainScene";

export default class App extends Application {
    public director: SceneDirector;

    constructor() {
        super({
            backgroundColor: 0x000000,
            width: 1024,
            height: 768,
        });

        this.director = new SceneDirector(this);
        this.director.register("Main", MainScene);

        this.director.goTo("Main");
    }
}
