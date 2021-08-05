const _ = require("lodash");
const { shuffle } = require("../shared/utils");

const PLACEHOLDER_REGEX = /_/g;
function getWhiteCardCount(text) {
    const match = text.match(PLACEHOLDER_REGEX);
    if(!match) {
        return 1;
    }

    return match.length;
}

class CardDatabase {
    get sets() {
        return _.map(this._sets, set => ({id: set.id, name: set.name}))
    }
    
    constructor() {
        this._sets = {};
    }

    addsets(sets) {
        _.forOwn(sets, (set, setName) => this.addSet(setName, set));
    }

    addSet(setName, set) {
        this._sets[setName] = {
            id: setName,
            name: set.setName,
            blackCards: set.blackCards.map((card, index) => ({
                id: `b-${setName}-${index}`,
                text: card.text.replace(PLACEHOLDER_REGEX, "_____"),
                set: setName,
                whiteCardCount: getWhiteCardCount(card.text)
            })),
            whiteCards: set.whiteCards.map((card, index) => ({
                id: `w-${setName}-${index}`,
                text: card,
                set: setName,
            }))
        };
    }

    generateDecks(setIds = null) {
        const sets = setIds ? setIds.map(s => this._sets[s]) : _.values(this._sets);
        if(!sets.length) {
            throw new Error("Cannot create sets without any sets selected");
        }
        let whiteCards = _.flatMap(sets, s => s.whiteCards);
        whiteCards = shuffle(whiteCards);

        let blackCards = _.flatMap(sets, s => s.blackCards);
        blackCards = shuffle(blackCards);

        return new Deck(whiteCards, blackCards);
    }
}

class Deck {
    constructor(whiteCards, blackCards) {
        this._whiteDeck = whiteCards;
        this._blackDeck = blackCards;
        this._whiteDiscard = [];
        this._blackIndex = 0;
    }

    drawWhiteCards(count) {
        if(count >= this._whiteDeck.length) {
            if(count >= this._whiteDeck.length + this._whiteDiscard.length) {
                throw new Error(`Cannot Draw ${count} cards, since there aren't enough left`);
            }
            this._whiteDeck.push(...this._whiteDiscard);
            this._whiteDiscard = [];
            this._whiteDeck = shuffle(this._whiteDeck);
        }
        return this._whiteDeck.splice(0, count);
    }

    drawBlackCard() {
        if(this._blackIndex >= this._blackDeck.length) {
            this._blackDeck = shuffle(this._blackDeck);
            this._blackIndex = 0;
        }
        return this._blackDeck[this._blackIndex++];
    }

    discardWhiteCards(cards) {
        this._whiteDiscard.push(...cards);
    }
}

module.exports = {
    CardDatabase,
    Deck
};
