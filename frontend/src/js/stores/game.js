import _ from "lodash";
import * as A from "../shared/actions";
import { Observable, BehaviorSubject } from "rxjs";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { mapOp$ } from "../shared/observable";
import { createView$ } from "../lib/stores";

const defaultView = {
    id: null,
    title: null,
    step: A.STEP_DISPOSED,
    options: {
        // scoreLimit: 5,
        // sets: ["1ed"]
    },
    players: [
        // {id: 1, name: "Nelson", score: 5, isCzar: false, isPlaying: true, isWinner: false},
        // {id: 2, name: "Obama", score: 3, isCzar: false, isPlaying: true, isWinner: false},
        // {id: 3, name: "Gandhi", score: 2, isCzar: true, isPlaying: false, isWinner: false},
        // {id: 4, name: "Trump", score: 1, isCzar: false, isPlaying: false, isWinner: false},
    ],
    messages: [
        // {index: 1, name: "Nelson", message: "Hey"},
        // {index: 2, name: "Obama", message: "Hey"},
        // {index: 3, name: "Gandhi", message: "Hey"},
        // {index: 4, name: "Trump", message: "Hey"},
    ],
    // round: {
    //     blackCard: {
    //         id: 1,
    //         text: "Does Something do something?",
    //         set: "1ed",
    //         whiteCardCount: 3
    //     },
    //     stacks: [
    //         {id: 1, cards: [{id: 1, text: "hey there", set:"whoa"}] },
    //         {id: 2, cards: [{id: 2, text: "Stuff", set:"whoa"}] },
    //         {id: 3, cards: [{id: 3, text: "Things", set:"whoa"}] }
    //     ]
    // },
    round: null,
    timer: null
};

const defaultPlayerView = {
    id: null,
    // hand: [
    //     {id: 2, text: "Card 1", set: "1ed"},
    //     {id: 3, text: "Card 2", set: "1ed"},
    //     {id: 4, text: "Card 3", set: "1ed"},
    //     {id: 5, text: "Card 4", set: "1ed"},
    //     {id: 7, text: "Card 6", set: "1ed"},
    //     {id: 8, text: "Card 7", set: "1ed"},
    //     {id: 9, text: "Card 7", set: "1ed"},
    //     {id: 10, text: "Card 7", set: "1ed"}
    // ],
    hand: [],
    // stack: {
    //     id: 2,
    //     cards: [
    //         {id: 6, text: "Card 5", set: "1ed"},
    //     ]
    // }
    stack: null
};

export default class GameStore {
    constructor({ dispatcher, socket }, user) {
        const passThroughAction = action => socket.emit("action", action); 
        dispatcher.onRequest({
            [A.GAME_CREATE]: passThroughAction,
            [A.GAME_JOIN]: passThroughAction,
            [A.GAME_SET_OPTIONS]: passThroughAction,
            [A.GAME_START]: passThroughAction,
            [A.GAME_SELECT_CARD]: passThroughAction,
            [A.GAME_SELECT_STACK]: passThroughAction,
            [A.GAME_SEND_MESSAGE]: passThroughAction
        });

        this.view$ = createView$(dispatcher, A.VIEW_GAME, defaultView);
        this.player$ = createView$(dispatcher, A.VIEW_PLAYER, defaultPlayerView);

        const isLoggedIn$ = user.details$.pipe(map(d => d.isLoggedIn));
        this.opCreateGame$ = mapOp$(
            dispatcher.on$(A.GAME_CREATE),
            isLoggedIn$
        );

        this.opJoinGame$ = mapOp$(
            dispatcher.on$(A.GAME_JOIN)
        );

        this.opSetOptions$ = mapOp$(
            dispatcher.on$(A.GAME_SET_OPTIONS),
            isLoggedIn$
        );

        this.opStart$ = mapOp$(
            dispatcher.on$(A.GAME_START),
            isLoggedIn$
        );

        const playerAndGame$ = combineLatest([this.view$, this.player$]);

        this.opSelectCard$ = mapOp$(
            dispatcher.on$(A.GAME_SELECT_CARD),
            playerAndGame$.pipe(
                map(([game, player]) => {
                    const ourPlayer = _.find(game.players, { id: player.id });
                    return ourPlayer && game.step === A.STEP_CHOOSE_WHITES && ourPlayer.isPlaying;
                })
            )
        );

        this.opSelectStack$ = mapOp$(
            dispatcher.on$(A.GAME_SELECT_STACK),
            playerAndGame$.pipe(map(([game, player]) => {
                const ourPlayer = _.find(game.players, { id: player.id });
                return ourPlayer && game.step === A.STEP_JUDGE_STACKS && ourPlayer.isCzar;
            })
            )
        );

        this.opSendMessage$ = mapOp$(
            dispatcher.on$(A.GAME_SEND_MESSAGE),
            isLoggedIn$
        );
    }
}