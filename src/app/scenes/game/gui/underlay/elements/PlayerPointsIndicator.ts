import { Container, Text } from "pixi.js";
import anime from "animejs";

export default class PlayerPointsIndicator extends Container {
    private _counter = this._createCounter();

    updateCounter(numberOfPoints: number) {
        if (numberOfPoints === parseInt(this._counter.text)) return;

        this._counter.text = numberOfPoints;

        anime({
            targets: this._counter.scale,
            x: 1.2,
            y: 1.2,
            direction: "alternate",
            easing: "easeInOutSine",
            duration: 300,
        });
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
