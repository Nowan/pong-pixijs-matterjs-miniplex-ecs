import Player from "../../../../core/Player";
import { MatchEntity } from "../../Entity";

const DEFAULT_NUMBER_OF_POINTS_TO_WIN = 11;

export function composeMatchEntity(numberOfPointsToWin?: number): MatchEntity {
    return {
        id: "Match",
        match: {
            numberOfPointsToWin: numberOfPointsToWin || DEFAULT_NUMBER_OF_POINTS_TO_WIN,
            score: {
                [Player.ONE]: 0,
                [Player.TWO]: 0,
            },
            wonByPlayer: null,
        },
    };
}

export default composeMatchEntity;
