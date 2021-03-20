import { GameState, GameStatus } from "./models/interfaces";

export const statusText = {
    running: 'Running',
    paused: 'Paused',
    finished: 'Finished'
}

export const commandKeys = [
    ['a', 'A'],
    ['d', 'D'],
    ['s', 'S'],
    ['w', 'W'],
    ['Enter'],
    ['Delete']
];

export const gameInitialState: GameState = {
    status: GameStatus.finished,
    score: 0,
    statusText: 'Finished',
    level: 1
}

export const canvas = {
    width: 200,
    height: 340
}
export const NUM_BLOCK_TYPES = 7
export const BLOCK_NUM_TILES = 4
export const WALL_NUM_TILES_WIDTH = 10
export const WALL_NUM_TILES_HEIGHT = 21
export const BLOCK_DELTA_SPEED = 4
export const BLOCK_DELTA_ROTATION = 90
export const BLOCK_INITIAL_ROTATION = 0
export const GAME_SPEED = 100;
// export const GAME_SPEED = 20
export const LEVEL_FACTOR = 100
export const GAME_INITIAL_LEVEL = 1
export const GAME_INITIAL_SCORE = 0

export const blockMoveDirection = {
    left: "left",
    right: "right",
    none: "none"
}

export const actionType = {
    blockMove: "SET_BLOCK_MOVE",
    blockSpeed: "SET_BLOCK_SPEED",
    blockPosition: "SET_BLOCK_POSITION",
    blockRotation: "SET_BLOCK_ROTATION",
    blockType: "SET_BLOCK_TYPE",
    blockTiles: "SET_BLOCK_TILES",
    gameLevel: "SET_GAME_LEVEL",
    gameScore: "SET_GAME_SCORE",
    gameOn: "SET_GAME_ON",
    gamePaused: "SET_GAME_PAUSED",
    gameRecord: "SET_GAME_RECORD",
    gameOver: "SET_GAME_OVER"
}


export const blockType = {
    I: {
        name: "I",
        fillStyle: "rgb(0, 255, 0)"
    },
    S: {
        name: "S",
        fillStyle: "rgb(0, 255, 0)"
    },
    Z: {
        name: "Z",
        fillStyle: "rgb(0, 255, 0)"
    },
    T: {
        name: "T",
        fillStyle: "rgb(0, 255, 0)"
    },
    L: {
        name: "L",
        fillStyle: "rgb(0, 255, 0)"
    },
    J: {
        name: "J",
        fillStyle: "rgb(0, 255, 0)"
    },
    O: {
        name: "O",
        fillStyle: "rgb(0, 255, 0)"
    }
}

export const blockInitialSpeed = {
    level1: 1,
    level2: 2,
    level3: 3,
    level4: 4,
    level5: 5,
    level6: 6,
    level7: 7
}

export const initialBlock = {
    speed: 0,
    type: { name: "", fillStyle: "" },
    rotationAngle: 0,
    rotationPoint: { x: 0, Y: 0 },
    tiles: []
}