import Player from "../../core/Player";

export type MatchScore = Record<Player, number>;

export interface MatchComponentDataObject {
    score: MatchScore;
    numberOfPointsToWin: number;
    nextServeByPlayer: Player | null;
    wonByPlayer?: Player;
}

export interface MatchComponent {
    match: MatchComponentDataObject;
}

export function selectLeadingPoints(score: MatchScore): number {
    return Math.max(...Object.values(score));
}

export function selectFollowingPoints(score: MatchScore): number {
    return Math.min(...Object.values(score));
}

export function selectLeadingPlayer(score: MatchScore): Player {
    const entries = Object.entries(score);
    return entries.reduce(
        (leadingEntry, entry) => (entry[1] > leadingEntry[1] ? entry : leadingEntry),
        entries[0],
    )[0] as Player;
}

export function selectFollowingPlayer(score: MatchScore): Player {
    const entries = Object.entries(score);
    return entries.reduce(
        (followingEntry, entry) => (entry[1] < followingEntry[1] ? entry : followingEntry),
        entries[0],
    )[0] as Player;
}

export default MatchComponent;
