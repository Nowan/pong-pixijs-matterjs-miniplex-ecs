import { Bodies } from "matter-js";
import { Graphics } from "pixi.js";
import { LevelContainer } from "../../../../parseLevel";
import { DeadzoneEntity } from "../../Entity";

export function composeLeftDeadzoneEntity(level: LevelContainer): ReturnType<typeof composeDeadzoneEntity> {
    return composeDeadzoneEntity("DEADZONE_LEFT", level.deadzones.left);
}

export function composeRightDeadzoneEntity(level: LevelContainer): ReturnType<typeof composeDeadzoneEntity> {
    return composeDeadzoneEntity("DEADZONE_LEFT", level.deadzones.right);
}

export function composeDeadzoneEntity(id: string, graphics: Graphics): DeadzoneEntity {
    return {
        id,
        physics: Bodies.rectangle(graphics.x, graphics.y, graphics.width, graphics.height, {
            isStatic: true,
            isSensor: true,
        }),
        deadzone: true,
    };
}

export default composeDeadzoneEntity;
