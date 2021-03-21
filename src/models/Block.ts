import {
    BLOCK_DELTA_SPEED,
    blockType,
    BLOCK_DELTA_ROTATION, BLOCK_INITIAL_ROTATION,
    WALL_NUM_TILES_WIDTH,
    BLOCK_MAX_SPEED,
} from '../constants';
import { BlockShape, BlockType, CanvasDimensions, Position } from './interfaces.js'

export default class Block {

    private speed = 0;
    private type: BlockType = { name: "", fillStyle: "" };
    private rotationAngle = 0;
    private rotationPoint: Position = { x: 0, y: 0 };
    private tiles: Position[] = [];;

    constructor(canvasDims: CanvasDimensions, gameLevel: number) {
        let blockType = this.getType()
        let blockProps = this.getTiles(canvasDims, blockType)
        this.speed = gameLevel;
        this.rotationAngle = BLOCK_INITIAL_ROTATION
        this.type = blockType
        this.tiles = blockProps.tiles
        this.rotationPoint = blockProps.rotationPoint
    }

    get Tiles(): Position[] {
        return this.tiles;
    }

    draw(ctx2D: CanvasRenderingContext2D, tileDim: number): void {
        ctx2D.fillStyle = this.type.fillStyle
        ctx2D.beginPath()
        this.tiles.forEach(tile => {
            ctx2D.rect(tile.x, tile.y, tileDim, tileDim)
        })
        ctx2D.fill()
    }

    moveDown(): void {
        this.tiles.forEach(tile => {
            tile.y += this.speed
        })
        this.rotationPoint.y += this.speed
    }

    moveLeft(tileDim: number, wall: Position[][]): void {
        let canBlockMove = this.checkMoveLeft(tileDim, wall)
        // If block can move move left
        if (canBlockMove) {
            this.tiles.forEach(tile => {
                tile.x -= tileDim
            })
            this.rotationPoint.x -= tileDim
        }
    }

    moveRight(tileDim: number, wall: Position[][]): void {
        let canBlockMove = this.checkMoveRight(tileDim, wall)
        // If block can move move right
        if (canBlockMove) {
            this.tiles.forEach(tile => {
                tile.x += tileDim
            })
            this.rotationPoint.x += tileDim
        }
    }

    checkMoveLeft(tileDim: number, wall: Position[][]): boolean {
        let blockCanMove = true
        let keepLooping = true
        // Check if there is a tile that can't move
        try {
            this.tiles.forEach(tile => {
                if (keepLooping) {
                    let tileRow = Math.floor(tile.y / tileDim)
                    let tileCol = Math.floor(tile.x / tileDim)
                    if (tileCol > 0) {
                        let endRow = tileRow < 1 ? 1 : tileRow + 1
                        let endCol = tileCol - 1
                        if (tileRow >= 0) {
                            for (let row = tileRow; row <= endRow; row++) {
                                if (wall[row][endCol].x !== 400 && wall[row][endCol].y !== 400) {
                                    // If blockTileCol is bigger than wallTileCol + 1 there is no need to check with that wallTile
                                    // if (tileCol === col + 1 && tileRow >= row - 1 && tileRow <= row + 1) {
                                        blockCanMove = false
                                        keepLooping = false
                                        break
                                    // }
                                }
                            }
                        }
                    }
                    else {
                        blockCanMove = false
                        keepLooping = false
                    }
                }
            })
        }
        catch (e) {
            console.error(e.message)
        }
        return blockCanMove
    }

    checkMoveRight(tileDim: number, wall: Position[][]): boolean {
        let blockCanMove = true
        let keepLooping = true
        // Check if there is a tile that can't move
        try {
            this.tiles.forEach(tile => {
                if (keepLooping) {
                    let tileRow = Math.floor(tile.y / tileDim)
                    let tileCol = Math.floor(tile.x / tileDim)
                    if (tileCol < WALL_NUM_TILES_WIDTH - 1) {
                        let endRow = tileRow < 1 ? 1 : tileRow + 1
                        let endCol = tileCol + 1
                        if (tileRow >= 0) {
                            for (let row = tileRow; row <= endRow; row++) {
                                if (wall[row][endCol].x !== 400 && wall[row][endCol].y !== 400) {
                                    // If blockTileCol is bigger than wallTileCol + 1 there is no need to check with that wallTile
                                    // if (tileCol === col - 1 && tileRow >= row - 1 && tileRow <= row + 1) {
                                        blockCanMove = false
                                        keepLooping = false
                                        break
                                    // }
                                }
                            }
                        }
                    }
                    else {
                        blockCanMove = false
                        keepLooping = false
                    }
                }
            })
        }
        catch (e) {
            console.error(e.message)
        }
        return blockCanMove
    }

    speedUp(): void {
        if (this.speed < BLOCK_MAX_SPEED) {
            this.speed += BLOCK_DELTA_SPEED
        }
    }

    resetSpeed(gameLevel: number): void {
        this.speed = gameLevel;
    }

