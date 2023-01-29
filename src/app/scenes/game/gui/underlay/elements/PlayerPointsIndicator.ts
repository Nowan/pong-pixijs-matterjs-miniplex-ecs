import { Container, Text } from "pixi.js";

export default class PlayerPointsIndicator extends Container {
    private _counter = this._createCounter();

    updateCounter(numberOfPoints: number) {
        this._counter.text = numberOfPoints;
    }

    private _createCounter(): Text {
        const counter = new Text("0", {
            fontFamily: "Arial",
            fontSize: 250,
            fill: 0x3e3e3e,
            align: "center",
        });
        counter.anchor.set(0.5);
        return this.addChild(counter);
    }
}
