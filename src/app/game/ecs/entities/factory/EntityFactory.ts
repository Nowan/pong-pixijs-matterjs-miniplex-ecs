import { RegisteredEntity, World as EcsEngine } from "miniplex";
import { LevelContainer } from "../../../parseLevel";
import { Entity, BallEntity, LevelBorderEntity, PaddleEntity } from "../Entity";
import {
    composeLeftPaddleEntity,
    composeRightPaddleEntity,
    composeUpperBorderEntity,
    composeLowerBorderEntity,
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
        return this._registerEntity(composeLeftPaddleEntity(this._level.paddles.left));
    }

    public createRightPaddleEntity(): RegisteredEntity<PaddleEntity> {
        return this._registerEntity(composeRightPaddleEntity(this._level.paddles.right));
    }

    public createUpperBorderEntity(): RegisteredEntity<LevelBorderEntity> {
        return this._registerEntity(composeUpperBorderEntity(this._level));
    }

    public createLowerBorderEntity(): RegisteredEntity<LevelBorderEntity> {
        return this._registerEntity(composeLowerBorderEntity(this._level));
    }

    public createBallEntity(): RegisteredEntity<BallEntity> {
        return this._registerEntity(composeBallEntity(this._level));
    }

    private _registerEntity<ENTITY extends Entity>(entity: ENTITY): RegisteredEntity<ENTITY> {
        return this._ecs.createEntity(entity) as unknown as RegisteredEntity<ENTITY>;
    }
}

export default EntityFactory;
