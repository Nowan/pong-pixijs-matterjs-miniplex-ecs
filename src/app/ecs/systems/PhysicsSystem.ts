import System from "./System";
import Entity from "../entities";
import { World as Miniplex, Archetype } from "miniplex";
import { Engine, World } from "matter-js";

export class PhysicsSystem extends System {
    private _engine: Engine;
    private _archetype: Archetype<Entity>;

    constructor(miniplex: Miniplex<Entity>, engine: Engine) {
        super(miniplex);

        this._engine = engine;
        this._archetype = miniplex.archetype("physics", "pixi") as Archetype<Entity>;
    }

    init() {
        this._archetype.onEntityAdded.add((entity) => {
            World.addBody(this._engine.world, entity.physics);
        });
    }

    public update(dt: number): void {
        for (let entity of this._archetype.entities) {
            entity.pixi.position.copyFrom(entity.physics.position);
            entity.pixi.rotation = entity.physics.angle;
        }
    }
}

export default PhysicsSystem;
