import Scene from "../../core/sceneManagement/Scene";
import GraphicsButton from "../../core/gui/GraphicsButton";
import GameScene from "../game/GameScene";
import { Assets } from "@pixi/assets";

export default class TitleScene extends Scene {
    public static readonly NAME = "Title";

    private _startButton: GraphicsButton = this._createStartButton();

    async load(): Promise<void> {
        Assets.backgroundLoad("assets/levels/main.tiled.json");
        Assets.backgroundLoad("assets/textures/gui.json");
    }

    public resize(width: number, height: number): void {
        this._startButton.position.set(width * 0.5, height * 0.5);
    }

    private _createStartButton(): GraphicsButton {
        const button = new GraphicsButton("START", 300, 100);
        button.on("pointerdown", () => this.director.goTo(GameScene.NAME));
        return this.addChild(button);
    }
}
