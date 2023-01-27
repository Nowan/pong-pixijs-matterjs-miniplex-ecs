import { World } from "miniplex";
import Entity from "../../../modules/Entity";

export default class System {
    public world: World<Entity>;

    constructor(world: World<Entity>) {
        this.world = world;
    }

    public init?(): void {}

    public update?(timeSinceLastFrameInS: number): void {}
}
