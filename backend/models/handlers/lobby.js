const A = require("../../shared/actions");
const { HandlerBase } = require("../../lib/handlers");
const { validateMessage } = require("../../shared/validation/chat");

class LobbyHandlers extends HandlerBase {
    constructor(client, lobby) {
        super(client);

        this.onDispose(lobby.addClient(client), client.onRequest(A.LOBBY_SEND_MESSAGE, action => {
            const validator = validateMessage(action.message);
            if(validator.didFail) {
                client.fail(action, validator.message);
                return;
            }

            lobby.sendMessage(client, action.message);
        }));
    }
}

module.exports = {
    LobbyHandlers
};