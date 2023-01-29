import {
    PixiComponent,
    PhysicsComponent,
    MoveOnKeysComponent,
    BallComponent,
    DeadzoneComponent,
    MatchComponent,
    RoundComponent,
} from "../components";

export type Entity = { id: string } & Partial<
    PixiComponent &
        MoveOnKeysComponent &
        PhysicsComponent &
        BallComponent &
        DeadzoneComponent &
        MatchComponent &
        RoundComponent
>;

export type PixiEntity = Required<Pick<Entity, keyof PixiComponent>>;

export type PhysicsEntity = Required<Pick<Entity, "id" | keyof PhysicsComponent>>;

export type PixiPhysicsEntity = PixiEntity & PhysicsEntity;

export type MatchEntity = Required<Pick<Entity, "id" | keyof MatchComponent>>;

export type RoundEntity = Required<Pick<Entity, "id" | keyof RoundComponent>>;

export type BallEntity = PixiPhysicsEntity & BallComponent;

export type PaddleEntity = PixiPhysicsEntity & MoveOnKeysComponent;

export type LevelBorderEntity = PixiPhysicsEntity;

export type DeadzoneEntity = PhysicsEntity & DeadzoneComponent;

export default Entity;
