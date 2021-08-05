import {Observable} from "rxjs";
import {merge} from "rxjs";
import * as A from "../shared/actions";
import {makeDiff, IS_UNCHANGED, mergeDiff} from "../shared/diff";
import {filter, publishReplay, scan, startWith, map} from "rxjs/operators";

export function createView$(dispatcher, viewType, defaultView) {
    const mergeView$ = dispatcher
        .on$(A.MERGE_VIEW)
        .pipe(
            filter(a => a.view == viewType)
        )
        .pipe(
            map(action => {
                return (view) => {
                    return mergeDiff(view, action.diff);
                };
            })
        );

    const reconnect$ = dispatcher
        .on$(A.APP_CONNECTION_RECONNECTED)
        .pipe(
            map(() => {
                return () => {
                    return defaultView;
                };
            })
        );

    const view$ = merge(mergeView$, reconnect$)
        .pipe(
            scan((view, op) => op(view), {})
        )
        .pipe(
            startWith(defaultView)
        )
        .pipe(
            publishReplay(1)
        );
    view$.connect();

    return view$;
}