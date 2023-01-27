import { World as Miniplex } from "miniplex";
import Entity from "../entities";

export class System {
    public miniplex: Miniplex<Entity>;

    constructor(miniplex: Miniplex<Entity>) {
        this.miniplex = miniplex;
    }

    public init?(): void {}

    public update?(timeSinceLastFrameInS: number): void {}
}

export default System;
