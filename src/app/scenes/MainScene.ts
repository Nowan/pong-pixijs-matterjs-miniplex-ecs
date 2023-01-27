import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import { World as Miniplex } from "miniplex";
import { Engine, Runner } from "matter-js";
import { Entity, System, KeyMoveSystem, PhysicsSystem } from "../ecs";
import Scene, { FacadeRefs } from "../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import parseLevel from "../core/parseLevel";
import initEntities from "../core/initEntities";

export default class MainScene extends Scene {
    private _viewport: Viewport;
    private _physics: Engine;
    private _miniplex: Miniplex<Entity>;
    private _systems: Array<System>;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._viewport = this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: 1024,
                worldHeight: 768,
            }),
        );

        this._physics = Engine.create();
        this._miniplex = new Miniplex();
        this._systems = [new PhysicsSystem(this._miniplex, this._physics), new KeyMoveSystem(this._miniplex)];
    }

    public async load(): Promise<void> {
        await Assets.load("assets/levels/main.tiled.json");
    }

    public init(): void {
        const levelData = Assets.cache.get("assets/levels/main.tiled.json") as TiledMap;
        const level = parseLevel(levelData);

        this._viewport.resize(undefined, undefined, level.staticBounds.width, level.staticBounds.height);
        this._viewport.addChild(level);

        this._physics.gravity.y = 0;

        this._systems.forEach((system) => system.init?.());

        initEntities(level, this._miniplex);
        Runner.run(this._physics);
    }

    public resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
    }

    public update(timeSinceLastFrameInS: number, timeSinceSceneInitiatedInS: number): void {
        this._systems.forEach((system) => system.update?.(timeSinceLastFrameInS));
    }
}
