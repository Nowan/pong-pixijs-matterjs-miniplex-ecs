import { Container, DisplayObject, Rectangle } from "pixi.js";
import TiledMap, { TiledLayer, TiledObject, TiledLayerTilelayer, TiledLayerObjectgroup } from "tiled-types";
import TiledContainer from "./TiledContainer";

export default function parseMap(tiledMap: TiledMap): TiledContainer {
    const world = new Container() as TiledContainer;
    const worldWidth = tiledMap.width * tiledMap.tilewidth;
    const worldHeight = tiledMap.height * tiledMap.tileheight;

    world.name = "World";
    world.map = tiledMap;
    world.staticBounds = new Rectangle(0, 0, worldWidth, worldHeight);
    world.layers = [];
    world.layerNameToContainerMap = new Map();

    for (let tiledLayer of tiledMap.layers) {
        const layer = world.addChild(parseLayer(tiledLayer));

        world.layers.push(layer);
        world.layerNameToContainerMap.set(tiledLayer.name, layer);
    }

    return world;
}

function parseLayer(tiledLayer: TiledLayer): Container {
    // TODO: add support for more layers and objects
    switch (tiledLayer.type) {
        case "tilelayer":
            return parseTilesLayer(tiledLayer);
        case "objectgroup":
            return parseObjectsLayer(tiledLayer);
        default:
            return new Container();
    }
}

function parseTilesLayer(tiledLayer: TiledLayerTilelayer): Container {
    return new Container();
}

function parseObjectsLayer(tiledLayer: TiledLayerObjectgroup): Container {
    const layer = new Container();
    layer.name = `ObjectsLayer | ${tiledLayer.name}`;

    for (let tiledObject of tiledLayer.objects) {
        layer.addChild(parseObject(tiledObject));
    }

    return layer;
}

function parseObject(tiledObject: TiledObject): DisplayObject {
    if (tiledObject.point) {
        return parsePoint(tiledObject);
    }

    return new Container();
}

function parsePoint(tiledObject: TiledObject): Container {
    const point = new Container();
    point.position.set(tiledObject.x, tiledObject.y);
    point.name = `Point | ${tiledObject.name}`;
    return point;
}
