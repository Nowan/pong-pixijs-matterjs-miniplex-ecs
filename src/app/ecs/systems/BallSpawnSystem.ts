import System from "./System";
import { World as EcsEngine, Archetype } from "miniplex";
import { Bodies, Body } from "matter-js";
import Entity, { BallEntity } from "../entities";
import { LevelContainer } from "../../game/parseLevel";
import { IPointData, Graphics } from "pixi.js";

export class BallSpawnSystem extends System {
    private _ecs: EcsEngine<Entity>;
    private _level: LevelContainer;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer) {
        super(ecs);

        this._ecs = ecs;
        this._level = level;
        this._ecs.archetype("id");
    }

    init() {
        const ballEntity = this._ecs.createEntity(createBallEntity(this._level)) as BallEntity;

        Body.setVelocity(ballEntity.physics, { x: 0, y: 10 });
    }
}

function createBallEntity(level: LevelContainer): BallEntity {
    const graphics = createBallGraphics(level);
    const serveLine = level.serveLine;
    const spawnPoint = pickRandomPointOnLine(serveLine.start, serveLine.end);

    return {
        id: "Ball",
        pixi: graphics,
        physics: Bodies.circle(spawnPoint.x, spawnPoint.y, Math.max(graphics.width, graphics.height) * 0.5),
    };
}

function createBallGraphics(level: LevelContainer): Graphics {
    const ball = level.ballPrototype.clone();
    ball.name = "BALL";
    ball.visible = true;
    return level.addChild(ball);
}

function pickRandomPointOnLine(pointA: IPointData, pointB: IPointData): IPointData {
    const dX = pointB.x - pointA.x;
    const dY = pointB.y - pointA.y;
    const dH = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    const randomH = Math.random() * dH;
    const angle = Math.atan2(dY, dX);

    return { x: pointA.x + randomH * Math.cos(angle), y: pointA.y + randomH * Math.sin(angle) };
}

export default BallSpawnSystem;
