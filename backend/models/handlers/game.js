const A = require("../../shared/actions");
const { HandlerBase } = require("../../lib/handlers");
const { validateMessage } = require("../../shared/validation/chat");

class GameHandlers extends HandlerBase {
    constructor(client, game) {
        super(client);
        this.game = game;
        this.onDispose(
            game.addClient(client),

            client.onRequest(A.GAME_SEND_MESSAGE, action => {
                const validator = validateMessage(action.message);
                if(validator.didFail) {
                    client.fail(action, validator.message);
                    return;
                }
                game.sendMessage(client, action.message);
            }),

            client.onRequest(A.GAME_SET_OPTIONS, action => {
                const validator = game.setOptions(action.options);
                client.respond(action, validator); 
            }),

            client.onRequest(A.GAME_START, action => {
               const validator = game.start();
               client.respond(action, validator);
            }),

            client.onRequest(A.GAME_SELECT_CARD, action => {
                if(!this.player) {
                    client.fail(action, "You are not in this game");
                    return;
                }
                const validator = this.player.selectCard(action.cardId);
                client.respond(action, validator);
            }),

            client.onRequest(A.GAME_SELECT_STACK, action => {
                if(!this.player) {
                    client.fail(action, "You are not in this game");
                    return;
                }
                const validator =  this.player.selectStack(action.stackId);
                client.respond(action, validator);
            })
        );

        if(client.isLoggedIn) {
            this.onLogin();
        }
    }

    onLogin() {
        this.player = this.game.addPlayer(this.client.id, this.client.name);
        this.onDispose(
            this.player.addClient(this.client),
            () => this.player.dispose()
        );
    }
}

module.exports = {
    GameHandlers
};