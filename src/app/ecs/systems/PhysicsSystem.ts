import System from "./System";
import Entity from "../entities";
import { World as EcsEngine, Archetype } from "miniplex";
import { Engine as PhysicsEngine, World } from "matter-js";

export class PhysicsSystem extends System {
    private _physics: PhysicsEngine;
    private _archetype: Archetype<Entity>;

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine) {
        super(ecs);

        this._physics = physics;
        this._archetype = ecs.archetype("physics", "pixi") as Archetype<Entity>;
    }

    init() {
        this._physics.gravity.y = 0;

        this._archetype.onEntityAdded.add((entity) => {
            World.addBody(this._physics.world, entity.physics);
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
