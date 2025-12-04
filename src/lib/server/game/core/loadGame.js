import { Deck, DECK_CHELEM, DECK_CHELEM_PETIT_AU_BOUT, DECK_PETIT_AU_BOUT } from "./cards.js"
import { Player } from "./players.js"

export class LoadGame {
    constructor(table, round) {
        this.players = table.playersId.map(id => new Player(id))
        this.round = round
        this.chien = this.dealCards()
        this.setFirstPlayer()
        this.currentPlayer = this.getCurrentPlayer()
        this.state = "bet"
    
    }

    dealCards() {
        const nbCardsChien = this.players.length === 4 ? 6 : 3;
    
        while (true) {
            // const deck = new Deck().shuffle();
            const deck = [...DECK_PETIT_AU_BOUT]
            while (deck.length > nbCardsChien) {
                this.players.forEach(player => {
                    player.hand.push(...deck.splice(0, 3));
                    Deck.sort(player.hand);
                });
            }
            if (!this.cancelDeal()) {
                return deck;
            }
    
           
        }
    }
    
    setFirstPlayer(){
        this.players[(this.round-1) % this.players.length].isSpeaker = true
        
    }

    getCurrentPlayer(){
        return this.players[(this.round-1) % this.players.length] 
    }
    
    cancelDeal(){
        this.players.some(player => {
            const atouts = player.hand.filter(c => c.suit === "atout")
            return atouts.length === 1 && atouts[0].value === 1
        })
    }
}

