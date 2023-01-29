import Player from "../../core/Player";

export interface RoundComponentDataObject {
    servedByPlayer: Player;
    started: boolean;
    finished: boolean;
    wonByPlayer?: Player;
}

export interface RoundComponent {
    round: RoundComponentDataObject;
}

export default RoundComponent;
