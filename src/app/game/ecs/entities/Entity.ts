import { ExcludeKeys } from "../../../core/utils/utilityTypes";
import { PixiComponent, PhysicsComponent, MoveOnKeysComponent } from "../components";

export type Entity = { id: string } & Partial<PixiComponent & MoveOnKeysComponent & PhysicsComponent>;

export type BallEntity = Required<ExcludeKeys<Entity, keyof MoveOnKeysComponent>>;

export type PaddleEntity = Required<Entity>;

export type LevelBorderEntity = Required<ExcludeKeys<Entity, keyof MoveOnKeysComponent>>;

// export type LevelBorderEntity = Required<ExcludeKeys<Entity, keyof MoveOnKeysComponent | keyof PixiComponent>>;

export default Entity;
