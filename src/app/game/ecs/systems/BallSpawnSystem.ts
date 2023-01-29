import System from "./System";
import { World as EcsEngine, Archetype } from "miniplex";
import { Body, Vector } from "matter-js";
import { Entity, EntityFactory } from "../entities";
import { LevelContainer } from "../../parseLevel";
import { IPointData } from "pixi.js";

export class BallSpawnSystem extends System {
    private _ecs: EcsEngine<Entity>;
    private _level: LevelContainer;
    private _entityFactory: EntityFactory;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer, entityFactory: EntityFactory) {
        super(ecs);

        this._ecs = ecs;
        this._level = level;
        this._ecs.archetype("id");
        this._entityFactory = entityFactory;
    }

    init() {
        // Temporary, need to resolve initialization sequence order later
        setTimeout(() => {
            const serveLine = this._level.serveLine;
            const ballEntity = this._entityFactory.createBallEntity();

            Body.setPosition(ballEntity.physics, pickRandomPointOnLine(...serveLine));
            Body.setVelocity(ballEntity.physics, pickInitialVelocity());
        }, 0);
    }
}

function pickInitialVelocity(): Vector {
    return { x: 10, y: -2 };
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
