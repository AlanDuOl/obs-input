import { useState, useEffect, useReducer, Reducer, useCallback } from 'react';
import { Observable } from 'rxjs';
import Score from '../components/Score';
import { getKeyUpCommand, getKeyDownCommand, getCanvasElement } from '../Services/utils';
import { gameInitialState, GAME_SPEED, canvas } from '../constants';
import { GameAction, GameCommand, GameState, GameStatus } from '../models/interfaces';
import './Game.scss';
import Board from '../models/Board';
import gameReducer from '../store/reducers/gameReducer';
import gameAction from '../store/actions/gameAction';


function Game() {
    
    const [keyDown] = useState<Observable<number>>(getKeyDownCommand());
    const [keyUp] = useState<Observable<number>>(getKeyUpCommand());
    const [state, dispatch] = useReducer<Reducer<GameState, GameAction>, GameState>(gameReducer, gameInitialState, initState);
    const [board, setBoard] = useState<Board>();
    
    const loop = useCallback((board: Board) => {
        if (state.status === GameStatus.finished) {
            console.log('Game finished');
        }
        else if (state.status === GameStatus.paused) {
            console.log('Game paused');
        }
        else {
            console.log('Game running');
            board.update(state);
        }
    },
    [state]);

    const startStop = useCallback(() => {
        if (state.status === GameStatus.finished) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
            setBoard(new Board(getCanvasElement(), dispatch, state));
        }
        else if (state.status === GameStatus.paused) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
        }
        else if (state.status === GameStatus.running) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.paused });
        }
        else {
            throw new Error("Unknown game status " + state.status);
        }
    },
    [state]);

    const finish = useCallback(() => {
        if (state.status !== GameStatus.finished) {
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.finished });
            board?.clearCanvas();
        }
    }, [state.status, board]);

    const handleCommand = useCallback((command: number) => {
        if(command === GameCommand.start) {
            startStop();
        }
        else if (command === GameCommand.finish) {
            finish();
        }
        else {
            board?.updateBlock(command);
        }
    },
    [startStop, finish, board]);

    const handleReleaseCommand = useCallback((command: number) => {
        if(command === GameCommand.speedUp) {
            board?.resetBlockSpeed();
        }
    },
    [board]);

    useEffect(() => {
        let loopId = setInterval(loop, GAME_SPEED, board);
        return () => clearInterval(loopId);
    }, [loop, board]);

    useEffect(() => {
        const pressCommand = keyDown?.subscribe((command: number) => handleCommand(command));
        const releaseCommand = keyUp?.subscribe((command: number) => handleReleaseCommand(command));
        return () => {
            pressCommand?.unsubscribe()
            releaseCommand?.unsubscribe()
        };
    }, [keyDown, keyUp, handleCommand, handleReleaseCommand]);

    function initState(gameInitialState: GameState): GameState {
        return gameInitialState;
    }

    return (
        <div id="screen">
            <Score statusText={state.statusText} score={state.score} level={state.level} />
            <canvas width={canvas.width} height={canvas.height}>
                This app does not work in the browser current version!!
            </canvas>
            {console.log('rerendered')}
        </div>
    );
}

export default Game;