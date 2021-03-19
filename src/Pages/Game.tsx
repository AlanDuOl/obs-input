import { useState, useEffect, useReducer, Reducer, useCallback } from 'react';
import { Observable } from 'rxjs';
import Score from '../components/Score';
import { getCommand, getCanvasElement } from '../Services/utils';
import { gameInitialState, gameSpeed } from '../constants';
import { GameAction, GameCommand, GameState, GameStatus } from '../models/interfaces';
import './Game.scss';
import Board from '../models/Board';
import gameReducer from '../store/reducers/gameReducer';
import gameAction from '../store/actions/gameAction';


function Game() {
    
    const [input] = useState<Observable<number>>(getCommand());
    const [state, dispatch] = useReducer<Reducer<GameState, GameAction>, GameState>(gameReducer, gameInitialState, initState);
    const [board, setBoard] = useState<Board>();
    
    const loop = useCallback((board: Board) => {
        if (state.status === GameStatus.finished) {
            console.log('Game finished');
            board.finish();
        }
        else if (state.status === GameStatus.paused) {
            console.log('Game paused');
        }
        else {
            console.log('Game running');
            board.update();
        }
    },
    [state]);

    const startStop = useCallback(() => {
        if (state.status === GameStatus.finished) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
        }
        else if (state.status === GameStatus.paused) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
        }
        else if (state.status === GameStatus.running) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.paused });
        }
    },
    [state.status]);

    const finish = useCallback(() => {
        console.log('game finish');
        if (state.status !== GameStatus.finished) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.finished });
        }
    }, [state.status]);

    const handleCommand = useCallback((command: number) => {
        switch(command) {
            case GameCommand.moveDown:
                console.log('move down');
                break;
            case GameCommand.moveLeft:
                console.log('move left');
                break;
            case GameCommand.moveRight:
                console.log('move right');
                break;
            case GameCommand.start:
                startStop();
                break;
            case GameCommand.rotate:
                console.log('block rotate');
                break;
            case GameCommand.finish:
                finish();
                break;
            default:
                throw Error('Unknown command');
        }
    },
    [startStop, finish]);

    useEffect(() => {
        let loopId = setInterval(loop, gameSpeed, board);
        return () => clearInterval(loopId);
    }, [loop, board]);

    useEffect(() => {
        const sub = input?.subscribe((command: number) => handleCommand(command));
        setBoard(new Board(getCanvasElement()));
        return () => sub?.unsubscribe();
    }, [input, handleCommand]);

    function initState(gameInitialState: GameState): GameState {
        return gameInitialState;
    }

    return (
        <div id="screen">
            <Score statusText={state.statusText} score={state.score} level={state.level} />
            <canvas width="500" height="500">
                This app does not work in the browser current version!!
            </canvas>
            {console.log('rerendered')}
        </div>
    );
}

export default Game;