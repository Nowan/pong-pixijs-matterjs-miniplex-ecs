import { Sprite } from "pixi.js";
import GraphicsButton from "../../../../../core/gui/GraphicsButton";

export default class PauseMenuPopup extends GraphicsButton {
    constructor() {
        super("CONTINUE", 600, 400);
        this._createContinueIcon();
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    private _createContinueIcon(): Sprite {
        const icon = Sprite.from("assets/textures/gui/icon_play_black.png");
        icon.anchor.set(0.5);
        icon.y += 70;
        return this.addChild(icon);
    }
}
