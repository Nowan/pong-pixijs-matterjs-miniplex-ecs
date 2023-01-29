import Player from "../../../../Player";
import { RoundEntity } from "../../Entity";

export function composeRoundEntity(matchId: string, servingPlayer: Player): RoundEntity {
    return {
        id: "Round",
        round: {
            matchId,
            servedByPlayer: servingPlayer,
            lostByPlayer: null,
        },
    };
}

export default composeRoundEntity;
