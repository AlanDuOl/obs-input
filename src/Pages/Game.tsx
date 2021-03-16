import { useState, useEffect, useReducer, Reducer } from 'react';
import { Observable } from 'rxjs';
import Score from '../components/Score';
import { getCommand, getCanvasElement } from '../Services/utils';
import { gameInitialState, gameSpeed } from '../models/constants';
import { GameAction, GameCommand, GameState, GameStatus } from '../models/interfaces';
import './Game.scss';
import Board from '../models/Board';
import gameReducer from '../store/reducers/gameReducer';
import gameAction from '../store/actions/gameAction';

function Game() {
    
    const [input, setInput] = useState<Observable<number>>();
    const [state, dispatch] = useReducer<Reducer<GameState, GameAction>, GameState>(gameReducer, gameInitialState, initState);
    const [board, setBoard] = useState<Board>();

    let loopId: number;
    
    useEffect(() => {
        const sub = input?.subscribe((command: number) => handleCommand(command));
        return () => sub?.unsubscribe();
    });

    useEffect(() => {
        setInput(getCommand());
        setBoard(new Board(getCanvasElement()));
    }, [])

    function gameLoop(gameBoard: Board): void {
        console.log(state.statusText);
        if (state.status === GameStatus.running) {
            // update();
        }
    }

    function initState(gameInitialState: GameState): GameState {
        return gameInitialState;
    }

    function handleCommand(command: number): void {
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
                start();
                break;
            case GameCommand.rotate:
                console.log('block rotate');
                break;
            case GameCommand.finish:
                console.log('game finish');
                finish();
                break;
            default:
                throw Error('Unknown command');
        }

    }

    function setLoopId(): void {
        if (!!loopId) {
            clearInterval(loopId);
            loopId = 0;
        }
        else {
            loopId = setInterval(gameLoop, gameSpeed, board);
        }
    }

    function clearLoopId(): void {
        if (loopId) {
            clearInterval(loopId);
            loopId = 0;
        }
    }

    function start(): void {
        if (state.status === GameStatus.finished) {
            setLoopId();
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
        }
        else if (state.status === GameStatus.paused) {
            setLoopId();
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
        }
        else if (state.status === GameStatus.running) {
            clearLoopId();
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.paused });
        }
        
    }

    function finish(): void {
        // sub?.unsubscribe();
        // this.stopLoop();
        // this._subs?.unsubscribe();
        // this._status = GameStatus.finished;
    }

    // init(): void {
    //     this.setContext();
    //     this.stopLoop();
    //     this._subs = getCommand().subscribe(command => this.handleCommand(command));
    // }

    // function printProps() {
    //     // setStatus(props);
    //     // console.log(props);
    //     props.setGameState(getAction(gameActions.GAME_STATUS, GameStatus.running))
    // }

    return (
            <div id="screen">
                <Score statusText={state.statusText} score={state.score} level={state.level} />
                <canvas id="screen" width="500" height="500">
                    This app does not work in the browser current version!!
                </canvas>
                {console.log('rerendered')}
            </div>
        );
}

export default Game;