import { PixiComponent, PhysicsComponent, MoveOnKeysComponent } from "./components";

export type Entity = { id: string } & PixiComponent & Partial<MoveOnKeysComponent & PhysicsComponent>;

export default Entity;
