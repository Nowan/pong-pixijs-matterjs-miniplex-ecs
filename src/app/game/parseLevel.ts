import { Graphics, IPointData } from "pixi.js";
import { TiledMap, TiledObject } from "tiled-types";
import { TiledMapContainer } from "../core/tiled";
import parseTiledMap from "../core/tiled/parseMap";
import { selectObjectsOfName, selectObjectWithName } from "../core/tiled/selectors";
import { PartiallyRequired } from "../core/utils/utilityTypes";

export type LineData = [pointA: IPointData, pointB: IPointData];
export type LevelContainer = TiledMapContainer & {
    data: TiledMap;
    ballPrototype: Graphics;
    paddles: {
        left: Graphics;
        right: Graphics;
    };
    borderLines: {
        upper: LineData;
        lower: LineData;
    };
    serveLine: LineData;
    borderUpper: Graphics;
    borderLower: Graphics;
};

export default function parseLevel(levelData: TiledMap): LevelContainer {
    const level = parseTiledMap(levelData) as LevelContainer;
    const ballPrototype = selectObjectWithName<Graphics>(level, "BALL_PROTOTYPE");
    const paddleLeft = selectObjectWithName<Graphics>(level, "PADDLE_LEFT");
    const paddleRight = selectObjectWithName<Graphics>(level, "PADDLE_RIGHT");
    const borderUpper = selectObjectWithName<Graphics>(level, "BORDER_UPPER");
    const borderLower = selectObjectWithName<Graphics>(level, "BORDER_LOWER");

    level.data = levelData;

    if (ballPrototype) level.ballPrototype = ballPrototype;
    if (paddleLeft && paddleRight) {
        level.paddles = {
            left: paddleLeft,
            right: paddleRight,
        };
    }
    if (borderUpper) level.borderUpper = borderUpper;
    if (borderLower) level.borderLower = borderLower;

    level.serveLine = parseServeLine(levelData);
    level.borderLines = parseBorderLines(levelData);

    return level;
}

function parseServeLine(levelData: TiledMap): LevelContainer["serveLine"] {
    return parsePolyline(levelData, "SERVE_LINE");
}

function parseBorderLines(levelData: TiledMap): LevelContainer["borderLines"] {
    return {
        upper: parsePolyline(levelData, "BORDER_UPPER"),
        lower: parsePolyline(levelData, "BORDER_LOWER"),
    };
}

function parsePolyline(levelData: TiledMap, objectName: string): LineData {
    const [tiledObject] = selectObjectsOfName<PartiallyRequired<TiledObject, "polyline">>(levelData, objectName);
    console.log(objectName, tiledObject.polyline);
    return tiledObject.polyline.map((point) => ({
        x: point.x + tiledObject.x,
        y: point.y + tiledObject.y,
    })) as LineData;
}
