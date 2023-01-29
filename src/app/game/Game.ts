import { Engine as PhysicsEngine, Runner } from "matter-js";
import { World as EcsEngine } from "miniplex";
import {
    Entity,
    EntityFactory,
    System,
    PhysicsSystem,
    KeyMoveSystem,
    BallSpawnSystem,
    DeadzoneCollisionSystem,
} from "./ecs";
import { LevelContainer } from "./parseLevel";
import TiledMap from "tiled-types/types";

type Engines = { physics: PhysicsEngine; ecs: EcsEngine<Entity> };

export default class Game {
    private _levelData: TiledMap;
    private _level: LevelContainer;
    private _engines: Engines;
    private _entityFactory: EntityFactory;
    private _systems: Array<System>;

    constructor(levelData: TiledMap, level: LevelContainer) {
        this._levelData = levelData;
        this._level = level;
        this._engines = { physics: createPhysicsEngine(), ecs: createEcsEngine() };
        this._entityFactory = createEntityFactory(this._level, this._engines);
        this._systems = createSystems(this._level, this._engines, this._entityFactory);
    }

    public init() {
        this._initSystems();
        this._initEntities();
        this._initPhysics();
    }

    public update(timeSinceLastFrameInS: number) {
        this._systems.forEach((system) => system.update?.(timeSinceLastFrameInS));
    }

    private _initSystems(): void {
        this._systems.forEach((system) => system.init?.());
    }

    private _initEntities(): void {
        this._entityFactory.createLeftPaddleEntity();
        this._entityFactory.createRightPaddleEntity();

        this._entityFactory.createLowerBorderEntity();
        this._entityFactory.createUpperBorderEntity();

        this._entityFactory.createLeftDeadzoneEntity();
        this._entityFactory.createRightDeadzoneEntity();
    }

    private _initPhysics(): void {
        Runner.run(this._engines.physics);
    }
}

function createPhysicsEngine(): PhysicsEngine {
    return PhysicsEngine.create();
}

function createEcsEngine(): EcsEngine<Entity> {
    return new EcsEngine<Entity>();
}

function createSystems(level: LevelContainer, { ecs, physics }: Engines, entityFactory: EntityFactory): Array<System> {
    return [
        new PhysicsSystem(ecs, physics),
        new KeyMoveSystem(ecs),
        new DeadzoneCollisionSystem(ecs, physics),
        new BallSpawnSystem(ecs, level, entityFactory),
    ];
}

function createEntityFactory(level: LevelContainer, { ecs }: Engines) {
    return new EntityFactory(ecs, level);
}
