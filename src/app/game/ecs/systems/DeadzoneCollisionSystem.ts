import System from "./System";
import { DeadzoneEntity, Entity } from "../entities";
import { Engine as PhysicsEngine, Detector, Collision } from "matter-js";
import { World as EcsEngine, Archetype } from "miniplex";

export class DeadzoneCollisionSystem extends System {
    private _physics: PhysicsEngine;
    private _archetypes: {
        ball: Archetype<Entity>;
        deadzone: Archetype<Entity>;
    };
    private _detectors: Array<Detector>;

    constructor(ecs: EcsEngine<Entity>, physics: PhysicsEngine) {
        super(ecs);

        this._physics = physics;
        this._archetypes = {
            ball: ecs.archetype("ball") as Archetype<Entity>,
            deadzone: ecs.archetype("deadzone") as Archetype<Entity>,
        };
        this._detectors = [];
    }

    init() {
        this._archetypes.ball.onEntityAdded.add((ball) => {
            for (let deadzone of this._archetypes.deadzone.entities) {
                this._detectors.push(Detector.create({ bodies: [deadzone.physics, ball.physics] }));
            }
        });

        this._archetypes.ball.onEntityRemoved.add((ball) => {
            const detectorsToRemove = this._detectors.filter(
                (detector) => ball.physics && detector.bodies.includes(ball.physics),
            );

            for (let detector of detectorsToRemove) {
                Detector.clear(detector);
                this._detectors.splice(this._detectors.indexOf(detector), 1);
            }
        });
    }

    update(dt: number) {
        for (let detector of this._detectors) {
            const [collision] = Detector.collisions(detector);

            if (collision) {
                const deadzoneEntity = this._lookupCollidingDeadzoneEntity(collision);
                // TODO: do something with collision
                console.log(deadzoneEntity);
            }
        }
    }

    _lookupCollidingDeadzoneEntity(collision: Collision): DeadzoneEntity | undefined {
        return this._archetypes.deadzone.entities.find(({ physics: entityBody }) =>
            [collision.bodyA, collision.bodyB].some((collisionBody) => collisionBody === entityBody),
        );
    }
}

export default DeadzoneCollisionSystem;
