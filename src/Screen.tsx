import { useState, useEffect } from 'react';
import Game from './libs/game';
import './Screen.scss';

function Screen() {
    const [game] = useState<Game>(new Game());
    // useEffect(() => {
    //     const sub = getCommand().subscribe(code => setCommand(code));
    //     return () => { sub.unsubscribe() }
    // });

    useEffect(() => {
        game.init();
        return () => game.subscription?.unsubscribe();
    }, [game]);

    

    return (<div>
            <canvas id="screen" width="500" height="500">This app does not work in the browser current version!!</canvas>
        </div>);
}

export default Screen;