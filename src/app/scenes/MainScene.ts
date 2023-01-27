import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import { World } from "miniplex";
import { Entity, System, KeyMoveSystem, MoveKey, MoveDirection } from "../ecs";
import Scene, { FacadeRefs } from "../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import parseTiledMap from "../core/tiled/parseMap";

export default class MainScene extends Scene {
    private _viewport: Viewport;
    private _world: World<Entity>;
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

        this._world = new World();
        this._systems = [];
    }

    init() {
        const levelData = Assets.cache.get("assets/levels/main.tiled.json") as TiledMap;
        const level = parseTiledMap(levelData);
        const racketLeft = level.layers[0].children.find((child) => child.name === "RACKET_LEFT");
        const racketRight = level.layers[0].children.find((child) => child.name === "RACKET_RIGHT");
        const ball = level.layers[0].children.find((child) => child.name === "BALL");

        this._viewport.resize(undefined, undefined, level.staticBounds.width, level.staticBounds.height);
        this._viewport.addChild(level);

        if (racketLeft) {
            const playerEntity = this._world.createEntity({ id: "PlayerLeft", pixi: racketLeft });
            this._world.addComponent(playerEntity, "physics", { velocity: { x: 0, y: 0 } });
            this._world.addComponent(playerEntity, "moveOnKeys", {
                [MoveKey.W]: MoveDirection.UP,
                [MoveKey.S]: MoveDirection.DOWN,
            });
        }

        if (racketRight) {
            const playerEntity = this._world.createEntity({ id: "PlayerRight", pixi: racketRight });
            this._world.addComponent(playerEntity, "physics", { velocity: { x: 0, y: 0 } });
            this._world.addComponent(playerEntity, "moveOnKeys", {
                [MoveKey.ARROW_UP]: MoveDirection.UP,
                [MoveKey.ARROW_DOWN]: MoveDirection.DOWN,
            });
        }

        this._systems.push(...initSystems(new KeyMoveSystem(this._world)));
    }

    async load(): Promise<void> {
        await Assets.load("assets/levels/main.tiled.json");
    }

    resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);
    }

    update(timeSinceLastFrameInS: number, timeSinceSceneInitiatedInS: number): void {
        this._systems.forEach((system) => system.update?.(timeSinceLastFrameInS));
    }
}

function initSystems(...systems: Array<System>) {
    systems.forEach((system) => system.init?.());
    return systems;
}
