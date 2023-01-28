import { Engine as PhysicsEngine, Runner } from "matter-js";
import { World as EcsEngine } from "miniplex";
import { Entity, System, PhysicsSystem, KeyMoveSystem, BallSpawnSystem } from "../ecs";
import { LevelContainer } from "./parseLevel";
import initEntities from "./initEntities";

type Engines = { physics: PhysicsEngine; ecs: EcsEngine<Entity> };

export default class Game {
    private _level: LevelContainer;
    private _engines: Engines;
    private _systems: Array<System>;

    constructor(level: LevelContainer) {
        this._level = level;
        this._engines = { physics: createPhysicsEngine(), ecs: createEcsEngine() };
        this._systems = createSystems(level, this._engines);
    }

    public init() {
        this._systems.forEach((system) => system.init?.());

        initEntities(this._level, this._engines.ecs);
        Runner.run(this._engines.physics);
    }

    public update(timeSinceLastFrameInS: number) {
        this._systems.forEach((system) => system.update?.(timeSinceLastFrameInS));
    }
}

function createPhysicsEngine(): PhysicsEngine {
    return PhysicsEngine.create();
}

function createEcsEngine(): EcsEngine<Entity> {
    return new EcsEngine<Entity>();
}

function createSystems(level: LevelContainer, { ecs, physics }: Engines): Array<System> {
    return [new PhysicsSystem(ecs, physics), new KeyMoveSystem(ecs), new BallSpawnSystem(ecs, level)];
}
