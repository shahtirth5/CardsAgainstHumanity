import _ from "lodash";
import * as A from "../shared/actions";
import {publish, publishReplay, scan, startWith} from "rxjs/operators";
import {BehaviorSubject, Observable} from "rxjs";
import {createView$} from "../lib/stores";

const defaultView = {
    sets: [
        // {id: "1ed", name: "1st Edition"},
        // {id: "2ed", name: "2st Edition"},
        // {id: "3ed", name: "3st Edition"},
        // {id: "lol", name: "Other stuff"}
    ]
};

export default class AppStore {
    constructor({dispatcher, socket}) {
        this.view$ = new createView$(dispatcher, A.VIEW_APP, defaultView);

        this.dialog$ = dispatcher
            .on$(A.DIALOG_SET)
            .pipe(
                scan((stack, action) => {
                    _.remove(stack, {id: action.id});
                    if (action.isOpen) {
                        stack.push({id: action.id, props: action.props});
                    }
                    return stack;
                }, [])
            )
            .pipe(
                startWith([])
            )
            .pipe(
                publishReplay(1)
            );
        this.dialog$.connect();
        
        socket.on("connect", () => dispatcher.emit(A.appConnectionSet(A.CONNECTION_CONNECTED)));
        socket.on("reconnecting", () => dispatcher.emit(A.appConnectionSet(A.CONNECTION_RECONNECTING)));
        socket.on("disconnect", () => dispatcher.emit(A.appConnectionSet(A.CONNECTION_DISCONNECTED)));
        socket.on("reconnect", () => dispatcher.emit(A.appConnectionReconnected()));
        // this.connection$ = new BehaviorSubject(A.CONNECTION_CONNECTED);
        this.connection$ = dispatcher
            .on$(A.APP_CONNECTION_SET)
            .pipe(
                startWith(socket.connected ? A.CONNECTION_CONNECTED : A.CONNECTION_DISCONNECTED)
            )
            .pipe(
                publishReplay(1)
            );
        this.connection$.connect();
        this.reconnected$ = dispatcher
            .on$(A.APP_CONNECTION_RECONNECTED)
            .pipe(
                publish()
            );
        this.reconnected$.connect();
    }
}