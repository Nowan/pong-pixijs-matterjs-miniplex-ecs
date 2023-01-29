import { Container } from "pixi.js";
import Player from "../../core/Player";
import { MatchScore } from "../../ecs";
import PlayerPointsIndicator from "./elements/PlayerPointsIndicator";

export default class GuiUnderlay extends Container {
    private _pointsIndicatorsMap = {
        [Player.ONE]: this.addChild(new PlayerPointsIndicator()),
        [Player.TWO]: this.addChild(new PlayerPointsIndicator()),
    };

    public updateScore(score: MatchScore): void {
        for (let [player, numberOfPoints] of Object.entries(score)) {
            const pointsIndicator = this._pointsIndicatorsMap[player as Player];
            pointsIndicator.updateCounter(numberOfPoints);
        }
    }

    public resize(width: number, height: number): void {
        this._pointsIndicatorsMap[Player.ONE].position.set(width * 0.25, height * 0.5);
        this._pointsIndicatorsMap[Player.TWO].position.set(width * 0.75, height * 0.5);
    }
}
