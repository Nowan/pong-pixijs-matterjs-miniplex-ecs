import { Container, Graphics, Sprite, Rectangle } from "pixi.js";

export default class PauseMenuPopup extends Container {
    public staticBounds: Rectangle;
    private _background: Graphics;
    private _continueIcon: Sprite;

    constructor() {
        super();

        this.staticBounds = new Rectangle(0, 0, 600, 400);

        this._background = this._createBackground(this.staticBounds);
        this._continueIcon = this._createContinueIcon();

        this.interactive = this.buttonMode = true;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    private _createBackground({ width, height }: Rectangle): Graphics {
        return this.addChild(
            new Graphics()
                .beginFill(0xffffff)
                .drawRect(-width * 0.5, -height * 0.5, width, height)
                .endFill(),
        );
    }

    private _createContinueIcon(): Sprite {
        const icon = Sprite.from("assets/textures/gui/icon_play_black.png");
        icon.scale.set(2);
        icon.anchor.set(0.5);
        return this.addChild(icon);
    }
}
