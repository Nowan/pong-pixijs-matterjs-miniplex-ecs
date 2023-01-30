import { Bodies } from "matter-js";
import { Graphics } from "pixi.js";
import { LevelContainer } from "../../../../core/parseLevel";
import { BallEntity } from "../../Entity";

import physicsConfig from "../../../../../../config/physics.config";

export function composeBallEntity(level: LevelContainer): BallEntity {
    const graphics = createBallGraphics(level);

    return {
        id: "Ball",
        pixi: graphics,
        physics: Bodies.circle(0, 0, Math.max(graphics.width, graphics.height) * 0.5, physicsConfig.ball),
        ball: true,
    };
}

function createBallGraphics(level: LevelContainer): Graphics {
    const ball = level.ballPrototype.clone();
    ball.name = "BALL";
    ball.visible = true;
    return level.addChild(ball);
}

export default composeBallEntity;
