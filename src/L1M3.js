import React from 'react';
import './L1M3.css'

const Stars = (props) => {

    let stars = [];
    for (let i=0; i<props.numberOfStars; i++){
        stars.push(<i key={i} className="star">Y</i>)
        if(i === 4){
            stars.push(<br key={10}/>)
        }
    }

    return(
        <div>
            {stars}
        </div>
    );
};

const Button = (props) => {

    let button;
    switch(props.answerIsCorrect) {
        case true:
            button =
                <button className="btn" onClick={props.acceptAnswer}>
                    <i className="check">a</i>
                </button>;
            break;
        case false:
            button =
                <button className="btn">
                    <i className="times">r</i>
                </button>;
            break;
        default:
            button =
                <button className="btn"
                        onClick={props.checkAnswer}
                        disabled={props.selectedNumbers.length === 0}>
                    =
                </button>;
            break;
    }

    return(
        <div>
            <table className="buttons" align="center">
                <tbody>
                    <tr>
                        <td>
                            {button}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <br/>
                            <button className="btn" onClick={props.redraw} disabled={props.redraws === 0}>
                                <i className="refresh">q</i>
                                <div>{props.redraws}</div>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const Answer = (props) => {
    return(
        <div>
            {props.selectedNumbers.map((number, i) =>
                <span key={i} onClick={() => props.deselectNumber(number)}>{number}</span>
            )}
        </div>
    );
};

const Numbers = (props) => {
    const arrayOfNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const numberClassName = (number) => {
        if(props.selectedNumbers.indexOf(number) >= 0){
            return 'selected';
        }

        if(props.usedNumbers.indexOf(number) >= 0){
            return 'used';
        }

    };

    return (
        <div className="card">
            <div>
                {arrayOfNumbers.map((number, i) =>
                    <span onClick={() => props.selectNumber(number)} key={i}
                          className={numberClassName(number)}>{number}</span>
                )}
            </div>
        </div>
    );
};


const DoneFrame = (props) => {
    return (
        <div>
            {props.doneStatus}
            <button onClick={props.restart}>
                Play Again
            </button>
        </div>
    )
}


class Game extends React.Component {
    rand = () => {
        return (1 + Math.floor (Math.random() * 9))
    }

    state = {
        selectedNumbers: [],
        usedNumbers: [],
        answerIsCorrect: null,
        numberOfStars: this.rand(),
        redraws: 5,
        doneStatus: null
    };

    selectNumber = (clickedNumber) => {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0){
            return;
        }
        if(this.state.usedNumbers.indexOf(clickedNumber) >= 0){
            return;
        }

        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }))
    }

    deselectNumber = (clickedNumber) => {
        this.setState(prevState =>({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }))
    }

    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.numberOfStars ===
            prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
        }));
        return this.state.answerIsCorrect
    };

    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            numberOfStars: this.rand()
        }), this.updateDoneStatus)
    };

    possibleSolutions = ({numberOfStars, usedNumbers}) => {
        const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(number => usedNumbers.indexOf(number) === -1);
        return this.possibleCombinationSum(possibleNumbers, numberOfStars)
    };

    possibleCombinationSum = function(arr, n) {
        if (arr.indexOf(n) >= 0) { return true; }
        if (arr[0] > n) { return false; }
        if (arr[arr.length - 1] > n) {
            arr.pop();
            return this.possibleCombinationSum(arr, n);
        }
        var listSize = arr.length, combinationsCount = (1 << listSize)
        for (var i = 1; i < combinationsCount ; i++ ) {
            var combinationSum = 0;
            for (var j=0 ; j < listSize ; j++) {
                if (i & (1 << j)) { combinationSum += arr[j]; }
            }
            if (n === combinationSum) { return true; }
        }
        return false;
    };

    updateDoneStatus = () => {
        this.setState(prevState => {
            if(prevState.usedNumbers.length === 9){
                return {doneStatus: 'Winner'}
            }
            if (prevState.redraws === 0 && !this.possibleSolutions(prevState)){
                return {doneStatus: 'You Lose'}
            }
            return { doneStatus: null}
        })
    };

    redraw = () => {
        if(this.state.redraws > 0) {
            this.setState(prevState => ({
                selectedNumbers: [],
                answerIsCorrect: null,
                numberOfStars: this.rand(),
                redraws: (prevState.redraws - 1)
            }), this.updateDoneStatus)
        }
    }

    restart = () => {
        this.setState({
            selectedNumbers: [],
            usedNumbers: [],
            answerIsCorrect: null,
            numberOfStars: this.rand(),
            redraws: 5,
            doneStatus: null
        })
    }

    render(){
        const { selectedNumbers, numberOfStars, answerIsCorrect, usedNumbers, redraws, doneStatus} = this.state;
        return(
            <div>
                <h3>Game</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Stars numberOfStars={numberOfStars}/>
                            </td>
                            <td>
                                <Button selectedNumbers={selectedNumbers} checkAnswer={this.checkAnswer}
                                        answerIsCorrect={answerIsCorrect} acceptAnswer={this.acceptAnswer}
                                        redraw={this.redraw} redraws={redraws}/>
                            </td>
                            <td>
                                <Answer selectedNumbers={selectedNumbers} deselectNumber={this.deselectNumber}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                {
                    doneStatus ? <DoneFrame doneStatus={doneStatus} restart={this.restart}/> :
                        <Numbers selectedNumbers={selectedNumbers} selectNumber={this.selectNumber}
                                 usedNumbers={usedNumbers}/>
                }


            </div>
        )
    };
}

class App extends React.Component {
    render(){
        return(
            <div>
               <Game/>
            </div>
        )
    };
}

export default App;