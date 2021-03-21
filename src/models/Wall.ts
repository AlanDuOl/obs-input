import { WALL_NUM_TILES_WIDTH, WALL_NUM_TILES_HEIGHT, TILE_DIM } from '../constants'
import { Position } from './interfaces.js'


export default class Wall {

    private tiles: Position[][] = [];

    constructor() {
        let wallTiles = []
        for (let row = 0; row < WALL_NUM_TILES_HEIGHT; row++) {
            wallTiles.push(this.getEmptyRow())
        }
        this.tiles = wallTiles
    }

    get Tiles(): Position[][] {
        return this.tiles
    }

    draw(ctx2D: CanvasRenderingContext2D): void {
        try {
            for (let row = 0; row < WALL_NUM_TILES_HEIGHT; row++) {
                for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                    if (this.tiles[row][col].x < 400 && this.tiles[row][col].y < 400) {
                        ctx2D.beginPath()
                        ctx2D.fillStyle = "rgba(0, 0, 255, 1)"
                        ctx2D.rect(this.tiles[row][col].x, this.tiles[row][col].y, TILE_DIM, TILE_DIM);
                        ctx2D.fill()
                    }
                }
            }
        }
        catch (e) {
            console.error(e.message)
        }
    }

    update(blockTiles: Position[]): number {
        let numRemovedRows = 0
        this.addTiles(blockTiles)
        numRemovedRows = this.updateTiles(numRemovedRows)
        return numRemovedRows
    }

    updateTiles(initialValue: number): number {
        // this is to know how many lines have been removed and is used to update the score/level
        let numRemovedRows = initialValue
        try {
            // Loop in rows from bottom to top
            for (let row = WALL_NUM_TILES_HEIGHT - 1; row >= 0; row--) {
                let rowLength = 0
                for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                    if (this.tiles[row][col].x < 400 && this.tiles[row][col].y < 400) {
                        rowLength++
                        // If there is a row without empty tiles, remove it and move the abore tiles down (if any)
                        if (rowLength === WALL_NUM_TILES_WIDTH) {
                            // Remove row where all tiles are not empty
                            this.removeTiles(row)
                            // Move down tiles above the emptied row
                            this.moveTilesDown(row - 1)
                            // Recall self increasing numRemovedRows to see if there are more rows to remove
                            numRemovedRows = this.updateTiles(++numRemovedRows)
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e.message)
        }
        return numRemovedRows
    }

    addTiles(blockTiles: Position[]): void {
        try {
            blockTiles.forEach(tile => {
                // Get the column and row numbers
                let col = Math.floor(tile.x / TILE_DIM)
                let row = Math.floor(tile.y / TILE_DIM)
                // If the col and row are inside the canvas range, add the tile to the wall
                if (col < WALL_NUM_TILES_WIDTH && col >= 0 && row < WALL_NUM_TILES_HEIGHT && row >= 0) {
                    this.tiles[row][col] = { x: col * TILE_DIM, y: row * TILE_DIM }
                }
                else {
                    throw new Error('Game Over!!');
                }
            })
        }
        catch (e) {
            console.error(e.message);
        }
    }

    removeTiles(rowNumber: number): void {
        // Make current row empty
        this.tiles[rowNumber] = this.getEmptyRow()
    }

    moveTilesDown(startRow: number): void {
        try {
            let emptyRow = this.getEmptyRow()
            // Loop in rows from bottom to top
            for (let row = startRow; row >= 0; row--) {
                // Loop in the columns and and increase y postion by TILE_DIM where the tile is not empty
                for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                    // if ((wall[row][col].x || wall[row][col].x === 0) && (wall[row][col].y || wall[row][col].y === 0)) {
                    if (this.tiles[row][col].x < 400 && this.tiles[row][col].y < 400) {
                        this.tiles[row][col].y += TILE_DIM
                    }
                }
                // Make the bellow row be equal to the current row
                this.tiles[row + 1] = this.tiles[row]
                // Make the current row be equal to an empty row
                this.tiles[row] = emptyRow
            }
        }
        catch (e) {
            console.error(e.message)
        }
    }

    getEmptyRow(): Position[] {
        let wallRow = []
        for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
            let emptyTile = { x: 400, y: 400 }
            wallRow.push(emptyTile)
        }
        if (wallRow.length === WALL_NUM_TILES_WIDTH) {
            return wallRow
        }
        throw new Error("Error creating empty row")
    }

}