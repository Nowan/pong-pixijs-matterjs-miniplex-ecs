import { World as Miniplex } from "miniplex";
import { LevelContainer } from "./parseLevel";
import { Entity, MoveKey, MoveDirection, MoveOnKeysComponent, PaddleEntity } from "../ecs";
import { Graphics } from "pixi.js";
import { Bodies } from "matter-js";

export default function initEntities(level: LevelContainer, miniplex: Miniplex<Entity>) {
    miniplex.createEntity(composePaddleLeftEntity(level.paddles.left));
    miniplex.createEntity(composePaddleRightEntity(level.paddles.right));
}

function composePaddleLeftEntity(paddle: Graphics): PaddleEntity {
    return composePaddleEntity(paddle, {
        [MoveKey.W]: MoveDirection.UP,
        [MoveKey.S]: MoveDirection.DOWN,
    });
}

function composePaddleRightEntity(paddle: Graphics): PaddleEntity {
    return composePaddleEntity(paddle, {
        [MoveKey.ARROW_UP]: MoveDirection.UP,
        [MoveKey.ARROW_DOWN]: MoveDirection.DOWN,
    });
}

function composePaddleEntity(paddle: Graphics, moveOnKeys: MoveOnKeysComponent["moveOnKeys"]): PaddleEntity {
    return {
        moveOnKeys,
        id: paddle.name,
        pixi: paddle,
        physics: Bodies.rectangle(paddle.x, paddle.y, paddle.width, paddle.height),
    };
}
