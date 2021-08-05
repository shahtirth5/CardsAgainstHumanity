const _ = require("lodash");
const A = require("../shared/actions");
const { makeDiff, IS_UNCHANGED } = require("../shared/diff");

class RoomBase {
    get view() {
        throw new Error("Please Implement A View");
    }

    constructor(viewId) {
        this._id = undefined;
        this._viewId = viewId;
        this._inTick = false;
        this._lastView = {};
        this.clients = [];
    }

    addClient(client) {
        this.clients.push(client);
        client.emit(A.setView(this._viewId, this.view, this.id));
        return () => _.remove(this.clients, { id: client.id });
    }

    broadcast(action) {
        for (let client of this.clients) {
            client.emit(action);
        }
    }

    _tick(action) {
        if (this._inTick) {
            if (action) {
                action();
            }
            return null;
        }

        this._inTick = true;
        try {
            if (action) {
                action();
            }
        } finally {
            this._inTick = false;
        }

        this._postTick();
        const newView = this.view;
        const diff = makeDiff(this._lastView, newView);

        if (diff != IS_UNCHANGED)
            this.broadcast(A.mergeView(this._viewId, diff, this.id));

        this._lastView = newView;
        return diff;
    }

    _postTick() {

    }
}

module.exports = {
    RoomBase
};