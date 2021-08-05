const _ = require("lodash");
const A = require("../shared/actions");
const { RoomBase } = require("../lib/room");
const { Game } = require("./game");

class Lobby extends RoomBase {
    get view() {
        return {
            messages: this.messages.slice(),
            games: this.games.map(game => game.summary)
        }
    }

    constructor(app) {
        super(A.VIEW_LOBBY);
        this.messages = [];
        this.games = [];
        this.app = app;

        this._nextGameId = 1;

        app.dispatcher.on({
            [A.GAME_DISPOSED]: ({gameId}) => this.removeGame(gameId),
            [A.GAME_SUMMARY_CHANGED]: () => this._tick()
        });
    }

    sendMessage(client, message) {
        if(!client.isLoggedIn) {
            throw new Error("Clent must be logged in");
        }
        this._tick(() => {
            this.messages.push({
                index: this.messages.length + 1,
                name: client.name,
                message
            });
        });
    }

    createGame(title) {
        const game = new Game(this._nextGameId++, title, this.app);
        this._tick(() => this.games.push(game));
        return game;
    }

    removeGame(gameId) {
        this._tick(() => _.remove(this.games, {id: gameId}));
    }

    getGameById(gameId) {
        return _.find(this.games, {id: gameId});
    }
}

module.exports = {
    Lobby
};