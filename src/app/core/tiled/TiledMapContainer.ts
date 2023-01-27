import { Container, Rectangle } from "pixi.js";
import TiledMap from "tiled-types";

export type TiledMapContainer = Container & {
    staticBounds: Rectangle;
    map: TiledMap;
    layers: Array<TiledLayerContainer>;
    layerNameToContainerMap: Map<string, TiledLayerContainer>;
};

export type TiledLayerContainer = Container;

export default TiledMapContainer;
