import * as A from "../shared/actions";
import { map } from "rxjs/operators";
import { of } from "rxjs"
import { validateMessage } from "../shared/validation/chat";
import { Validator } from "../shared/validation";
import { mapOp$ } from "../shared/observable";
import { createView$ } from "../lib/stores";

const defaultView = {
    messages: [
        // {index: 1, name: "Person", message: "Hey"},
        // {index: 2, name: "Person", message: "Hi"},
        // {index: 3, name: "Whoa", message: "Hey"},
        // {index: 4, name: "Person", message: "Whats Up !"},
    ],
    games: [
        // {title: "Game 1", id: 1, players: ["one", "two", "three"]},
        // {title: "Game 2", id: 2, players: ["one", "two", "three"]},
        // {title: "Game 3", id: 3, players: ["one", "two", "three"]},
    ]
}
export default class LobbyStore {
    constructor({ dispatcher, socket }, user) {
        this.view$ = createView$(dispatcher, A.VIEW_LOBBY, defaultView);

        dispatcher.onRequest({
            [A.LOBBY_JOIN]: action => socket.emit("action", action),
            [A.LOBBY_SEND_MESSAGE]: action => {
                const validator = new Validator();
                if (!user.isLoggedIn) {
                    validator.push("You Must Log In");
                }
                validator.push(validateMessage(action.message));
                if (validator.didFail) {
                    dispatcher.fail(action, validator.message);
                }
                socket.emit("action", action);
            }
        });

        this.opSendMessage$ = mapOp$(
            dispatcher.on$(A.LOBBY_SEND_MESSAGE),
            user.details$.pipe(map(u => u.isLoggedIn))
        )
    }
}
