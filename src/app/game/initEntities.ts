import { World as Miniplex } from "miniplex";
import { LevelContainer, LineData } from "./parseLevel";
import { Entity, MoveKey, MoveDirection, MoveOnKeysComponent, PaddleEntity, LevelBorderEntity } from "../ecs";
import { Graphics } from "pixi.js";
import { Bodies } from "matter-js";
import TiledMap from "tiled-types/types";

export default function initEntities(levelData: TiledMap, level: LevelContainer, miniplex: Miniplex<Entity>) {
    miniplex.createEntity(composePaddleLeftEntity(level.paddles.left));
    miniplex.createEntity(composePaddleRightEntity(level.paddles.right));
    miniplex.createEntity(composeUpperBorderEntity(level));
    miniplex.createEntity(composeLowerBorderEntity(level));
}

function composePaddleLeftEntity(graphics: Graphics): PaddleEntity {
    return composePaddleEntity(graphics, {
        [MoveKey.W]: MoveDirection.UP,
        [MoveKey.S]: MoveDirection.DOWN,
    });
}

function composePaddleRightEntity(graphics: Graphics): PaddleEntity {
    return composePaddleEntity(graphics, {
        [MoveKey.ARROW_UP]: MoveDirection.UP,
        [MoveKey.ARROW_DOWN]: MoveDirection.DOWN,
    });
}

function composePaddleEntity(graphics: Graphics, moveOnKeys: MoveOnKeysComponent["moveOnKeys"]): PaddleEntity {
    return {
        moveOnKeys,
        id: graphics.name,
        pixi: graphics,
        physics: Bodies.rectangle(graphics.x, graphics.y, graphics.width, graphics.height, { isStatic: true }),
    };
}

function composeUpperBorderEntity(level: LevelContainer): LevelBorderEntity {
    return composeBorderEntity("BORDER_UPPER", level.borderUpper, level.borderLines.upper);
}

function composeLowerBorderEntity(level: LevelContainer): LevelBorderEntity {
    return composeBorderEntity("BORDER_LOWER", level.borderLower, level.borderLines.lower);
}

function composeBorderEntity(id: string, graphics: Graphics, [pointA, pointB]: LineData): LevelBorderEntity {
    const dX = pointB.x - pointA.x;
    const dY = pointB.y - pointA.y;
    const dH = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    const angle = Math.atan2(dY, dX);
    const thickness = 5;

    return {
        id,
        pixi: graphics,
        physics: Bodies.rectangle(pointA.x + dX * 0.5, pointA.y + dY * 0.5, dH, thickness, {
            isStatic: true,
            friction: 0,
            frictionStatic: 0,
            restitution: 1,
            angle,
        }),
    };
}
