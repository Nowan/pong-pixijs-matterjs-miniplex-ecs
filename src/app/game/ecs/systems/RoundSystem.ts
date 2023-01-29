import { Body, Vector } from "matter-js";
import { World as EcsEngine, Archetype } from "miniplex";
import { IPointData } from "pixi.js";
import { LevelContainer } from "../../parseLevel";
import Player from "../../Player";
import { DeadzoneEntity, Entity, EntityFactory, RoundEntity } from "../entities";
import System from "./System";

export class RoundSystem extends System {
    private _entityFactory: EntityFactory;
    private _level: LevelContainer;
    private _archetypes: {
        round: Archetype<RoundEntity>;
        deadzone: Archetype<DeadzoneEntity>;
    };

    constructor(ecs: EcsEngine<Entity>, entityFactory: EntityFactory, level: LevelContainer) {
        super(ecs);

        this._entityFactory = entityFactory;
        this._level = level;
        this._archetypes = {
            round: ecs.archetype("round") as Archetype<RoundEntity>,
            deadzone: ecs.archetype("deadzone") as Archetype<DeadzoneEntity>,
        };
    }

    public init(): void {
        this._archetypes.round.onEntityAdded.add((entity) => {
            this._serveBall(entity.round.servedByPlayer);
        });
    }

    public update(): void {
        if (this._archetypes.round.entities.length === 0) return;

        for (let { deadzone } of this._archetypes.deadzone.entities) {
            if (deadzone.triggered) {
                const [entity] = this._archetypes.round.entities;
                entity.round.lostByPlayer = deadzone.keeper;

                this.ecs.queue.destroyEntity(entity);
            }
        }
    }

    private _serveBall(servingPlayer: Player): void {
        const serveLine = this._level.serveLine;
        const ballEntity = this._entityFactory.createBallEntity();

        Body.setPosition(ballEntity.physics, pickRandomPointOnLine(...serveLine));
        Body.setVelocity(ballEntity.physics, pickInitialVelocity(servingPlayer));
    }
}

function pickInitialVelocity(servingPlayer: Player): Vector {
    const directionMultiplier = servingPlayer === Player.ONE ? 1 : -1;
    return { x: 10 * directionMultiplier, y: Math.random() * 4 - 2 };
}

function pickRandomPointOnLine(pointA: IPointData, pointB: IPointData): IPointData {
    const dX = pointB.x - pointA.x;
    const dY = pointB.y - pointA.y;
    const dH = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    const randomH = Math.random() * dH;
    const angle = Math.atan2(dY, dX);

    return { x: pointA.x + randomH * Math.cos(angle), y: pointA.y + randomH * Math.sin(angle) };
}

export default RoundSystem;
