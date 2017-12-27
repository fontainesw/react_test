import React from 'react';
import axios from "axios"
import './L1M2.css'

const Card = (props) =>{
    return(
        <div className="margin">
            <img width="75" src={props.avatar_url} alt="Test Pic"/>
            <div className="info">
                <div className="title">{props.name}</div>
                <div>{props.company}</div>
            </div>
        </div>
    )
};

const CardList = (props) => {
    return(
        <div>
            {props.cards.map(card => <Card key={card.id} {...card}/>)}
        </div>
    )
}

class Form extends React.Component{
    state = {userName: ''}
    handleSubmit = (event) => {
        event.preventDefault();
        axios.get('https://api.github.com/users/' + this.state.userName).then(resp => {
            this.props.onSubmit(resp.data)
            this.setState({userName: ''})
        })
    };

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <input type="text"
                       value={this.state.userName}
                       onChange={(event) => this.setState({userName: event.target.value})}
                       placeholder="Github username" required/>
                <button type="submit">Add card</button>
            </form>
        )
    }
}

class App extends React.Component {
    state = {
        cards: [
            {
                name: "Paul O'Shannessy",
                avatar_url: "https:avatars.githubusercontent.com/u/8445?v=3",
                company: "Facebook"
            },
            {
                name: "Sophie Alpert",
                avatar_url: "https:avatars.githubusercontent.com/u/6820?v=3",
                company: "Facebook"
            }
        ]
    };

    addNewCard = (cardInfo) =>{
        this.setState(prevState => ({
            cards: prevState.cards.concat(cardInfo)
        }))
    };

    render(){
        return(
            <div>
                <Form onSubmit={this.addNewCard}/>
                <CardList cards={this.state.cards}/>
            </div>
        )
    };
}

export default App;