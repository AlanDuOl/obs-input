import { WALL_NUM_TILES_WIDTH } from "../constants";
import Block from "./Block";
import Wall from "./Wall";
import { CanvasDimensions, GameCommand } from "./interfaces";


export default class Board {

    private ctx2D: CanvasRenderingContext2D | null;
    private canvasDims: CanvasDimensions;
    private block: Block;
    private wall: Wall;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasDims = { width: canvas.width, height: canvas.height, tileDim: canvas.width / WALL_NUM_TILES_WIDTH };
        this.ctx2D  = canvas.getContext('2d');
        this.block = new Block(this.canvasDims);
        this.wall = new Wall();
    }

    update(): void {
        this.updateObjects();
        this.clearCanvas();
        this.drawObjects();
    }

    updateBlock(command: number): void {
        switch(command) {
            case GameCommand.moveDown:
                console.log('move down');
                break;
            case GameCommand.moveLeft:
                this.block.moveLeft(this.canvasDims.tileDim, this.wall.getTiles());
                break;
            case GameCommand.moveRight:
                this.block.moveRight(this.canvasDims.tileDim, this.wall.getTiles());
                break;
            case GameCommand.rotate:
                this.block.rotate(this.canvasDims, this.wall.getTiles());
                break;
            default:
                throw new Error('Unknown command ' + command);
        }
    }

    private drawObjects(): void {
        if (!!this.ctx2D) {
            this.block.draw(this.ctx2D, this.canvasDims.tileDim);
            this.wall.draw(this.ctx2D, this.canvasDims.tileDim);
        }
        else {
            throw new Error("No 2d context found...");
        }
    }

    private updateObjects(): void {
        this.block.moveDown();
    }

    public clearCanvas(): void {
        if (this.ctx2D) {
            this.ctx2D.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height)
        }
    }
}

