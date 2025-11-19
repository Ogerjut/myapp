

export class Card{
    constructor(value, suit){
        this.value = value
        this.suit = suit
    }
}

export class Deck {
    static suitsOrder = ["spade", "diamond", "club", "heart", "atout"];

    static sort(hand) {
        return hand.sort((a, b) => {
            // trier par couleur d'abord
            const suitDiff = Deck.suitsOrder.indexOf(a.suit) - Deck.suitsOrder.indexOf(b.suit);
            if (suitDiff !== 0) return suitDiff;

            // trier par valeur ensuite (du plus fort au plus faible)
            return b.value - a.value;
        });
    }

    constructor() {
        this.suits = ["diamond", "heart", "club", "spade"];
        this.values = Array.from({ length: 14 }, (_, i) => i + 1);
        this.valuesAtout = Array.from({ length: 22 }, (_, i) => i);
        this.deck = this.#create();
    }

    #create() {
        const deck = [];
        this.suits.forEach(suit => {
            this.values.forEach(value => deck.push(new Card(value, suit)));
        });
        this.valuesAtout.forEach(value => deck.push(new Card(value, "atout")));
        return deck;
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        return this.deck;
    }
}



