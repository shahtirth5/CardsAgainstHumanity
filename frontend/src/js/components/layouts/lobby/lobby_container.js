import React from "react";
import Alert from '@material-ui/lab/Alert';
import {Card} from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Chat from "../chat";
import {ContainerBase} from "../../../lib/component";
import * as A from "../../../shared/actions"

class LobbyContainer extends ContainerBase {
    constructor(props) {
        super(props);
        this._joinGame = (game) => this.request(A.gameJoin(game.id));
        this._sendMessage = (message) => {
            this.request(A.lobbySendMessage(message));
        }
    }

    componentWillMount() {
        const {stores: {lobby, app}} = this.context;
        this.subscribe(lobby.opSendMessage$, opSendMessage => this.setState({opSendMessage}));
        this.subscribe(lobby.view$, lobby => this.setState({lobby}));
        this.subscribe(app.reconnected$, () => this.request(A.lobbyJoin()));

        this.request(A.lobbyJoin());
    }

    render() {
        const {lobby: {games, messages}, opSendMessage} = this.state;
        // const games = [
        //     {title: "Game 1", id: 1, players: ["one", "two", "three"]},
        //     {title: "Game 2", id: 2, players: ["one", "two", "three"]},
        //     {title: "Game 3", id: 3, players: ["one", "two", "three"]},
        // ];
        //
        // const opSendMessage = {can: true, inProgress: false};
        // const messages = [
        //     {index: 1, name: "Person", message: "Hey"},
        //     {index: 2, name: "Person", message: "Hi"},
        //     {index: 3, name: "Whoa", message: "Hey"},
        //     {index: 4, name: "Person", message: "Whats Up !"},
        // ];
        return (
            <section id="lobby-container" className="m-2">
                <GameList games={games} joinGame={this._joinGame}></GameList>
                <Chat
                    messages={messages}
                    opSendMessage={opSendMessage}
                    sendMessage={this._sendMessage}
                />
            </section>
        );
    }
}

function GameList({games, joinGame}) {
    return (
        <section id="game-list">
            {games.length > 0 ? null : <Alert severity="error"> There are no games yet</Alert>}
            <Grid container spacing={2}>
                {games
                    .map(game => {
                        return (
                            <Grid item xs={4} key={game.id}>
                                <div className="card m-1">
                                    <div className="card-header">{game.title}</div>
                                    <div className="card-body">
                                        <p className="card-text">{game.players.join(", ")}</p>
                                    </div>
                                    <Button
                                        variant="outlined"
                                        style={{backgroundColor: "#5cb85c", color: "white"}}
                                        className="m-2"
                                        onClick={() => joinGame(game)}
                                    >Join Game</Button>
                                </div>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </section>
    );
}

export default LobbyContainer;

/*
<Card variant="outlined" className="m-1 card">
                                    <CardContent>
                                        <h4 className="card-header">{game.title}</h4>
                                        <p className="card-body">{game.players.join(", ")}</p>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            style={{backgroundColor: "#5cb85c", color: "white"}}
                                            onClick={() => joinGame(game)}
                                        >Join Game</Button>
                                    </CardActions>
                                </Card>

 */