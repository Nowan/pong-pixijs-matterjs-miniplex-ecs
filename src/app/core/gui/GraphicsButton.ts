import { Container, Graphics, Text, Rectangle } from "pixi.js";

export default class GraphicsButton extends Container {
    public staticBounds: Rectangle;
    protected _background: Graphics;
    protected _label: Text;

    constructor(labelText: string = "", width: number = 100, height: number = 50) {
        super();

        this.staticBounds = new Rectangle(-width * 0.5, -height * 0.5, width, height);

        this._background = this._createBackground(this.staticBounds);
        this._label = this._createLabel(labelText);

        this.interactive = this.buttonMode = true;
    }

    private _createBackground({ x, y, width, height }: Rectangle): Graphics {
        return this.addChild(new Graphics().beginFill(0xffffff).drawRect(x, y, width, height).endFill());
    }

    private _createLabel(labelText: string): Text {
        const label = new Text(labelText, {
            fontFamily: "Arial",
            fontSize: 30,
            fill: 0x000000,
            align: "center",
        });
        label.anchor.set(0.5);
        return this.addChild(label);
    }
}
