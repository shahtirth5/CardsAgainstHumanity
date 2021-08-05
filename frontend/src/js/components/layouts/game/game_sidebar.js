import React, {Fragment} from "react";
import {ContainerBase} from "../../../lib/component";
import Button from "@material-ui/core/Button";
import * as A from "../../../shared/actions";
import {withRouter} from "react-router-dom"
import {List, ListItem, ListItemText, Paper} from "@material-ui/core";

class GameSidebar extends ContainerBase {
    constructor(props) {
        super(props);

        this._exitGame = () => this.props.history.push("/lobby");
        this._login = () => this.dispatch(A.dialogSet(A.DIALOG_LOGIN, true));
    }

    componentWillMount() {
        const {stores: {user, game}} = this.context;
        this.subscribe(user.opLogin$, opLogin => this.setState({opLogin}));
        this.subscribe(game.view$, game => this.setState({game}));
    }

    render() {
        const {opLogin, game} = this.state;

        return (
            <section id="game-sidebar" className="m-2">
                {!opLogin.can ? null :
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="m-2"
                        onClick={this._login}>Login To Join Game</Button>}

                <Button variant="contained" color="secondary" className="m-2" fullWidth onClick={this._exitGame}>Exit
                    Game</Button>

                {game.step == A.STEP_DISPOSED ? null :
                    <PlayerList players={game.players}/>
                }
            </section>
        );
    }
}

function PlayerList({players}) {
    return (
        <List className="list-group m-2 w-100 p-0" style={{maxHeight: "80vh", overflow: 'auto'}}>
            {
                players.map(player => {
                    const [cls, status] = getPlayerStatus(player);
                    return (
                        <ListItem key={player.id} className="list-group-item">
                            <ListItemText>
                                <div>{player.name}</div>
                                <div>
                                    {player.score}
                                    {player.score == 1 ? " point" : " points"}
                                </div>
                                <div className={cls}>{status}</div>
                            </ListItemText>
                        </ListItem>
                    );

                })
            }
        </List>
    );
}

function getPlayerStatus({isCzar, isWinner, isPlaying}) {
    if (isCzar) return ["badge", "Czar"];
    if (isWinner) return ["badge badge-warning text-white", "Winner"]
    if (isPlaying) return ["badge badge-success", "Playing"];
    return ["", "", ""];
}

export default withRouter(GameSidebar);