import { Deck } from "./cards.js"
import { Player } from "./players.js"

export class LoadGame {
    constructor(table) {
        this.players = table.playersId.map(id => new Player(id))
        this.players[0].isSpeaker = true
        this.players[0].isPlayer = true 
        this.chien = this.dealCards()
        this.state = "bet"
    
    }

    dealCards() {
        const deck = new Deck().shuffle();
        const nbCardsChien = this.players.length === 2 ? 6 : 3;
    
        while (deck.length > nbCardsChien) {
            this.players.forEach(player => {
                player.hand.push(...deck.splice(0, 3));
                Deck.sort(player.hand);
            });
        }
    
        return deck;
    }
    
    
}