import { Graphics } from "pixi.js";
import { TiledMap } from "tiled-types";
import { TiledMapContainer } from "./tiled";
import parseTiledMap from "./tiled/parseMap";
import { selectObjectWithName } from "./tiled/selectors";

export type LevelContainer = TiledMapContainer & {
    ball: Graphics;
    paddles: {
        left: Graphics;
        right: Graphics;
    };
};

export default function parseLevel(levelData: TiledMap): LevelContainer {
    const level = parseTiledMap(levelData) as LevelContainer;
    const ball = selectObjectWithName<Graphics>(level, "BALL");
    const paddleLeft = selectObjectWithName<Graphics>(level, "PADDLE_LEFT");
    const paddleRight = selectObjectWithName<Graphics>(level, "PADDLE_RIGHT");

    if (ball) level.ball = ball;
    if (paddleLeft && paddleRight) {
        level.paddles = {
            left: paddleLeft,
            right: paddleRight,
        };
    }

    return level;
}
