import { Body, Vector } from "matter-js";
import { World as EcsEngine, Archetype, RegisteredEntity } from "miniplex";
import { IPointData } from "pixi.js";
import { LevelContainer } from "../../core/parseLevel";
import Player, { opposite } from "../../core/Player";
import { DeadzoneEntity, Entity, EntityFactory, RoundEntity } from "../entities";
import System from "./System";

export class RoundSystem extends System {
    private _entityFactory: EntityFactory;
    private _level: LevelContainer;
    private _archetypes: {
        round: Archetype<RoundEntity>;
        deadzone: Archetype<DeadzoneEntity>;
    };
    private _entity: RegisteredEntity<RoundEntity> | null;

    constructor(ecs: EcsEngine<Entity>, entityFactory: EntityFactory, level: LevelContainer) {
        super(ecs);

        this._entityFactory = entityFactory;
        this._level = level;
        this._archetypes = {
            round: ecs.archetype("round") as Archetype<RoundEntity>,
            deadzone: ecs.archetype("deadzone") as Archetype<DeadzoneEntity>,
        };
        this._entity = null;
    }

    public init(): void {
        this._archetypes.round.onEntityAdded.add((entity) => {
            this._entity = entity;
        });

        this._archetypes.round.onEntityRemoved.add((entity) => {
            if (this._entity === entity) this._entity = null;
        });
    }

    public update(): void {
        if (!this._entity || this._entity.round.finished) return;
        this._attemptStartRound();
        this._attemptEndRound();
    }

    private _attemptStartRound(): void {
        if (this._entity && !this._entity.round.started) {
            this._entity.round.started = true;
            this._spawnBallAndServe(this._entity.round.servedByPlayer);
        }
    }

    private _attemptEndRound(): void {
        if (this._entity) {
            const triggeredDeadzoneKeeer = this._checkTriggeredDeadzones();

            if (triggeredDeadzoneKeeer) {
                this._entity.round.finished = true;
                this._entity.round.wonByPlayer = opposite(triggeredDeadzoneKeeer);

                this.ecs.queue.destroyEntity(this._entity);
            }
        }
    }

    private _spawnBallAndServe(servingPlayer: Player): void {
        const serveLine = this._level.serveLine;
        const ballEntity = this._entityFactory.createBallEntity();

        Body.setPosition(ballEntity.physics, pickRandomPointOnLine(...serveLine));
        Body.setVelocity(ballEntity.physics, pickInitialVelocity(servingPlayer));
    }

    private _checkTriggeredDeadzones(): Player | null {
        for (let { deadzone } of this._archetypes.deadzone.entities) {
            if (deadzone.triggered) return deadzone.keeper;
        }
        return null;
    }
}

function pickInitialVelocity(servingPlayer: Player): Vector {
    const directionMultiplier = servingPlayer === Player.ONE ? 1 : -1;
    return { x: 10, y: 10 };
    // return { x: 10 * directionMultiplier, y: Math.random() * 4 - 2 };
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
