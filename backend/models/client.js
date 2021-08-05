const A = require("../shared/actions");
const Dispatcher = require("../shared/dispatcher");
const { validateUsername } = require("../shared/validation/user");
const { LobbyHandlers } = require("../models/handlers/lobby");
const { GameHandlers } = require("../models/handlers/game");
const { Game } = require("./game");

class Client extends Dispatcher {
    get details() {
        return {
            id: this.id,
            isLoggedIn: this.isLoggedIn,
            name: this.name
        };
    }

    constructor(socket, app) {
        super();
        this.id = socket.id;
        this.isLoggedIn = false;
        this.name = null;
        this.app = app;
        this.handlers = null;

        this._socket = socket;
        this._onDisposes = [];

        this._onDisposes.push(app.addClient(this));
        this.emit(A.userDetailsSet(this.details));

        socket.on("action", action => {
            console.log(action);
            super.emit(action);
        });
        socket.on("disconnect", () => {
            this.dispose();
        });

        this._installHandlers();
    }

    emit(action) {
        this._socket.emit("action", action);
    }

    login(name) {
        const validator = validateUsername(name);
        
        if (validator.didFail) {
            return validator;
        }

        this.isLoggedIn = true;
        this.name = name;
        this.emit(A.userDetailsSet(this.details));

        if (this.handlers) {
            this.handlers.onLogin();
        }

        return validator;
    }

    setHandlers(handlers) {
        if (this.handlers) {
            this.handlers.dispose();
        }

        this.handlers = handlers;
    }

    dispose() {
        if (this.handlers) {
            this.handlers.dispose();
            this.handlers = null;
        }
        this._onDisposes.forEach(a => a());
        this._onDisposes = [];
    }

    _installHandlers() {
        this.onRequest({
            [A.USER_LOGIN]: (action) => {
                const validator = this.login(action.name);
                this.respond(action, validator);
            },
            [A.LOBBY_JOIN]: (action) => {
                const { lobby } = this.app;
                if (this.handlers instanceof LobbyHandlers) {
                    this.succeed(action);
                    return;
                }
                this.setHandlers(new LobbyHandlers(this, lobby));
                this.succeed(action);
            },
            [A.GAME_CREATE]: (action) => {
                if(!this.isLoggedIn) {
                    this.fail(action, "You must be logged in");
                    return;
                }
                let game;
                try {
                    const {lobby} = this.app;
                    game = lobby.createGame(`${this.name}'s game`);
                    this.setHandlers(new GameHandlers(this, game));
                    this.succeed(action);
                    this.succeed(A.gameJoin(game.id));
                } catch(e) {
                    if(game) {
                        game.dispose();
                    }
                    this.fail(action);
                    throw e;
                }
            },
            [A.GAME_JOIN]: (action) => {
                if(this.handlers instanceof GameHandlers && this.handlers.game.id == action.gameId) {
                    this.succeed(action);
                    return;
                }
                
                const {lobby} = this.app;
                const game = lobby.getGameById(action.gameId);
                if(!game) {
                    this.fail(action, "Invalid Game");
                    return;
                }

                this.setHandlers(new GameHandlers(this, game));
                this.succeed(action);
            }
        })
    }
}

module.exports = Client;