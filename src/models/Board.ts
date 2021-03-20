import { WALL_NUM_TILES_WIDTH } from "../constants";
import Block from "./Block";
import Wall from "./Wall";
import { CanvasDimensions } from "./interfaces";


export default class Board {

    private ctx2D: CanvasRenderingContext2D | null;
    private canvasDims: CanvasDimensions;
    private block: Block;
    // private wall: Wall = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasDims = { width: canvas.width, height: canvas.height, tileDim: canvas.width / WALL_NUM_TILES_WIDTH };
        this.ctx2D  = canvas.getContext('2d');
        this.block = new Block(this.canvasDims);
        // this.wall = new Wall
    }

    update(): void {
        this.updateObjects();
        this.clearCanvas();
        this.drawObjects();
    }

    private drawObjects(): void {
        if (this.ctx2D)
            this.block.draw(this.ctx2D, this.canvasDims.tileDim);
        else
            throw new Error("No 2d context found...");
    }

    private updateObjects(): void {
        this.block.moveDown();
    }

    // finish(): void {
    //     this.ctx2D?.restore();
    // }

    private clearCanvas(): void {
        if (this.ctx2D) {
            this.ctx2D.clearRect(0, 0, this.canvasDims.width, this.canvasDims.height)
        }
    }
}

