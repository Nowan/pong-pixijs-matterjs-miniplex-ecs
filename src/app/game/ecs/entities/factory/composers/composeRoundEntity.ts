import Player from "../../../../Player";
import { RoundEntity } from "../../Entity";

export function composeRoundEntity(servingPlayer: Player): RoundEntity {
    return {
        id: "Round",
        round: {
            servedByPlayer: servingPlayer,
            started: false,
            finished: false,
        },
    };
}

export default composeRoundEntity;
