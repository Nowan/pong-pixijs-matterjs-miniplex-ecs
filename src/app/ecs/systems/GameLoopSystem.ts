import System from "./System";
import { World as EcsEngine, Archetype } from "miniplex";
import { Engine as PhysicsEngine } from "matter-js";
import Entity from "../entities";
import { LevelContainer } from "../../game/parseLevel";
import { Point, IPointData } from "pixi.js";

export class GameLoopSystem extends System {
    private _level: LevelContainer;

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine, level: LevelContainer) {
        super(ecs);

        this._level = level;
    }

    init() {
        this._spawnBall();
    }

    private _spawnBall() {
        const ball = this._level.ballPrototype.clone();
        const serveLine = this._level.serveLine;
        ball.name = "BALL";
        ball.visible = true;
        ball.position.copyFrom(pickRandomPointOnLine(serveLine.start, serveLine.end));
        return this._level.addChild(ball);
    }
}

function pickRandomPointOnLine(pointA: IPointData, pointB: IPointData): Point {
    const dX = pointB.x - pointA.x;
    const dY = pointB.y - pointA.y;
    const dH = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    const randomH = Math.random() * dH;
    const angle = Math.atan2(dY, dX);

    return new Point(pointA.x + randomH * Math.cos(angle), pointA.y + randomH * Math.sin(angle));
}

export default GameLoopSystem;