    rotate(canvasDims: CanvasDimensions, wall: Position[][]): void {
        if (this.type.name !== "O") {
            let checkSpace = this.needToCheckSpace();
            let canRotate = true;
            if (checkSpace) {
                // check available space
                // if there is no available space set canRotate = false
                canRotate = this.checkAvailableSpace(canvasDims.tileDim, wall);
            }
            if (canRotate) {
                // rotate tiles
                this.setNewRotationAngle();
                this.rotateTiles();
                this.adjustTiles(canvasDims.tileDim);
            }
        }
    }

    checkAvailableSpace(tileDim: number, wall: Position[][]): boolean {

        let isThereEnoughSpace = false;
        try {
            // To get the block cols and rows
            let blockDims = this.getRowsAndCols(tileDim);
            // Loop in the wall only on needed rows using future width and height
            // The rows array is sorted to get the max value first
            let startRow = blockDims.rows[0] > 0 ? (blockDims.rows[0] + 1) : 0;
            // The row in the loop (not included)
            let endRow = (startRow - blockDims.rows.length) < 0 ? - 1 : (startRow - blockDims.rows.length);
            // The cols array is sorted to get the smallest value first
            let startCol = blockDims.cols[0];
            // The number of cols to be checked is equal to the future height (rows.length)
            // numCols is the loop range needed. It varies depending on the col value
            let numCols = blockDims.rows.length;
            let endCol = (startCol + numCols) > WALL_NUM_TILES_WIDTH ? WALL_NUM_TILES_WIDTH : (startCol + numCols)
            let emptyCols = 0;
            for (let col = startCol; col < endCol; col++) {
                let emptyRows = 0;
                for (let row = startRow; row > endRow; row--) {
                    if (wall[row][col].x !== 400 && wall[row][col].y !== 400) {
                        emptyRows = 0;
                    }
                    else {
                        emptyRows++;
                    }
                }
                // cols.length is the future width
                if (emptyRows === blockDims.rows.length) {
                    emptyCols++;
                    // If the number of empty cols is >= than the future width the block can rotate
                    if (emptyCols === blockDims.rows.length) {
                        isThereEnoughSpace = true;
                        break;
                    }
                }
                else {
                    emptyCols = 0;
                }
            }
        }
        catch (e) {
            console.error(e.message);
        }
        return isThereEnoughSpace;
    }

    getRowsAndCols(tileDim: number): { rows: number[], cols: number[] } {
        let tilesRows: number[] = [];
        let tilesCols: number[] = [];
        this.tiles.forEach(tile => {
            let row = Math.floor(tile.y / tileDim) < 0 ? 0 : Math.floor(tile.y / tileDim);
            let col = Math.floor(tile.x / tileDim);
            tilesRows.push(row);
            tilesCols.push(col);
        })
        // Descending
        tilesRows.sort((a, b) => b - a);
        // Ascending
        tilesCols.sort((a, b) => a - b);
        let finalRows = new Set(tilesRows);
        let finalCols = new Set(tilesCols);
        return { rows: Array.from(finalRows.values()), cols: Array.from(finalCols.values()) }
    }

    needToCheckSpace(): boolean {
        // If the current angle is 90 or 270 there is no need to check for available space
        if (this.rotationAngle === 90 || this.rotationAngle === 270) {
            return false
        }
        else {
            return true
        }
    }

    rotateTiles(): void {
        // Rotate the points around the rotation point
        try {
            let angle = (Math.PI / 180) * BLOCK_DELTA_ROTATION
            this.tiles.forEach((tile: Position) => {
                // Make a copy to avoid using changed tile.x in tile.y new value
                let currentTile = Object.assign({}, tile)
                // Rotate tile.x around rotationPoint
                tile.x = Math.round(Math.cos(angle) * (currentTile.x - this.rotationPoint.x) - Math.sin(angle) * (currentTile.y - this.rotationPoint.y) + this.rotationPoint.x)
                // Rotate tile.y around rotationPoint
                tile.y = Math.sin(angle) * (currentTile.x - this.rotationPoint.x) + Math.cos(angle) * (currentTile.y - this.rotationPoint.y) + this.rotationPoint.y
            })
        }
        catch (e) {
            console.error(e.message)
        }
    }

    adjustTiles(tileDim: number): void {
        this.correctTilesPosition(tileDim)
        this.correctRotationPoint(tileDim)
    }

    correctTilesPosition(tileDim: number): void {
        // Correct rotated points of L, J, Z, S blocks
        if (this.type.name !== "I" && this.type.name !== "O") {
            this.tiles.forEach((tile: Position) => {
                switch (this.rotationAngle) {
                    case 0:
                        tile.x -= tileDim
                        tile.y += tileDim
                        break
                    case 90:
                        tile.x -= tileDim
                        break
                    case 180:
                        tile.y -= tileDim * 2
                        break
                    case 270:
                        tile.x += tileDim * 2
                        tile.y += tileDim
                        break
                    default:
                        throw new Error("Unknown block rotation angle..." + this.rotationAngle)
                }
            })
        }
        // Correct rotated points of I block
        else if (this.type.name === "I") {
            this.tiles.forEach((tile: Position) => {
                switch (this.rotationAngle) {
                    case 0:
                        tile.x -= tileDim * 3
                        break
                    case 90:
                        break
                    case 180:
                        tile.y -= tileDim * 3
                        break
                    case 270:
                        tile.x += tileDim * 3
                        tile.y += tileDim * 3
                        break
                    default:
                        throw new Error("Unknown block rotation angle..." + this.rotationAngle)
                }
            })
        }
    }

