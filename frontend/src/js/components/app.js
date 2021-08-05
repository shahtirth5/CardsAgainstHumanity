import React from "react";
import {Component} from "react";
import {Grid} from "@material-ui/core";
import * as A from "../shared/actions";
import {ContainerBase} from "../lib/component";
import dialogTypes from "./dialogs";


class AppContainer extends ContainerBase {
    componentWillMount() {
        const {stores: {app}, services: {dispatcher}} = this.context;
        const {history} = this.props;
        this.subscribe(app.dialog$, dialogs => {
            this.setState({dialogs});
        });
        this.subscribe(
            dispatcher.onSuccess$(A.GAME_JOIN), action => {
                const path = `/game/${action.gameId}`;
                if (history.location.pathname == path)
                    return;

                history.push(path);
            }
        );
        this.subscribe(
            dispatcher.onSuccess$(A.LOBBY_JOIN), () => {
                console.log("LOBBY JOIN SUCCESS");
                if (history.location.pathname == '/lobby')
                    return;

                history.push(path);
            }
        );
    }

    render() {
        const {dialogs} = this.state;

        const dialogStack = dialogs.map(dialog => {
            const DialogComponent = dialogTypes[dialog.id];
            return <DialogComponent {...dialog.props} key={dialog.id}/>
        });

        return (
            <>
                {dialogStack}
            </>
        );
    }
}

export default AppContainer;