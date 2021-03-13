import { Subscription } from "rxjs";
import { gameSpeed, statusText } from "./constants";
import { GameStatus, GameCommand, GameAction } from './interfaces';
import { getCommand, getAction } from '../Services/utils';
import gameActions from "../store/actions/gameAction";

export default class Board {

    private _context: CanvasRenderingContext2D | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this._context  = canvas.getContext('2d');
    }

    update(): void {
        this.draw();
    }

    draw(): void {
        if (!!this._context) {
            this._context.fillStyle = "black";
            this._context.fillRect(20, 20, 50, 50);
        }
    }
}

