import { Container, Rectangle, Sprite } from "pixi.js";

export default class PauseButton extends Container {
    private _icon: Sprite;

    constructor() {
        super();

        this._icon = this._createIcon();
        this.hitArea = this._createHitArea(this._icon);

        this.enableInteractivity();
    }

    public enableInteractivity() {
        this.interactive = this.buttonMode = true;
    }

    public disableInteractivity() {
        this.interactive = this.buttonMode = false;
    }

    private _createIcon(): Sprite {
        const icon = Sprite.from("assets/textures/gui/icon_pause_white.png");
        icon.anchor.set(0.5);
        return this.addChild(icon);
    }

    private _createHitArea({ width, height }: Sprite): Rectangle {
        return new Rectangle(-width * 0.5, -height * 0.5, width, height);
    }
}
