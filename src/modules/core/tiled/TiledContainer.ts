import { Container, Rectangle } from "pixi.js";
import TiledMap from "tiled-types";

export type TiledContainer = Container & {
    staticBounds: Rectangle;
    map: TiledMap;
    layers: Array<Container>;
    layerNameToContainerMap: Map<string, Container>;
};

export default TiledContainer;
