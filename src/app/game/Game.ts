import { Engine as PhysicsEngine, Runner } from "matter-js";
import { World as EcsEngine } from "miniplex";
import { utils } from "pixi.js";
import {
    Entity,
    EntityFactory,
    System,
    PhysicsSystem,
    KeyMoveSystem,
    MatchSystem,
    RoundSystem,
    DeadzoneCollisionSystem,
    PixiSystem,
    MatchScore,
} from "./ecs";
import { LevelContainer } from "./utils/parseLevel";

type Engines = { physics: PhysicsEngine; ecs: EcsEngine<Entity> };

export default class Game {
    public events: utils.EventEmitter;

    private _level: LevelContainer;
    private _engines: Engines;
    private _entityFactory: EntityFactory;
    private _systems: Array<System>;
    private _matchSystem: MatchSystem;

    constructor(level: LevelContainer) {
        this.events = new utils.EventEmitter();

        this._level = level;
        this._engines = { physics: createPhysicsEngine(), ecs: createEcsEngine() };
        this._entityFactory = createEntityFactory(this._level, this._engines);
        this._systems = createSystems(this._level, this._engines, this._entityFactory, this.events);
        this._matchSystem = lookupMatchSystem(this._systems)!;
    }

    public get score(): MatchScore {
        return this._matchSystem.entity.match.score;
    }

    public init() {
        this._initSystems();
        this._initEntities();
        this._initPhysics();
    }

    public update(timeSinceLastFrameInS: number) {
        this._engines.ecs.queue.flush();
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

function createEntityFactory(level: LevelContainer, { ecs }: Engines) {
    return new EntityFactory(ecs, level);
}

function createSystems(
    level: LevelContainer,
    { ecs, physics }: Engines,
    entityFactory: EntityFactory,
    eventBus: utils.EventEmitter,
): Array<System> {
    return [
        new KeyMoveSystem(ecs),
        new PhysicsSystem(ecs, physics),
        new MatchSystem(ecs, entityFactory, eventBus),
        new RoundSystem(ecs, entityFactory, level),
        new DeadzoneCollisionSystem(ecs),
        new PixiSystem(ecs, level),
    ];
}

function lookupMatchSystem(systems: Array<System>): MatchSystem | undefined {
    return systems.find((system) => system instanceof MatchSystem) as MatchSystem | undefined;
}

export * from "./Event";
