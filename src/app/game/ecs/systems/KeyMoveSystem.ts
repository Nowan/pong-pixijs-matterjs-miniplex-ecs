import System from "./System";
import Entity from "../entities";
import { Listener as KeypressListener } from "keypress.js";
import { Body } from "matter-js";
import { World as EcsEngine, Archetype } from "miniplex";

export class KeyMoveSystem extends System {
    private _archetype: Archetype<Entity>;
    private _listener: KeypressListener;

    constructor(ecs: EcsEngine<Entity>) {
        super(ecs);

        this._archetype = ecs.archetype("moveOnKeys", "physics") as Archetype<Entity>;
        this._listener = new KeypressListener();
    }

    public init(): void {
        this._archetype.onEntityAdded.add((entity) => {
            for (let [moveKey, moveDirection] of Object.entries(entity.moveOnKeys)) {
                this._listener.register_many([
                    {
                        keys: moveKey,
                        on_keydown: () => Body.setVelocity(entity.physics, { x: 0, y: moveDirection * 10 }),
                        on_keyup: () => Body.setVelocity(entity.physics, { x: 0, y: 0 }),
                        prevent_repeat: true,
                    },
                ]);
            }
        });
    }

    public update(dt: number) {
        for (let entity of this._archetype.entities) {
            const body = entity.physics;
            Body.setPosition(body, {
                x: body.position.x + body.velocity.x,
                y: body.position.y + body.velocity.y,
            });
            // console.log(entity.physics.velocity);
        }
    }
}

export default KeyMoveSystem;
