
export const statusMsg = {
    running: 'Running',
    paused: 'Paused',
    finished: 'Finished'
}
export enum gameStatus {
    running,
    paused,
    finished
}

export enum gameCommand {
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    strat,
    finish
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