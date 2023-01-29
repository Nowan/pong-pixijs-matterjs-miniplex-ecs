export enum Player {
    ONE = "PlayerOne",
    TWO = "PlayerTwo",
}

export function opposite(player: Player) {
    return player === Player.ONE ? Player.TWO : Player.ONE;
}

export default Player;
