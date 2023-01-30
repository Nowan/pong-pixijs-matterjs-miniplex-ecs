import { Bodies } from "matter-js";
import { Graphics } from "pixi.js";
import { LevelContainer } from "../../../../core/parseLevel";
import Player from "../../../../core/Player";
import { DeadzoneEntity } from "../../Entity";

export function composeLeftDeadzoneEntity(level: LevelContainer): ReturnType<typeof composeDeadzoneEntity> {
    return composeDeadzoneEntity("DEADZONE_LEFT", level.deadzones.left, Player.ONE);
}

export function composeRightDeadzoneEntity(level: LevelContainer): ReturnType<typeof composeDeadzoneEntity> {
    return composeDeadzoneEntity("DEADZONE_LEFT", level.deadzones.right, Player.TWO);
}

export function composeDeadzoneEntity(id: string, graphics: Graphics, keeper: Player): DeadzoneEntity {
    return {
        id,
        physics: Bodies.rectangle(graphics.x, graphics.y, graphics.width, graphics.height, {
            isStatic: true,
            isSensor: true,
        }),
        deadzone: {
            keeper,
            triggered: false,
        },
    };
}

export default composeDeadzoneEntity;
