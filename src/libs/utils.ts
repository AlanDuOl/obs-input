import { fromEvent, Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';
import { commandKeys, gameStatus } from './constants';
import Game from "./game";

export function getCommand(): Observable<number> {
    const eventObserable = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
        map(evt => findCommand(evt.key)),
        filter(val => val !== -1)
    );
    return eventObserable;
}

function findCommand(key: string): number {
    let result: string | undefined;
    let val = -1;
    commandKeys.forEach((command: string[], index: number) => {
        result = command.find((val: string) => val === key);
        if(!!result) {
            val = index;
        }
    })
    return val;
}

export function gameLoop(game: Game): void {
    if (game.status === gameStatus.finished) {
        game.finish();
    }
    else {
        game.update();
    }
}