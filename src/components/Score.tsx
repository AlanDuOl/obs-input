import { Box, Container, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './Score.css';

function Score(props: any){
    const [statusText, setStatusText] = useState<string>();

    useEffect(() => {
        console.log('rendered score:', props.statusText)
        setStatusText(props.statusText);
    }, [props.statusText])

    return (
        <section className="score-container">
            <div className="score-box">
                <span>Status: </span>
                <span>{statusText}</span>
            </div>
            <div className="score-box">
                <span>Level: </span>
                <span>{props.level}</span>
            </div>
            <div className="score-box">
                <span>Score: </span>
                <span>{props.score}</span>
            </div>
        </section>
    )
}

export default Score;