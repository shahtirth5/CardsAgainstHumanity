import "./player-hand.css";

import React from "react";
import Card from "./card";

export default function PlayerHand(props) {
    const {hand, opSelectCard, selectCard, toggle, isOpen} = props;
    const caretClass = isOpen ? "fa-caret-down" : "fa-caret-up";
    return (
        <div className={`c-player-hand ${isOpen ? "is-open" : "is-closed"}`}>
            <div onClick={toggle} style={{cursor: "pointer"}} className="c-toggle-button text-center alert alert-secondary p-0 w-100">
                <i className={`fa ${caretClass}`}/>
                {opSelectCard.error}
                <small className="m-2"> Toggle Cards</small>
            </div>
            <div className="cards row">
                {
                    hand.map(card =>
                        <div className="col-1 m-4" key={card.id}>
                            <Card
                                isSelectable={opSelectCard.can && !opSelectCard.inProgress}
                                onClick={() => { console.log("CLICKED CARD"); selectCard(card);}}
                                type="white"
                                card={card}
                                style="small"
                                canZoom
                            />
                        </div>
                    )
                }
            </div>
        </div>
    );
}