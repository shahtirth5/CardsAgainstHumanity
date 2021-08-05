import {Observable, pipe} from "rxjs";
import * as A from "./actions";
import {publishReplay, map, startWith, combineLatest} from "rxjs/operators";
import {of} from "rxjs";

export function mapOp$(op$, can$ = of(true)) {
    const operation$ = op$
        .pipe(
            startWith({})
        )
        .pipe(
            combineLatest(can$)
        )
        .pipe(
            map(([action, can]) => {
                if (!action.hasOwnProperty("status"))
                    return {can, inProgress: false, failed: false};
                if (action.status == A.STATUS_REQUEST)
                    return {can, inProgress: true, failed: false};
                if (action.status == A.STATUS_FAIL)
                    return {can, inProgress: false, failed: true, error: action.error};
                return {can, inProgress: false, failed: false};
            })
        )
        .pipe(
            publishReplay(1)
        );

    operation$.connect();
    return operation$;
}