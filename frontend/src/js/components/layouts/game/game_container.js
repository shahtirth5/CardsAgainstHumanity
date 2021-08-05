import React from "react";
import {ContainerBase} from "../../../lib/component";
import * as A from "../../../shared/actions"
import {withRouter} from "react-router-dom"
import GameSetup from "./game_setup";
import GameBoard from "./game_board";
import Chat from "../chat";
import Alert from "@material-ui/lab/Alert/Alert";

class GameContainer extends ContainerBase {
    constructor(props) {
        super(props);
        this._sendMessage = (message) => this.request(A.gameSendMessage(this.props.gameId, message));
    }

    componentWillMount() {
        const {stores: {app, game}} = this.context;
        const gameId = parseInt(this.props.gameId);

        this.subscribe(game.opJoinGame$, opJoinGame => this.setState({opJoinGame}));
        this.subscribe(game.opSendMessage$, opSendMessage => this.setState({opSendMessage}));
        this.subscribe(game.view$, game => this.setState({game}));
        this.subscribe(app.reconnected$, () => this.request(A.gameJoin(gameId)));
        this.request(A.gameJoin(gameId));
    }
    render() {
        const {opJoinGame, opSendMessage, game} = this.state;
        let body = null;
        let showChat = true;
        if(opJoinGame.inProgress) {
            body = <div className="alert alert-info">Joining Game ...</div>;
            showChat = false;
        } else if(opJoinGame.error) {
            body = <div className="alert alert-danger">Cannot Join Game : {opJoinGame.error}</div>;
            showChat = false;
        } else if(game.step == A.STEP_DISPOSED) {
            // body = <div className="alert alert-danger" style={{backgroundColor: "#cf1b1b"}}>Game Doesn't Exist !!</div>;
            body = <Alert variant="filled" severity="error"  style={{backgroundColor: "#cf1b1b"}}>Game Doesn't Exist</Alert>
            showChat = false;
        } else if(game.step == A.STEP_SETUP) {
            body = <GameSetup gameId={this.props.gameId}/>
        } else {
            body = <GameBoard gameId={this.props.gameId}/>
        }
        return (
            <section id="game-container" className="m-2">
                {body}
                {
                    !showChat ? null : <Chat messages={game.messages} opSendMessage={opSendMessage} sendMessage={this._sendMessage}/>
                }
            </section>
        );
    }
}

export default withRouter(GameContainer);