import { Bodies } from "matter-js";
import { Graphics } from "pixi.js";
import { MoveDirection, MoveKey, MoveOnKeysComponent } from "../../../components";
import { PaddleEntity } from "../../Entity";

export function composeLeftPaddleEntity(graphics: Graphics): ReturnType<typeof composePaddleEntity> {
    return composePaddleEntity("PADDLE_LEFT", graphics, {
        [MoveKey.W]: MoveDirection.UP,
        [MoveKey.S]: MoveDirection.DOWN,
    });
}

export function composeRightPaddleEntity(graphics: Graphics): ReturnType<typeof composePaddleEntity> {
    return composePaddleEntity("PADDLE_RIGHT", graphics, {
        [MoveKey.ARROW_UP]: MoveDirection.UP,
        [MoveKey.ARROW_DOWN]: MoveDirection.DOWN,
    });
}

export function composePaddleEntity(
    id: string,
    graphics: Graphics,
    moveOnKeys: MoveOnKeysComponent["moveOnKeys"],
): PaddleEntity {
    return {
        id,
        moveOnKeys,
        pixi: graphics,
        physics: Bodies.rectangle(graphics.x, graphics.y, graphics.width, graphics.height, { isStatic: true }),
    };
}

export default composePaddleEntity;