    correctRotationPoint(tileDim: number): void {
        let newRotationPoint = { x: 0, y: 0 }
        let centralPoint = this.tiles[3]
        // If the block is T or Z the rotation point is updated differently
        if (this.type.name === "T" || this.type.name === "Z") {
            switch (this.rotationAngle) {
                case 0:
                    newRotationPoint = { x: centralPoint.x, y: centralPoint.y + tileDim }
                    break
                case 90:
                    newRotationPoint = { x: centralPoint.x - tileDim, y: centralPoint.y }
                    break
                case 180:
                    newRotationPoint = { x: centralPoint.x, y: centralPoint.y - tileDim }
                    break
                case 270:
                    newRotationPoint = { x: centralPoint.x + tileDim, y: centralPoint.y }
                    break
                default:
                    throw new Error("Unknown rotation angle for rotation point... " + this.rotationAngle)
            }
        }
        // All other blocks have the central point equalt to point 4
        else {
            newRotationPoint = { x: centralPoint.x, y: centralPoint.y }
        }
        this.rotationPoint = newRotationPoint
    }

    setNewRotationAngle(): void {
        if (this.rotationAngle >= 270) {
            this.rotationAngle = 0
        }
        else {
            this.rotationAngle += BLOCK_DELTA_ROTATION
        }
    }

    getTiles(canvasDims: CanvasDimensions, type: BlockType): BlockShape {
        switch (type.name) {
            case blockType.I.name:
                return this.getI(canvasDims)
            case blockType.S.name:
                return this.getS(canvasDims)
            case blockType.Z.name:
                return this.getZ(canvasDims)
            case blockType.T.name:
                return this.getT(canvasDims)
            case blockType.L.name:
                return this.getL(canvasDims)
            case blockType.J.name:
                return this.getJ(canvasDims)
            case blockType.O.name:
                return this.getO(canvasDims)
            default:
                throw new Error(`Unknown block name: ${type.name}`)
        }
    }

    getI(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim * 4 },
                { x: leftMostX, y: - canvasDims.tileDim * 3 },
                { x: leftMostX, y: - canvasDims.tileDim * 2 },
                { x: leftMostX, y: - canvasDims.tileDim }
            ],
            rotationPoint: { x: leftMostX, y: - canvasDims.tileDim }
        }
        block.tiles.push()
        block.tiles.push()
        block.tiles.push()
        block.tiles.push()
        return block
    }

    getS(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - canvasDims.tileDim
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim * 3 },
                { x: leftMostX, y: - canvasDims.tileDim * 2 },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
            ],
            rotationPoint: { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
        }
        return block
    }

    getZ(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - canvasDims.tileDim
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim * 2 },
                { x: leftMostX, y: - canvasDims.tileDim },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 3 },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 }
            ],
            rotationPoint: { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 }
        }
        return block
    }

    getT(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - canvasDims.tileDim
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim * 3 },
                { x: leftMostX, y: - canvasDims.tileDim * 2 },
                { x: leftMostX, y: - canvasDims.tileDim },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 }
            ],
            rotationPoint: { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 }
        }
        return block
    }

    getL(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - canvasDims.tileDim
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim * 3 },
                { x: leftMostX, y: - canvasDims.tileDim * 2 },
                { x: leftMostX, y: - canvasDims.tileDim },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
            ],
            rotationPoint: { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
        }
        return block
    }

    getJ(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - canvasDims.tileDim
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 3 },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
            ],
            rotationPoint: { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
        }
        return block
    }

    getO(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - canvasDims.tileDim
        let block = {
            tiles: [
                { x: leftMostX, y: - canvasDims.tileDim * 2 },
                { x: leftMostX, y: - canvasDims.tileDim },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim * 2 },
                { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
            ],
            rotationPoint: { x: leftMostX + canvasDims.tileDim, y: - canvasDims.tileDim }
        }
        return block
    }

    // Return the block number used to define the block type
    getNumber(): number {
        const min = 1, max = 7
        let blockNum = Math.round(Math.random() * (max - min)) + min
        return blockNum
    }

    getType(): BlockType {

        let blockNumber = this.getNumber()

        // Return the blockType that is going to be used as a css class to define the block layout
        switch (blockNumber) {
            case 1:
                return blockType.I
            case 2:
                return blockType.S
            case 3:
                return blockType.Z
            case 4:
                return blockType.T
            case 5:
                return blockType.L
            case 6:
                return blockType.J
            case 7:
                return blockType.O
            default:
                throw new Error("Unknown block number: " + blockNumber)
        }
    }
}