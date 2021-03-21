import { fromEvent, Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';
import { GameAction } from "../models/interfaces";
import { commandKeys } from '../constants';

export function getKeyDownCommand(): Observable<number> {
    const eventObserable = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
        map(evt => findCommand(evt.key)),
        filter(val => val !== -1)
    );
    return eventObserable;
}

export function getKeyUpCommand(): Observable<number> {
    const eventObserable = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
        map(evt => findCommand(evt.key)),
        filter(val => val === 2)
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

export function getAction(type: string, value: any): GameAction {
    return { type, value };
}

export function getCanvasElement(): HTMLCanvasElement {
    const el: HTMLCanvasElement | null = document.querySelector('canvas');
    if (!!el) return el;
    throw Error('No canvas element found');
}