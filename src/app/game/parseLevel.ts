import { Graphics, IPointData, Point } from "pixi.js";
import { TiledLayerObjectgroup, TiledMap } from "tiled-types";
import { TiledMapContainer } from "../core/tiled";
import parseTiledMap from "../core/tiled/parseMap";
import { selectObjectWithName } from "../core/tiled/selectors";

export type LevelContainer = TiledMapContainer & {
    ballPrototype: Graphics;
    paddles: {
        left: Graphics;
        right: Graphics;
    };
    serveLine: { start: IPointData; end: IPointData };
};

export default function parseLevel(levelData: TiledMap): LevelContainer {
    const level = parseTiledMap(levelData) as LevelContainer;
    const ballPrototype = selectObjectWithName<Graphics>(level, "BALL_PROTOTYPE");
    const paddleLeft = selectObjectWithName<Graphics>(level, "PADDLE_LEFT");
    const paddleRight = selectObjectWithName<Graphics>(level, "PADDLE_RIGHT");

    if (ballPrototype) level.ballPrototype = ballPrototype;
    if (paddleLeft && paddleRight) {
        level.paddles = {
            left: paddleLeft,
            right: paddleRight,
        };
    }

    level.serveLine = parseServeLine(levelData);

    return level;
}

function parseServeLine(levelData: TiledMap): { start: IPointData; end: IPointData } {
    const layer = levelData.layers[0] as TiledLayerObjectgroup;
    const object = layer.objects.find((object) => object.name === "SERVE_LINE");

    if (object?.polyline) {
        const [start, end] = object.polyline.map((point) => ({ x: point.x + object.x, y: point.y + object.y }));
        return { start, end };
    } else {
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
    }
}
