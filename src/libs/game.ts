import { Subscription } from "rxjs";
import { gameCommand, gameStatus, gameSpeed, statusMsg } from "./constants";
import { getCommand, gameLoop } from './utils';

export default class Game {
    private _context: CanvasRenderingContext2D | null = null;
    private _subs: Subscription | null = null;
    private _loopId: number | null = null;
    private _status = gameStatus.finished;

    get status() {
        return this._status;
    }

    get subscription() {
        return this._subs;
    }

    getStatusText(): string {
        switch(this._status) {
            case gameStatus.running:
                return statusMsg.running;
            case gameStatus.paused:
                return statusMsg.paused;
            case gameStatus.finished:
                return statusMsg.finished;
        }
    }

    init(): void {
        this.setContext();
        this.stopLoop();
        this._subs = getCommand().subscribe(command => this.handleCommand(command));
    }

    start(): void {
        if (this._status !== gameStatus.running) {
            this._status = gameStatus.running;
            this._loopId = setInterval(gameLoop, gameSpeed, this);
        }
        else {
            this.stopLoop();
            this._status = gameStatus.paused;
        }
    }

    finish(): void {
        this.stopLoop();
        this._subs?.unsubscribe();
        this._status = gameStatus.finished;
    }

    stopLoop(): void {
        if (!!this._loopId) {
            clearInterval(this._loopId);
        }
    }

    update(): void {
        this.draw();
    }

    draw(): void {
        if (!!this._context) {
            this._context.fillStyle = "black";
            this._context.fillRect(20, 20, 50, 50);
            console.log('draw')
        }
    }

    handleCommand(command: number): void {
        switch(command) {
            case gameCommand.moveDown:
                console.log('move down');
                break;
            case gameCommand.moveLeft:
                console.log('move left');
                break;
            case gameCommand.moveRight:
                console.log('move right');
                break;
            case gameCommand.strat:
                this.start();
                break;
            case gameCommand.rotate:
                console.log('rotate');
                break;
            case gameCommand.finish:
                this.finish();
                break;
            default:
                console.log('unknown');
                break;
        }
    }
    
    setContext(): void {
        const el: HTMLCanvasElement | null = document.querySelector('#screen');
        if (!!el) {
            this._context  = el.getContext('2d');
        }
        else {
            throw new Error("Canvas context not found!!");
        }
    }
}

