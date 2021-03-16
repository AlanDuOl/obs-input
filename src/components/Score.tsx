// import { Box, Container, Grid } from '@material-ui/core';
import './Score.css';

function Score(props: any){

    return (
        <section className="score-container">
            <div className="score-box">
                <span>Status: </span>
                <span>{props.statusText}</span>
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