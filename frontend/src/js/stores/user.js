import * as A from "../shared/actions";
import {BehaviorSubject} from "rxjs";
import {map, publishReplay, startWith} from "rxjs/operators";
import {validateUsername} from "../shared/validation/user";
import {mapOp$} from "../shared/observable";

const defaultDetails = {
    isLoggedIn: false,
    id: null,
    name: null
};

export default class UserStore {
    constructor({dispatcher, socket}) {
        // this.details$ = new BehaviorSubject((defaultDetails));

        this.details$ = dispatcher.on$(A.USER_DETAILS_SET)
            .pipe(
                map(a => a.details)
            )
            .pipe(
                startWith(defaultDetails)
            )
            .pipe(
                publishReplay(1)
            );
        this.details$.connect();

        this.details$.subscribe(details => {
            Object.keys(details).forEach(i => this[i] = details[i]);
        });


        dispatcher.onRequest({
            [A.USER_LOGIN]: (action) => {
                const validator = validateUsername(action.name);
                if (validator.didFail) {
                    dispatcher.fail(action, validator.message);
                    return;
                }
                // dispatcher.succeed(action);
                // this.details$.next({
                //     isLoggedIn: true,
                //     id: 1,
                //     name: action.name
                // });

                socket.emit("action", action);
            }
        });

        this.opLogin$ = mapOp$(
            dispatcher.on$(A.USER_LOGIN),
            this.details$.pipe(map(details => !details.isLoggedIn))
        );
    }

}