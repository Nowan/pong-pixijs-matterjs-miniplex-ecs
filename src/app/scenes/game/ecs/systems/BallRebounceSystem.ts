import System from "./System";
import { BallEntity, Entity, PhysicsEntity } from "../entities";
import { Body, Detector } from "matter-js";
import { World as EcsEngine, Archetype } from "miniplex";

export class BallRebounceSystem extends System {
    private _archetypes: {
        ball: Archetype<BallEntity>;
        physics: Archetype<PhysicsEntity>;
    };

    private _detectors: {
        paddle: Array<Detector>;
        border: Array<Detector>;
    };

    constructor(ecs: EcsEngine<Entity>) {
        super(ecs);

        this._archetypes = {
            ball: ecs.archetype("ball") as Archetype<BallEntity>,
            physics: ecs.archetype("physics") as Archetype<PhysicsEntity>,
        };

        this._detectors = {
            paddle: [],
            border: [],
        };
    }

    init() {
        this._archetypes.ball.onEntityAdded.add((ball) => {
            const staticBodyEntities = this._archetypes.physics.entities.filter(
                ({ physics }) => physics.isStatic && !physics.isSensor,
            );

            for (let staticBody of staticBodyEntities) {
                if (staticBody.id.includes("PADDLE")) {
                    this._detectors.paddle.push(Detector.create({ bodies: [ball.physics, staticBody.physics] }));
                } else {
                    this._detectors.border.push(Detector.create({ bodies: [ball.physics, staticBody.physics] }));
                }
            }
        });

        this._archetypes.ball.onEntityRemoved.add((ball) => {
            removeDetectorsOfBody(this._detectors.border, ball.physics);
            removeDetectorsOfBody(this._detectors.paddle, ball.physics);
        });
    }

    update() {
        for (let detector of this._detectors.border) {
            const [collision] = Detector.collisions(detector);

            if (collision) {
                const { bodyA: border, bodyB: ball } = collision;

                Body.setVelocity(ball, { x: 0, y: 0 });
                Body.setAngularVelocity(ball, 0);
            }
        }
    }
}

function removeDetectorsOfBody(detectors: Array<Detector>, body: Body) {
    const detectorsToRemove = detectors.filter((detector) => detector.bodies.includes(body));

    for (let detector of detectorsToRemove) {
        Detector.clear(detector);
        detectors.splice(detectors.indexOf(detector), 1);
    }
}

export default BallRebounceSystem;
