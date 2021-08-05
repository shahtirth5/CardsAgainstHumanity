import React from "react";
import {
    Route,
    Link,
    Switch
} from "react-router-dom";

import AppContainer from "./js/components/app";
import Lobby from "./js/components/lobby";
import Game from "./js/components/game";

export default function () {
    return (
        <div>
            <Route path="/" component={AppContainer}/>
            <Route path="/lobby" component={Lobby} exact/>
            <Route path="/game/:gameId" component={Game} exact/>
        </div>
    );
}