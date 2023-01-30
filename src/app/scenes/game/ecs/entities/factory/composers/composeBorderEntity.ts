import { Bodies } from "matter-js";
import { Graphics } from "pixi.js";
import { LevelContainer, LineData } from "../../../../core/parseLevel";
import { LevelBorderEntity } from "../../Entity";

import physicsConfig from "../../../../../../config/physics.config";

export function composeUpperBorderEntity(level: LevelContainer): ReturnType<typeof composeBorderEntity> {
    return composeBorderEntity("BORDER_UPPER", level.borderUpper, level.borderLines.upper);
}

export function composeLowerBorderEntity(level: LevelContainer): ReturnType<typeof composeBorderEntity> {
    return composeBorderEntity("BORDER_LOWER", level.borderLower, level.borderLines.lower);
}

export function composeBorderEntity(id: string, graphics: Graphics, [pointA, pointB]: LineData): LevelBorderEntity {
    const dX = pointB.x - pointA.x;
    const dY = pointB.y - pointA.y;
    const dH = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    const angle = Math.atan2(dY, dX);
    const thickness = 10;

    return {
        id,
        pixi: graphics,
        physics: Bodies.rectangle(pointA.x + dX * 0.5, pointA.y + dY * 0.5, dH, thickness, {
            ...physicsConfig.borders,
            angle,
            isStatic: true,
        }),
    };
}

export default composeBorderEntity;
