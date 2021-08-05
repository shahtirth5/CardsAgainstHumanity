import React from "react";
import {Grid, Drawer, AppBar, Toolbar, IconButton, Typography, Hidden} from "@material-ui/core";
import GameSidebar from "./layouts/game/game_sidebar";
import GameContainer from "./layouts/game/game_container";
import {ContainerBase} from "../lib/component";
import dialogTypes from "./dialogs";
import * as A from "../shared/actions";

class Game extends ContainerBase {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container spacing={2} style={{maxWidth: "100%", maxHeight: "100vh"}}>
                <Grid item xs={3}>
                    <GameSidebar gameId={this.props.match.params.gameId}/>
                </Grid>
                <Grid item xs={9}>
                    <GameContainer gameId={this.props.match.params.gameId}/>
                </Grid>
            </Grid>
        );
    }
}

export default Game;

/*

 */