import { Listener as KeypressListener } from "keypress.js";
import { Archetype, World } from "miniplex";
import Entity from "../Entity";
import System from "./System";

export default class KeyMoveSystem extends System {
    private _archetype: Archetype<Entity>;
    private _listener: KeypressListener;

    constructor(world: World<Entity>) {
        super(world);

        this._archetype = world.archetype("moveOnKeys", "physics");
        this._listener = new KeypressListener();
    }

    public init(): void {
        for (let entity of this._archetype.entities) {
            for (let [moveKey, moveDirection] of Object.entries(entity.moveOnKeys)) {
                this._listener.register_many([
                    {
                        keys: moveKey,
                        on_keydown: () => {
                            entity.physics.velocity.y = moveDirection;
                        },
                        on_keyup: () => {
                            entity.physics.velocity.y = 0;
                        },
                        prevent_repeat: true,
                    },
                ]);
            }
        }
    }

    public update(dt: number): void {
        for (let entity of this._archetype.entities) {
            entity.pixi.position.y += entity.physics.velocity.y;
        }
    }
}
