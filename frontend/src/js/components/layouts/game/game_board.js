import React from "react";
import {ContainerBase} from "../../../lib/component";
import * as A from "../../../shared/actions";

import Card from "./card";
import PlayerHand from "./player-hand";
import Stacks from "./stacks";

const TIMER_REASONS = {
    [A.WAIT_GAME_OVER]: "Game Over",
    [A.WAIT_REASON_GAME_FINISHED]: "It Ended",
    [A.WAIT_REASON_TOO_FEW_PLAYERS]: "There Are Too Few Players",

    [A.WAIT_ROUND_OVER]: "Round Over",
    [A.WAIT_REASON_CZAR_LEFT]: "Czar Left",
    [A.WAIT_REASON_ROUND_FINISHED]: "It Ended"
};

export default class GameBoard extends ContainerBase {
    constructor(props) {
        super(props);
        this.state = {isHandOpen: false};

        this._selectCard = card => this.request(A.gameSelectCard(this.state.game.id, card.id));
        this._selectStack = stack => this.request(A.gameSelectStack(this.state.game.id, stack.id));
        this._toggleHand = () => this.setState({isHandOpen: !this.state.isHandOpen});
    }

    componentWillMount() {
        const {stores: {game}} = this.context;
        this.subscribe(game.view$, game => this.setState({game}));
        this.subscribe(game.player$, player => this.setState({player}));
        this.subscribe(game.opSelectCard$, opSelectCard => this.setState({opSelectCard, isHandOpen: opSelectCard.can}));
        this.subscribe(game.opSelectStack$, opSelectStack => this.setState({opSelectStack}));
    }

    render() {
        const {game, player, opSelectCard, opSelectStack} = this.state;
        const round = game.round;
        const timer = game.timer || {};
        if (!round) {
            return null;
        }

        let message = null;
        let messageIsActive = false;

        switch (game.step) {
            case A.STEP_CHOOSE_WHITES:
                messageIsActive = opSelectCard.can;
                message = opSelectCard.can ? "Choose Your Cards !" : "Waiting for other players...";
                break;

            case A.STEP_JUDGE_STACKS:
                messageIsActive = opSelectStack.can;
                message = opSelectStack.can ? "Select The Winning Cards!" : "Waiting For The Czar...";
                break;

            case A.STEP_WAIT:
                message = `${TIMER_REASONS[timer.type]}, ${TIMER_REASONS[timer.reason]}`;
                break;

        }

        const ourStackId = game.step == A.STEP_CHOOSE_WHITES && player && player.stack && player.stack.id;

        const stacks = ourStackId
            ? round.stacks.map(s => s.id == ourStackId ? player.stack : s)
            : round.stacks;
        return (
            <section id="game-board" style={{position: "relative"}}>
                <div>
                    <Card type="black" card={round.blackCard}/>
                    <div className="alert alert-info text-center p-1 m-1">{message}</div>
                </div>
                <Stacks
                    stacks={stacks}
                    ourStackId={ourStackId}
                    opSelectStack={opSelectStack}
                    selectStack={this._selectStack}
                />
                <PlayerHand
                     opSelectCard={opSelectCard}
                     selectCard={this._selectCard}
                     hand={player.hand}
                     toggle={this._toggleHand}
                     isOpen={this.state.isHandOpen}
                />
            </section>
        );
    }
}