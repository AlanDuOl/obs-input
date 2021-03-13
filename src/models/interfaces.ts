
export interface GameAction {
    type: string,
    value: any
}

export enum GameStatus {
    running,
    paused,
    finished
}

export interface GameState {
    status: GameStatus,
    score: number,
    statusText: string,
    level: number
}

export enum GameCommand {
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    start,
    finish
}