import React from 'react';


class Button extends React.Component{
    handleClick = () => {
        this.props.onClickFunction(this.props.incrementVal)
    };

    render(){
        return(
            <button onClick={this.handleClick}>
                +{this.props.incrementVal}
            </button>
        )
    };
}

const Result = (props) => {
    return (
        <div>{props.counter}</div>
    )
};

class App extends React.Component {
    state = {counter: 0};

    incrementCounter = (incrementVal) => {
        this.setState((prevState) => ({
            counter: prevState.counter + incrementVal
        }))
    };

    render(){
        return(
            <div>
                <Button incrementVal = {1} onClickFunction = {this.incrementCounter}/>
                <Button incrementVal = {5} onClickFunction = {this.incrementCounter}/>
                <Button incrementVal = {10} onClickFunction = {this.incrementCounter}/>
                <Button incrementVal = {100} onClickFunction = {this.incrementCounter}/>
                <Result counter = {this.state.counter}/>
            </div>
        )
    };
}

export default App;