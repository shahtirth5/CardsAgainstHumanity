import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from "react-router-dom";
import _ from "lodash";
import io from "socket.io-client";

import * as A from "./js/shared/actions";
import { Dispatcher } from "./js/shared/dispatcher";
import createStores from "./js/stores/index";
import { StoreProvider } from "./js/lib/component";


//--------------------------------------------------------------------
// Services
//--------------------------------------------------------------------
const dispatcher = new Dispatcher();
const socket = io("127.0.0.1:3000");
const services = { dispatcher, socket };

// --------------------------------------------------------------------
// Stores
//--------------------------------------------------------------------
const stores = createStores(services);

socket.on("action", action => {
    dispatcher.emit(action);
});

//--------------------------------------------------------------------
// Helpers
//--------------------------------------------------------------------
dispatcher.on("*", printAction);

function printAction(action) {
    if (action.hasOwnProperty("status")) {
        let style = null;
        switch (action.status) {
            case A.STATUS_REQUEST:
                style = "color: blue";
                break;
            case A.STATUS_FAIL:
                style = "color: red";
                break;
            case A.STATUS_SUCCESS:
                style = "color: green";
                break;
        }

        console.log(`%c${action.type}`, `${style}; font-weight: bold; background: #eee, width: 100%; display: block;`);
    } else {
        console.log(`%c${action.type}`, `background: #ddd; color: black;`);
    }

    const result = _.omit(action, ["type", "status"]);
    if (_.keys(result).length) {
        console.log(result);
    }
}


//--------------------------------------------------------------------
// Main
//--------------------------------------------------------------------
function main() {
    const routes = require('./routes').default()
    const wrapper = document.getElementById("container");
    ReactDOM.render(
        <StoreProvider stores={stores} services={services}>
            <Router>
                {routes}
            </Router>
        </StoreProvider>
        , wrapper);
}

main();

