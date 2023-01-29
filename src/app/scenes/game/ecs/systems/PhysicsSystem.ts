import System from "./System";
import { Entity, PhysicsEntity } from "../entities";
import { World as EcsEngine, Archetype } from "miniplex";
import { Engine as PhysicsEngine, World } from "matter-js";

export class PhysicsSystem extends System {
    private _physics: PhysicsEngine;
    private _archetype: Archetype<PhysicsEntity>;

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine) {
        super(ecs);

        this._physics = physics;
        this._archetype = ecs.archetype("physics") as Archetype<PhysicsEntity>;
    }

    init() {
        this._physics.gravity.y = 0;

        this._archetype.onEntityAdded.add((entity) => World.addBody(this._physics.world, entity.physics));

        this._archetype.onEntityRemoved.add((entity) => World.remove(this._physics.world, entity.physics));
    }
}

export default PhysicsSystem;
