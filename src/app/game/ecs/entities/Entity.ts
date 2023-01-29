import { ExcludeKeys } from "../../../core/utils/utilityTypes";
import { PixiComponent, PhysicsComponent, MoveOnKeysComponent, BallComponent, DeadzoneComponent } from "../components";

export type Entity = { id: string } & Partial<
    PixiComponent & MoveOnKeysComponent & PhysicsComponent & BallComponent & DeadzoneComponent
>;

export type PhysicsEntity = Required<Pick<Entity, "id" | keyof PhysicsComponent>>;

export type PixiPhysicsEntity = PhysicsEntity & Required<Pick<Entity, keyof PixiComponent>>;

export type BallEntity = PixiPhysicsEntity & BallComponent;

export type PaddleEntity = PixiPhysicsEntity & MoveOnKeysComponent;

export type LevelBorderEntity = PixiPhysicsEntity;

export type DeadzoneEntity = PhysicsEntity & DeadzoneComponent;

export default Entity;
