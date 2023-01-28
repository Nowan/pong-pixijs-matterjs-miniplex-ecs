import { World as EcsEngine, IEntity } from "miniplex";

export class System<ENTITY extends IEntity> {
    public ecs: EcsEngine<ENTITY>;

    constructor(ecs: EcsEngine<ENTITY>) {
        this.ecs = ecs;
    }

    public init?(): void {}

    public update?(timeSinceLastFrameInS: number): void {}
}

export default System;
