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

export const gameSpeed = 500;

export const gameInitialState: GameState = {
    status: GameStatus.finished,
    score: 0,
    statusText: 'Finished',
    level: 1
}