import Player from "../../Player";

export interface RoundComponent {
    round: {
        matchId: string;
        servedByPlayer: Player;
        lostByPlayer: Player | null;
    };
}

export default RoundComponent;
