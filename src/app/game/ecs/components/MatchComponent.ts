import Player from "../../Player";

export interface Round {
    serviceFrom: Player;
    winner: Player | null;
}

export interface MatchComponent {
    match: {
        score: Record<Player, number>;
        numberOfPointsToWin: number;
        wonByPlayer: Player | null;
    };
}

export default MatchComponent;
