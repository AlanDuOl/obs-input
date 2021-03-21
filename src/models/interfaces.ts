
export enum GameStatus {
    running,
    paused,
    finished
}

export enum GameCommand {
    moveLeft,
    moveRight,
    speedUp,
    rotate,
    start,
    finish
}

export interface GameState {
    status: GameStatus,
    score: number,
    statusText: string,
    level: number
}

export interface GameAction {
    type: string,
    value: any
}

export interface CanvasDimensions {
    width: number,
    height: number
}

export interface Position {
    x: number,
    y: number
}

export interface BlockShape {
    tiles: Position[],
    rotationPoint: Position
}

export interface BlockType {
    name: string,
    fillStyle: string
}
