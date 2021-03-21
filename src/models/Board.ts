import { BLOCK_NUM_TILES, TILE_DIM, WALL_NUM_TILES_HEIGHT, WALL_NUM_TILES_WIDTH } from "../constants";
import Block from "./Block";
import Wall from "./Wall";
import { CanvasDimensions, GameAction, GameCommand, GameState, GameStatus, Position } from "./interfaces";
import React from "react";
import gameAction from "../store/actions/gameAction";


export default class Board {

    private ctx2D: CanvasRenderingContext2D | null;
    private canvasDims: CanvasDimensions;
    private block: Block;
    private wall: Wall;
    private set: React.Dispatch<GameAction>;
    private gameState: GameState;

    constructor(canvas: HTMLCanvasElement, dispatch: React.Dispatch<GameAction>, state: GameState) {
        this.canvasDims = { width: canvas.width, height: canvas.height };
        this.ctx2D  = canvas.getContext('2d');
        this.block = new Block(this.canvasDims, state.level);
        this.wall = new Wall();
        this.set = dispatch;
        this.gameState = state;
    }

    update(state: GameState): void {
        this.gameState = state;
        this.block.moveDown();
        this.clearCanvas();
        this.drawObjects();
        this.checkGameOver()
        this.collisionUpdates();
    }

    updateBlock(command: number): void {
        switch(command) {
            // TODO: change this to speed increase
            case GameCommand.speedUp:
                this.block.speedUp();
                break;
            case GameCommand.moveLeft:
                this.block.moveLeft(this.wall.Tiles);
                break;
            case GameCommand.moveRight:
                this.block.moveRight(this.wall.Tiles);
                break;
            case GameCommand.rotate:
                this.block.rotate(this.wall.Tiles);
                break;
            default:
                throw new Error('Unknown command ' + command);
        }
    }

    resetBlockSpeed(): void {
        this.block.resetSpeed(this.gameState.level);
    }

    private drawObjects(): void {
        if (!!this.ctx2D) {
            this.block.draw(this.ctx2D);
            this.wall.draw(this.ctx2D);
        }
        else {
            throw new Error("No 2d context found...");
        }
    }

    private collisionUpdates(): void {
        // // Check for block bottom collision with canvas or wall
        let collisionTiles = this.checkBottomCollision();
        // colligion
        if (collisionTiles.length === BLOCK_NUM_TILES) {
            // Update the wall
            let numRemovedRows = this.wall.update(collisionTiles);
            // If a row was removed the info should be updated (score) and checked to update (level, record)
            // TODO
            if (numRemovedRows > 0) {
                // this.info.update(numRemovedRows, this.setGameState)
            }
            // change game score and check for Score updates on level and record
            this.block = new Block(this.canvasDims, this.gameState.level);
        }
    }

    public clearCanvas(): void {
        if (this.ctx2D) {
            this.ctx2D.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height);
        }
    }

    checkBottomCollision(): Position[] | [] {
        let collisionTiles: Position[] = [];
        try {
            this.block.Tiles.forEach(tile => {
                // Check if it calls after return
                loop1:
                for (let row = 0; row < WALL_NUM_TILES_HEIGHT; row++) {
                    for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                        // If there was a collision, add the tiles to the wall and return true
                        if ((tile.x === this.wall.Tiles[row][col].x && tile.y + TILE_DIM > this.wall.Tiles[row][col].y
                            && tile.y + TILE_DIM < this.wall.Tiles[row][col].y + TILE_DIM * 2)
                            || tile.y + TILE_DIM > this.canvasDims.height) {
                            // make o copy of the tiles array
                            collisionTiles = this.block.Tiles.slice();
                            break loop1;
                        }
                    }
                }
            })
        }
        catch (e) {
            console.error(e.message);
        }
        return collisionTiles;
    }

    checkGameOver(): void {
        try {
            for (let row = 0; row < BLOCK_NUM_TILES; row++) {
                for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                    if (Object.keys(this.wall.Tiles[row][col]).length === 2) {
                        // If there is a tile in the wall with y position < 0 the game is over
                        if (this.wall.Tiles[row][col].y < 0) {
                            this.set({ type: gameAction.GAME_STATUS, value: GameStatus.finished });
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e.message)
        }
    }
}

