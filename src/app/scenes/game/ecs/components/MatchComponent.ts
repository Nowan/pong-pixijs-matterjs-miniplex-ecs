import Player from "../../core/Player";

export type MatchScore = Record<Player, number>;

export interface MatchComponentDataObject {
    score: MatchScore;
    numberOfPointsToWin: number;
    wonByPlayer: Player | null;
}

export interface MatchComponent {
    match: MatchComponentDataObject;
}

export default MatchComponent;
