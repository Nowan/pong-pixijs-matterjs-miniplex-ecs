import { PixiComponent, PhysicsComponent, MoveOnKeysComponent } from "../components";

export type Entity = { id: string } & Partial<PixiComponent & MoveOnKeysComponent & PhysicsComponent>;

export type BallEntity = Omit<Entity, keyof MoveOnKeysComponent> & Required<PixiComponent & MoveOnKeysComponent>;

export type PaddleEntity = Entity & Required<PixiComponent & MoveOnKeysComponent & PhysicsComponent>;

export default Entity;
