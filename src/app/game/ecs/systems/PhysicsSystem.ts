import System from "./System";
import { Entity } from "../entities";
import { World as EcsEngine, Archetype } from "miniplex";
import { Engine as PhysicsEngine, World } from "matter-js";

export class PhysicsSystem extends System {
    private _physics: PhysicsEngine;
    private _archetypes: {
        physics: Archetype<Entity>;
        pixiAndPhysics: Archetype<Entity>;
    };

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine) {
        super(ecs);

        this._physics = physics;
        this._archetypes = {
            physics: ecs.archetype("physics") as Archetype<Entity>,
            pixiAndPhysics: ecs.archetype("pixi", "physics") as Archetype<Entity>,
        };
    }

    init() {
        this._physics.gravity.y = 0;

        this._archetypes.physics.onEntityAdded.add((entity) => {
            World.addBody(this._physics.world, entity.physics);
        });

        this._archetypes.physics.onEntityRemoved.add((entity) => {
            entity.physics && World.remove(this._physics.world, entity.physics);
        });
    }

    public update(dt: number): void {
        for (let entity of this._archetypes.pixiAndPhysics.entities) {
            entity.pixi.position.copyFrom(entity.physics.position);
            entity.pixi.rotation = entity.physics.angle;
        }
    }
}

export default PhysicsSystem;
