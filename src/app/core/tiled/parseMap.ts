import { Container, DisplayObject, Graphics, Rectangle } from "pixi.js";
import TiledMap, { TiledLayer, TiledObject, TiledLayerTilelayer, TiledLayerObjectgroup } from "tiled-types";
import { TiledMapContainer, TiledLayerContainer } from "./TiledMapContainer";

export default function parseMap(tiledMap: TiledMap): TiledMapContainer {
    const world = new Container() as TiledMapContainer;
    const worldWidth = tiledMap.width * tiledMap.tilewidth;
    const worldHeight = tiledMap.height * tiledMap.tileheight;

    world.name = "World";
    world.map = tiledMap;
    world.staticBounds = new Rectangle(0, 0, worldWidth, worldHeight);
    world.layers = [];
    world.layerNameToContainerMap = new Map();

    for (let tiledLayer of tiledMap.layers) {
        const layer = world.addChild(parseLayer(tiledLayer));
        layer.name = tiledLayer.name;

        world.layers.push(layer);
        world.layerNameToContainerMap.set(tiledLayer.name, layer);
    }

    return world;
}

function parseLayer(tiledLayer: TiledLayer): TiledLayerContainer {
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

function parseTilesLayer(tiledLayer: TiledLayerTilelayer): TiledLayerContainer {
    return new Container() as TiledLayerContainer;
}

function parseObjectsLayer(tiledLayer: TiledLayerObjectgroup): TiledLayerContainer {
    const layer = new Container() as TiledLayerContainer;

    for (let tiledObject of tiledLayer.objects) {
        layer.addChild(parseObject(tiledObject));
    }

    return layer;
}

function parseObject(tiledObject: TiledObject): DisplayObject {
    if (tiledObject.point) {
        return parsePoint(tiledObject);
    }
    if (tiledObject.ellipse) {
        return parseEllipse(tiledObject);
    }

    return parseRect(tiledObject);
}

function parsePoint(tiledObject: TiledObject): DisplayObject {
    return copyProperties(new Container(), tiledObject);
}

function parseEllipse(tiledObject: TiledObject): DisplayObject {
    return copyProperties(
        new Graphics().beginFill(0xffffff).drawEllipse(0, 0, tiledObject.width, tiledObject.height).endFill(),
        tiledObject,
    );
}

function parseRect(tiledObject: TiledObject): DisplayObject {
    return copyProperties(
        new Graphics().beginFill(0xffffff).drawRect(0, 0, tiledObject.width, tiledObject.height).endFill(),
        tiledObject,
    );
}

function copyProperties(displayObject: DisplayObject, tiledObject: TiledObject) {
    displayObject.position.set(tiledObject.x, tiledObject.y);
    displayObject.name = tiledObject.name;
    displayObject.visible = tiledObject.visible;
    return displayObject;
}
