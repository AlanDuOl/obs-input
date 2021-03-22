import {
    BLOCK_DELTA_SPEED,
    blockType,
    BLOCK_DELTA_ROTATION, BLOCK_INITIAL_ROTATION,
    WALL_NUM_TILES_WIDTH,
    BLOCK_MAX_SPEED,
    TILE_DIM,
    WALL_EMPTY_VALUE,
} from '../constants';
import { createTilesCopy } from '../Services/utils';
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

    draw(ctx2D: CanvasRenderingContext2D): void {
        ctx2D.fillStyle = this.type.fillStyle
        ctx2D.beginPath()
        this.tiles.forEach(tile => {
            ctx2D.rect(tile.x, tile.y, TILE_DIM, TILE_DIM)
        })
        ctx2D.fill()
    }

    moveDown(): void {
        this.tiles.forEach(tile => {
            tile.y += this.speed
        })
        this.rotationPoint.y += this.speed
    }

    moveLeft(wall: Position[][]): void {
        let canBlockMove = this.checkMoveLeft(wall)
        // If block can move move left
        if (canBlockMove) {
            this.tiles.forEach(tile => {
                tile.x -= TILE_DIM
            })
            this.rotationPoint.x -= TILE_DIM
        }
    }

    moveRight(wall: Position[][]): void {
        let canBlockMove = this.checkMoveRight(wall);
        // If block can move move right
        if (canBlockMove) {
            this.tiles.forEach(tile => {
                tile.x += TILE_DIM
            })
            this.rotationPoint.x += TILE_DIM
        }
    }

    checkMoveLeft(wall: Position[][]): boolean {
        let blockCanMove = true
        let keepLooping = true
        // Check if there is a tile that can't move
        try {
            this.tiles.forEach(tile => {
                if (keepLooping) {
                    let tileRow = Math.floor(tile.y / TILE_DIM)
                    let tileCol = Math.floor(tile.x / TILE_DIM)
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

    checkMoveRight(wall: Position[][]): boolean {
        let blockCanMove = true
        let keepLooping = true
        // Check if there is a tile that can't move
        try {
            this.tiles.forEach(tile => {
                if (keepLooping) {
                    let tileRow = Math.floor(tile.y / TILE_DIM)
                    let tileCol = Math.floor(tile.x / TILE_DIM)
                    if (tileCol < WALL_NUM_TILES_WIDTH - 1) {
                        let endRow = tileRow < 1 ? 1 : tileRow + 1
                        let endCol = tileCol + 1
                        if (tileRow >= 0) {
                            for (let row = tileRow; row <= endRow; row++) {
                                if (wall[row][endCol].x !== 400 && wall[row][endCol].y !== 400) {
                                    blockCanMove = false
                                    keepLooping = false
                                    break
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

    rotate(wall: Position[][]): void {
        if (this.type.name !== "O") {
            const roratedTiles = this.getRotateTiles();
            const correctedTiles = this.correctTilesPosition(roratedTiles);
            // check for collision after rotation
            // if no collision happens, apply the changes
            if (!this.checkCollision(correctedTiles, wall)) {
                this.tiles = correctedTiles;
                this.setNewRotationAngle();
                this.correctRotationPoint();
            }
        }
    }

    checkCollision(tiles: Position[], wall: Position[][]): boolean {
        let collision = false;
        try {
            // To get the block cols and rows
            const blockDims = this.getRowsAndCols(tiles);
            blockDims.cols.forEach(col => {
                if (col < 0 || col >= WALL_NUM_TILES_WIDTH) {
                    collision = true;
                }
            });
            // If no collision happened loop in the wall
            if (!collision) {
                loop1:
                for (let row = blockDims.rows[0]; row <= blockDims.rows[blockDims.rows.length - 1] + 1; row++) {
                    for (let col = blockDims.cols[0]; col <= blockDims.cols[blockDims.cols.length - 1]; col++) {
                        console.log('x', wall[row][col].x, 'y', wall[row][col].y)
                        if (wall[row][col].x !== WALL_EMPTY_VALUE && wall[row][col].y !== WALL_EMPTY_VALUE) {
                            collision = true;
                            break loop1;
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e.message);
        }
        console.log('collision', collision)
        return collision;
    }

    getRowsAndCols(tiles: Position[]): { rows: number[], cols: number[] } {
        let tilesRows: number[] = [];
        let tilesCols: number[] = [];
        tiles.forEach(tile => {
            let row = Math.floor(tile.y / TILE_DIM);
            let col = Math.floor(tile.x / TILE_DIM);
            // save only row values inside the canvas
            if (row >= 0) {
                tilesRows.push(row);
            }
            tilesCols.push(col);
        })
        // Ascending
        tilesRows.sort();
        tilesCols.sort();
        let finalRows = new Set(tilesRows);
        let finalCols = new Set(tilesCols);
        return { rows: Array.from(finalRows.values()), cols: Array.from(finalCols.values()) }
    }

    getRotateTiles(): Position[] {
        const tiles = createTilesCopy(this.tiles);
        // Rotate the points around the rotation point
        try {
            let angle = (Math.PI / 180) * BLOCK_DELTA_ROTATION
            tiles.forEach((tile: Position) => {
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
        return tiles;
    }

    correctTilesPosition(tiles: Position[]): Position[] {
        const correctedTiles = createTilesCopy(tiles);
        const rotationAngle = this.getNewRotationAngle();
        // Correct rotated points of L, J, Z, S blocks
        if (this.type.name !== "I" && this.type.name !== "O") {
            correctedTiles.forEach((tile: Position) => {
                switch (rotationAngle) {
                    case 0:
                        tile.x -= TILE_DIM
                        tile.y += TILE_DIM
                        break
                    case 90:
                        tile.x -= TILE_DIM
                        break
                    case 180:
                        tile.y -= TILE_DIM * 2
                        break
                    case 270:
                        tile.x += TILE_DIM * 2
                        tile.y += TILE_DIM
                        break
                    default:
                        throw new Error("Unknown block rotation angle..." + rotationAngle)
                }
            })
        }
        // Correct rotated points of I block
        else if (this.type.name === "I") {
            correctedTiles.forEach((tile: Position) => {
                switch (rotationAngle) {
                    case 0:
                        tile.x -= TILE_DIM * 3
                        break
                    case 90:
                        break
                    case 180:
                        tile.y -= TILE_DIM * 3
                        break
                    case 270:
                        tile.x += TILE_DIM * 3
                        tile.y += TILE_DIM * 3
                        break
                    default:
                        throw new Error("Unknown block rotation angle..." + rotationAngle)
                }
            })
        }
        return correctedTiles;
    }

    correctRotationPoint(): void {
        let newRotationPoint = { x: 0, y: 0 };
        let centralPoint = this.tiles[3];
        // If the block is T or Z the rotation point is updated differently
        if (this.type.name === "T" || this.type.name === "Z") {
            switch (this.rotationAngle) {
                case 0:
                    newRotationPoint = { x: centralPoint.x, y: centralPoint.y + TILE_DIM };
                    break;
                case 90:
                    newRotationPoint = { x: centralPoint.x - TILE_DIM, y: centralPoint.y }
                    break
                case 180:
                    newRotationPoint = { x: centralPoint.x, y: centralPoint.y - TILE_DIM };
                    break;
                case 270:
                    newRotationPoint = { x: centralPoint.x + TILE_DIM, y: centralPoint.y };
                    break;
                default:
                    throw new Error("Unknown rotation angle for rotation point... " + this.rotationAngle);
            }
        }
        // All other blocks have the central point equalt to point 4
        else {
            newRotationPoint = { x: centralPoint.x, y: centralPoint.y };
        }
        this.rotationPoint = newRotationPoint;
    }

    setNewRotationAngle(): void {
        if (this.rotationAngle >= 270) {
            this.rotationAngle = 0
        }
        else {
            this.rotationAngle += BLOCK_DELTA_ROTATION
        }
    }

    getNewRotationAngle(): number {
        if (this.rotationAngle >= 270) {
            return 0;
        }
        return this.rotationAngle + BLOCK_DELTA_ROTATION;
    }

    setRotationAngle(angle: number): void {
        this.rotationAngle = angle;
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
                { x: leftMostX, y: - TILE_DIM * 4 },
                { x: leftMostX, y: - TILE_DIM * 3 },
                { x: leftMostX, y: - TILE_DIM * 2 },
                { x: leftMostX, y: - TILE_DIM }
            ],
            rotationPoint: { x: leftMostX, y: - TILE_DIM }
        }
        block.tiles.push()
        block.tiles.push()
        block.tiles.push()
        block.tiles.push()
        return block
    }

    getS(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - TILE_DIM
        let block = {
            tiles: [
                { x: leftMostX, y: - TILE_DIM * 3 },
                { x: leftMostX, y: - TILE_DIM * 2 },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM }
            ],
            rotationPoint: { x: leftMostX + TILE_DIM, y: - TILE_DIM }
        }
        return block
    }

    getZ(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - TILE_DIM
        let block = {
            tiles: [
                { x: leftMostX, y: - TILE_DIM * 2 },
                { x: leftMostX, y: - TILE_DIM },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 3 },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 }
            ],
            rotationPoint: { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 }
        }
        return block
    }

    getT(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - TILE_DIM
        let block = {
            tiles: [
                { x: leftMostX, y: - TILE_DIM * 3 },
                { x: leftMostX, y: - TILE_DIM * 2 },
                { x: leftMostX, y: - TILE_DIM },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 }
            ],
            rotationPoint: { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 }
        }
        return block
    }

    getL(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - TILE_DIM
        let block = {
            tiles: [
                { x: leftMostX, y: - TILE_DIM * 3 },
                { x: leftMostX, y: - TILE_DIM * 2 },
                { x: leftMostX, y: - TILE_DIM },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM }
            ],
            rotationPoint: { x: leftMostX + TILE_DIM, y: - TILE_DIM }
        }
        return block
    }

    getJ(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - TILE_DIM
        let block = {
            tiles: [
                { x: leftMostX, y: - TILE_DIM },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 3 },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM }
            ],
            rotationPoint: { x: leftMostX + TILE_DIM, y: - TILE_DIM }
        }
        return block
    }

    getO(canvasDims: CanvasDimensions): BlockShape {
        let leftMostX = canvasDims.width / 2 - TILE_DIM
        let block = {
            tiles: [
                { x: leftMostX, y: - TILE_DIM * 2 },
                { x: leftMostX, y: - TILE_DIM },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM * 2 },
                { x: leftMostX + TILE_DIM, y: - TILE_DIM }
            ],
            rotationPoint: { x: leftMostX + TILE_DIM, y: - TILE_DIM }
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