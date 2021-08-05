import React from "react";
import Grid from "@material-ui/core/Grid";
import LobbySidebar from "./layouts/lobby/lobby_sidebar";
import LobbyContainer from "./layouts/lobby/lobby_container";
import {ContainerBase} from "../lib/component";
import dialogTypes from "../components/dialogs";
import * as A from "../shared/actions";

class Lobby extends ContainerBase {
    render() {
        return (
            <Grid container spacing={2} style={{height: "100vh", maxWidth: "100%"}}>
                <Grid item xs={3}>
                    <LobbySidebar/>
                </Grid>
                <Grid item xs={9}>
                    <LobbyContainer/>
                </Grid>
            </Grid>
        );
    }
}

export default Lobby;