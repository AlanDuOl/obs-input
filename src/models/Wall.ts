import { WALL_NUM_TILES_WIDTH, WALL_NUM_TILES_HEIGHT, BLOCK_NUM_TILES } from '../constants.js'
import { Position } from './interfaces.js'


export default class Wall {

    private tiles: Position[][] = [];

    constructor() {
        let wallTiles = []
        for (let row = 0; row < WALL_NUM_TILES_HEIGHT; row++) {
            let wallRow = []
            for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                wallRow.push({ x: 0, y: 0 })
            }
            wallTiles.push(wallRow)
        }
        this.tiles = wallTiles
    }

    draw(ctx2D: CanvasRenderingContext2D, tileDim: number): void {
        try {
            for (let row = 0; row < WALL_NUM_TILES_HEIGHT; row++) {
                for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
                    if (Object.keys(this.tiles[row][col]).length === 2) {
                        ctx2D.beginPath()
                        ctx2D.fillStyle = "rgba(0, 0, 255, 1)"
                        ctx2D.rect(this.tiles[row][col].x, this.tiles[row][col].y, tileDim, tileDim)
                        ctx2D.fill()
                    }
                }
            }
        }
        catch (e) {
            console.error(e.message)
        }
    }

    // this.update = (blockTiles, tileDim) => {
    //     let numRemovedRows = 0
    //     this.addTiles(blockTiles, tileDim)
    //     numRemovedRows = this.updateTiles(tileDim, numRemovedRows)
    //     return numRemovedRows
    // }

    // this.updateTiles = (tileDim, initialValue) => {
    //     // this is to know how many lines have been removed and is used to update the score/level
    //     let numRemovedRows = initialValue
    //     try {
    //         // Loop in rows from bottom to top
    //         for (let row = WALL_NUM_TILES_HEIGHT - 1; row >= 0; row--) {
    //             let rowLength = 0
    //             for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
    //                 if (Object.keys(this.tiles[row][col]).length === 2) {
    //                     rowLength++
    //                     // If there is a row without empty tiles, remove it and move the abore tiles down (if any)
    //                     if (rowLength === WALL_NUM_TILES_WIDTH) {
    //                         // Remove row where all tiles are not empty
    //                         this.removeTiles(row)
    //                         // Move down tiles above the emptied row
    //                         this.moveTilesDown(row - 1, tileDim)
    //                         // Recall self increasing numRemovedRows to see if there are more rows to remove
    //                         numRemovedRows = this.updateTiles(tileDim, ++numRemovedRows)
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     catch (e) {
    //         console.error(e.message)
    //     }
    //     return numRemovedRows
    // }

    // this.addTiles = (blockTiles, tileDim) => {
    //     try {
    //         blockTiles.forEach(tile => {
    //             // Get the column and row numbers
    //             let col = Math.floor(tile.x / tileDim)
    //             let row = Math.floor(tile.y / tileDim)
    //             // Set the tile x and y position values in the range of (15 > col >= 0) and (21 > row >= -4)
    //             if (col < WALL_NUM_TILES_WIDTH && col >= 0 && row < WALL_NUM_TILES_HEIGHT && row >= - BLOCK_NUM_TILES) {
    //                 // Add 4 to every row index so no index is smaller than 0 and grater than 21
    //                 // Negative y position is needed to check for game over
    //                 // Because the game over check must happen after the wall updates
    //                 this.tiles[row + BLOCK_NUM_TILES][col] = { x: col * tileDim, y: row * tileDim }
    //             }
    //         })
    //     }
    //     catch (e) {
    //         console.error(e.message)
    //     }
    // }

    // this.removeTiles = row => {
    //     // Make current row empty
    //     this.tiles[row] = this.getEmptyRow()
    // }

    // this.moveTilesDown = (startRow, tileDim) => {
    //     try {
    //         let emptyRow = this.getEmptyRow()
    //         // Loop in rows from bottom to top
    //         for (let row = startRow; row >= 0; row--) {
    //             // Loop in the columns and and increase y postion by tileDim where the tile is not empty
    //             for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
    //                 // if ((wall[row][col].x || wall[row][col].x === 0) && (wall[row][col].y || wall[row][col].y === 0)) {
    //                 if (Object.keys(this.tiles[row][col]).length === 2) {
    //                     this.tiles[row][col].y += tileDim
    //                 }
    //             }
    //             // Make the bellow row be equal to the current row
    //             this.tiles[row + 1] = this.tiles[row]
    //             // Make the current row be equal to an empty row
    //             this.tiles[row] = emptyRow
    //         }
    //     }
    //     catch (e) {
    //         console.error(e.message)
    //     }
    // }

    // this.getEmptyRow = () => {
    //     let wallRow = []
    //     for (let col = 0; col < WALL_NUM_TILES_WIDTH; col++) {
    //         let emptyTile = {}
    //         wallRow.push(emptyTile)
    //     }

    //     if (wallRow.length === WALL_NUM_TILES_WIDTH) {
    //         return wallRow
    //     }
    //     else {
    //         console.error("Error creating empty row")
    //     }
    // }

}