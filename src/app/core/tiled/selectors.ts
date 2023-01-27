import { DisplayObject } from "pixi.js";
import { TiledMapContainer } from "./TiledMapContainer";

export function selectObjectWithName<T extends DisplayObject>(
    tiledMapContainer: TiledMapContainer,
    name: string,
): T | null {
    for (let layer of tiledMapContainer.layers) {
        const child = layer.children.find((child) => child.name === name);
        if (child) return child as T;
    }

    return null;
}
