import { Bodies } from "matter-js";
import { Graphics } from "pixi.js";
import { LevelContainer } from "../../../../core/parseLevel";
import { BallEntity } from "../../Entity";

export function composeBallEntity(level: LevelContainer): BallEntity {
    const graphics = createBallGraphics(level);

    return {
        id: "Ball",
        pixi: graphics,
        physics: Bodies.circle(0, 0, Math.max(graphics.width, graphics.height) * 0.5, {
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
        }),
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
