import { RegisteredEntity, World as EcsEngine } from "miniplex";
import { LevelContainer } from "../../../parseLevel";
import { Entity, BallEntity, LevelBorderEntity, PaddleEntity, DeadzoneEntity } from "../Entity";
import {
    composeLeftPaddleEntity,
    composeRightPaddleEntity,
    composeUpperBorderEntity,
    composeLowerBorderEntity,
    composeLeftDeadzoneEntity,
    composeRightDeadzoneEntity,
    composeBallEntity,
} from "./composers";

export class EntityFactory {
    private _ecs: EcsEngine<Entity>;
    private _level: LevelContainer;

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer) {
        this._ecs = ecs;
        this._level = level;
    }

    public createLeftPaddleEntity(): RegisteredEntity<PaddleEntity> {
        return this._register(composeLeftPaddleEntity(this._level.paddles.left));
    }

    public createRightPaddleEntity(): RegisteredEntity<PaddleEntity> {
        return this._register(composeRightPaddleEntity(this._level.paddles.right));
    }

    public createUpperBorderEntity(): RegisteredEntity<LevelBorderEntity> {
        return this._register(composeUpperBorderEntity(this._level));
    }

    public createLowerBorderEntity(): RegisteredEntity<LevelBorderEntity> {
        return this._register(composeLowerBorderEntity(this._level));
    }

    public createLeftDeadzoneEntity(): RegisteredEntity<DeadzoneEntity> {
        return this._register(composeLeftDeadzoneEntity(this._level));
    }

    public createRightDeadzoneEntity(): RegisteredEntity<DeadzoneEntity> {
        return this._register(composeRightDeadzoneEntity(this._level));
    }

    public createBallEntity(): RegisteredEntity<BallEntity> {
        return this._register(composeBallEntity(this._level));
    }

    private _register<ENTITY extends Entity>(entity: ENTITY): RegisteredEntity<ENTITY> {
        return this._ecs.createEntity(entity) as unknown as RegisteredEntity<ENTITY>;
    }
}

export default EntityFactory;
