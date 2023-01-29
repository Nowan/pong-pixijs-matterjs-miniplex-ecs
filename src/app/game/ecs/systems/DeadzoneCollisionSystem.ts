import System from "./System";
import { BallEntity, DeadzoneEntity, Entity } from "../entities";
import { Detector, Collision } from "matter-js";
import { World as EcsEngine, Archetype } from "miniplex";

export class DeadzoneCollisionSystem extends System {
    private _archetypes: {
        ball: Archetype<BallEntity>;
        deadzone: Archetype<DeadzoneEntity>;
    };
    private _detectors: Array<Detector>;

    constructor(ecs: EcsEngine<Entity>) {
        super(ecs);

        this._archetypes = {
            ball: ecs.archetype("ball") as Archetype<BallEntity>,
            deadzone: ecs.archetype("deadzone") as Archetype<DeadzoneEntity>,
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

    update() {
        this._archetypes.deadzone.entities.forEach(({ deadzone }) => (deadzone.triggered = false));

        for (let detector of this._detectors) {
            const [collision] = Detector.collisions(detector);

            if (collision) {
                const deadzoneEntity = lookupCollidingEntity(this._archetypes.deadzone.entities, collision);
                const ballEntity = lookupCollidingEntity(this._archetypes.ball.entities, collision);

                if (deadzoneEntity) deadzoneEntity.deadzone.triggered = true;
                if (ballEntity) this.ecs.queue.destroyEntity(ballEntity);
            }
        }
    }
}

function lookupCollidingEntity<ENTITY extends BallEntity | DeadzoneEntity>(
    entities: Array<ENTITY>,
    collision: Collision,
): ENTITY | undefined {
    return entities.find(({ physics: entityBody }) =>
        [collision.bodyA, collision.bodyB].some((collisionBody) => collisionBody === entityBody),
    );
}

export default DeadzoneCollisionSystem;
