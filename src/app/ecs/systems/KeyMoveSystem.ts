import { Listener as KeypressListener } from "keypress.js";
import { Body } from "matter-js";
import { Archetype, World as Miniplex } from "miniplex";
import Entity from "../entities";
import System from "./System";

export class KeyMoveSystem extends System {
    private _archetype: Archetype<Entity>;
    private _listener: KeypressListener;

    constructor(miniplex: Miniplex<Entity>) {
        super(miniplex);

        this._archetype = miniplex.archetype("moveOnKeys", "physics") as Archetype<Entity>;
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
}

export default KeyMoveSystem;
