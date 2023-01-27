export enum MoveKey {
    W = "w",
    S = "s",
    ARROW_UP = "up",
    ARROW_DOWN = "down",
}

export enum MoveDirection {
    UP = -1,
    DOWN = 1,
}

export interface MoveOnKeysComponent {
    moveOnKeys: Partial<Record<MoveKey, MoveDirection>>;
}

export default MoveOnKeysComponent;
