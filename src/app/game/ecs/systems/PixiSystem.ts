import System from "./System";
import { World as EcsEngine, Archetype } from "miniplex";
import { Entity, PixiEntity, PixiPhysicsEntity } from "../entities";
import { LevelContainer } from "../../parseLevel";

export class PixiSystem extends System {
    private _level: LevelContainer;
    private _archetypes: {
        pixi: Archetype<PixiEntity>;
        pixiPhysics: Archetype<PixiPhysicsEntity>;
    };

    constructor(ecs: EcsEngine<Entity>, level: LevelContainer) {
        super(ecs);

        this._level = level;
        this._archetypes = {
            pixi: this.ecs.archetype("pixi") as unknown as Archetype<PixiEntity>,
            pixiPhysics: this.ecs.archetype("pixi", "physics") as Archetype<PixiPhysicsEntity>,
        };
    }

    init() {
        this._archetypes.pixi.onEntityAdded.add(({ pixi: displayObject }) => {
            if (!displayObject.parent) {
                this._level.addChild(displayObject);
            }
        });

        this._archetypes.pixi.onEntityRemoved.add(({ pixi: displayObject }) => {
            if (displayObject.parent) displayObject.parent.removeChild(displayObject);
        });
    }

    public update(): void {
        for (let entity of this._archetypes.pixiPhysics.entities) {
            entity.pixi.position.copyFrom(entity.physics.position);
            entity.pixi.rotation = entity.physics.angle;
        }
    }
}

export default PixiSystem;
