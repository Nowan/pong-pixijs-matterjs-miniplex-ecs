import { DisplayObject } from "pixi.js";
import TiledMap, { TiledObject } from "tiled-types/types";
import { TiledMapContainer } from "./TiledMapContainer";

export function selectObjectsOfName<OBJECT extends TiledObject>(tiledMap: TiledMap, name: string): Array<OBJECT> {
    return selectObjectsMatchingPredicate(tiledMap, (object) => object.name === name);
}

export function selectObjectsMatchingPredicate<OBJECT extends TiledObject>(
    tiledMap: TiledMap,
    predicate: (object: TiledObject) => boolean,
): Array<OBJECT> {
    return tiledMap.layers.flatMap((layer) => {
        if ("objects" in layer) {
            return layer.objects.filter(predicate) as OBJECT[];
        } else {
            return [];
        }
    });
}

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
