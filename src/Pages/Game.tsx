import { useState, useEffect, useReducer, Reducer } from 'react';
import { Subscription } from 'rxjs';
import Score from '../components/Score';
import { getCommand, getAction, getCanvasElement } from '../Services/utils';
import { gameInitialState, gameSpeed } from '../models/constants';
import { GameAction, GameCommand, GameState, GameStatus } from '../models/interfaces';
import './Game.scss';
import gameActions from '../store/actions/gameAction';
import Board from '../models/Board';
import gameReducer from '../store/reducers/gameReducer';
import gameAction from '../store/actions/gameAction';

function Game() {
    
    const [inputListener, setInputListener] = useState<Subscription>();
    const [state, dispatch] = useReducer<Reducer<GameState, GameAction>, GameState>(gameReducer, gameInitialState, initState);
    const [board, setBoard] = useState<Board>();
    const [update, setUpdate] = useState<number>();

    let loopId: number;

    // finish first render
    useEffect(() => {
        setInputListener(getCommand().subscribe(command => handleCommand(command)));
        setBoard(new Board(getCanvasElement()));
        return () => {
            inputListener?.unsubscribe();
        }
    }, [])

    // useEffect(() => {
    //     if (!!board) {
    //         setLoopId(setInterval(gameLoop, gameSpeed, board));
    //     }
    //     // stop loop
    //     return () => clearInterval(loopId);
    // }, [board]);

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
        if (loopId) {
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
            setUpdate(Math.random())
        }
        else if (state.status === GameStatus.paused) {
            setLoopId();
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.running });
            setUpdate(Math.random())
        }
        else if (state.status === GameStatus.running) {
            clearLoopId();
            dispatch({ type: gameAction.GAME_STATUS, value: GameStatus.paused });
            setUpdate(Math.random())
        }
        
    }

    function finish(): void {
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

    // useEffect(() => {
    //     game.init();
    //     return () => game.subscription?.unsubscribe();
    // }, [game]);

    // useEffect(() => {
    //     console.log('state change')
    //     setStatus(props.status);
    // }, [props.status]);

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

// const mapStateToProps = (state: GameState) => {
//     console.log(state)
//     const { status } = state;
//     return { status };
// }

// const mapDispatchToProps = (dispatch: any) => ({
//     setGameState: (action: GameAction) => dispatch(action)
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Game);
export default Game;