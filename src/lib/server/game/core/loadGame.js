import { Deck } from "./cards.js"
import { Player } from "./players.js"

export class LoadGame {
    constructor(table, round) {
        this.players = table.playersId.map(id => new Player(id))
        this.round = round
        this.chien = this.dealCards()
        this.setFirstPlayer()
        this.state = "bet"
    
    }

    dealCards() {
        const deck = new Deck().shuffle();
        const nbCardsChien = this.players.length === 4 ? 6 : 3;
    
        while (deck.length > nbCardsChien) {
            this.players.forEach(player => {
                player.hand.push(...deck.splice(0, 3));
                Deck.sort(player.hand);
            });
        }
    
        return deck;
    }
    
    setFirstPlayer(){
        this.players[(this.round-1) % this.players.length].isSpeaker = true
        this.players[(this.round-1) % this.players.length].isPlayer = true 
    }
    
}