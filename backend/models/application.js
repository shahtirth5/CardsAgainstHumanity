const A = require("../shared/actions");
const Dispatcher = require("../shared/dispatcher");
const { RoomBase } = require("../lib/room");
const { Lobby } = require("./lobby");

class Application extends RoomBase {
    get view() {
        return {
            sets: this.cards.sets
        };
    }

    constructor(cards) {
        super(A.VIEW_APP);
        this.dispatcher = new Dispatcher();
        // this.dispatcher.on("*", (action) => {
        //     console.log(JSON.stringify(action, null, 2));
        // });
        this.cards = cards;
        this.lobby = new Lobby(this);
    }
}

module.exports = Application;