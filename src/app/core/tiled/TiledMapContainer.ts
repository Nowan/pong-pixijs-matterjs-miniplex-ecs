import { Container, Rectangle } from "pixi.js";
import TiledMap from "tiled-types";

export type TiledMapContainer = Container & {
    tiled: TiledMap;
    staticBounds: Rectangle;
    layers: Array<TiledLayerContainer>;
    layerNameToContainerMap: Map<string, TiledLayerContainer>;
};

export type TiledLayerContainer = Container;

export default TiledMapContainer;
