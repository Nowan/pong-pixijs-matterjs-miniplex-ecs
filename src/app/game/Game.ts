import { Engine as PhysicsEngine, Runner } from "matter-js";
import { World as EcsEngine } from "miniplex";
import { Entity, System, KeyMoveSystem, PhysicsSystem } from "../ecs";
import { LevelContainer } from "./parseLevel";
import initEntities from "./initEntities";

type Engines = { physics: PhysicsEngine; ecs: EcsEngine<Entity> };

export default class Game {
    private _engines: Engines;
    private _systems: Array<System>;

    constructor() {
        this._engines = { physics: createPhysicsEngine(), ecs: createEcsEngine() };
        this._systems = createSystems(this._engines);
    }

    public init(level: LevelContainer) {
        this._systems.forEach((system) => system.init?.());

        initEntities(level, this._engines.ecs);
        Runner.run(this._engines.physics);
    }

    public update(timeSinceLastFrameInS: number) {
        this._systems.forEach((system) => system.update?.(timeSinceLastFrameInS));
    }
}

function createPhysicsEngine(): PhysicsEngine {
    const physicsEngine = PhysicsEngine.create();
    physicsEngine.gravity.y = 0;
    return physicsEngine;
}

function createEcsEngine(): EcsEngine<Entity> {
    return new EcsEngine<Entity>();
}

function createSystems({ ecs, physics }: Engines): Array<System> {
    return [new PhysicsSystem(ecs, physics), new KeyMoveSystem(ecs)];
}
