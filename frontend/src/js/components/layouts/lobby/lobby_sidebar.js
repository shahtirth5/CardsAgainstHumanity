import React from "react";
import Button from "@material-ui/core/Button";
import {ContainerBase} from "../../../lib/component";
import * as A from "../../../shared/actions";

class LobbySidebar extends ContainerBase {
    constructor(props) {
        super(props);
        this._login = () => {
            this.dispatch(A.dialogSet(A.DIALOG_LOGIN, true));
        };

        this._createGame = () => {
            this.request(A.gameCreate());
        }
    }

    componentWillMount() {
        const {stores: {user, game}} = this.context;
        this.subscribe(user.opLogin$, opLogin => this.setState({opLogin}));
        this.subscribe(game.opCreateGame$, opCreateGame => this.setState({opCreateGame}));
    }

    render() {
        const {opLogin, opCreateGame} = this.state;
        return (
            <section id="lobby-sidebar" className="m-2">
                {!opLogin.can ? null :
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        className="m-2"
                        onClick={this._login}>Login</Button>}

                {!opCreateGame.can ? null :
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="m-2"
                        onClick={this._createGame}
                        disabled={opCreateGame.inProgress}
                    >Create Game</Button>
                }
            </section>
        );
    }
}

export default LobbySidebar;