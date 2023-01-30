import Scene from "../../core/sceneManagement/Scene";
import { Text } from "pixi.js";
import Player from "../game/core/Player";
import {
    MatchScore,
    selectFollowingPlayer,
    selectFollowingPoints,
    selectLeadingPlayer,
    selectLeadingPoints,
} from "../game/ecs";
import GraphicsButton from "../../core/gui/GraphicsButton";
import GameScene from "../game/GameScene";

export default class SummaryScene extends Scene {
    public static readonly NAME = "Summary";

    private _summaryLabel: Text = this._createSummaryLabel();
    private _rematchButton: GraphicsButton = this._createRematchButton();

    public init(finalScore: MatchScore): void {
        this._updateSummaryLabel(finalScore);
    }

    public resize(width: number, height: number): void {
        this._summaryLabel.position.set(width * 0.5, height * 0.4);
        this._rematchButton.position.set(width * 0.5, height * 0.8);
    }

    private _updateSummaryLabel(finalScore: MatchScore) {
        const formattedScore = `${selectLeadingPoints(finalScore)} : ${selectFollowingPoints(finalScore)}`;
        const leadingPlayer = selectLeadingPlayer(finalScore);
        const followingPlayer = selectFollowingPlayer(finalScore);
        const serial = { [Player.ONE]: 1, [Player.TWO]: 2 };

        this._summaryLabel.text = `Congratulations!\n\nPlayer ${serial[leadingPlayer]} wins with score ${formattedScore}.\n\nPlayer ${serial[followingPlayer]}, better luck next time!`;
    }

    private _createSummaryLabel(): Text {
        const summaryLabel = new Text("", {
            fontFamily: "Arial",
            fontSize: 50,
            fill: 0xffffff,
            align: "center",
        });
        summaryLabel.anchor.set(0.5);
        return this.addChild(summaryLabel);
    }

    private _createRematchButton(): GraphicsButton {
        const button = new GraphicsButton("REMATCH!", 300, 100);
        button.on("pointerdown", () => this.director.goTo(GameScene.NAME));
        return this.addChild(button);
    }
}
