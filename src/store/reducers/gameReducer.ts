import { Reducer } from 'react';
import { statusText } from '../../models/constants';
import { GameAction, GameState, GameStatus } from '../../models/interfaces';
import gameAction from '../actions/gameAction';

const gameReducer = (state: GameState, action: GameAction) => {

    switch (action.type) {
        case gameAction.GAME_STATUS:
            return setStatus(state, action.value);
        default:
            return state;
    }

}

function setStatus(state: GameState, newStatus: GameStatus): GameState {
    
    switch (newStatus) {
        case GameStatus.finished:
            return Object.assign( state, { 
                status: GameStatus.finished,
                statusText: statusText.finished
            });
        case GameStatus.paused:
            return Object.assign( state, { 
                status: GameStatus.paused,
                statusText: statusText.paused
            });
        case GameStatus.running:
            return Object.assign( state, {
                status: GameStatus.running,
                statusText: statusText.running
            });
        default:
            throw new Error("Unexpected status value");
    }

}

export default gameReducer;