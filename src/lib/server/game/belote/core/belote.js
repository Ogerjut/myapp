import { Deck } from "./cards.js"
import { Player } from "./player.js"
import RoundManager from "./round.js";

export class Belote{
    constructor(table){
        this.table = table || null;
        this.round = table?.gameState.round || null;
        this.playersId = table?.playersId || new Array();
        // this.currentPlayerId =  table?.gameState.currentPlayerId || null;
        this.state = table?.state || "";
        this.stack = table?.gameState.stack || new Array();
        this.potentialAtout = table?.gameState.potentialAtout || null;
        this.deck = table?.gameState.deck || new Array();
        this.players = new Array()
        this.currentPlayer = null

        this.roundManager = new RoundManager(table.gameState)
    }

    loadPlayers(players){
       this.players = players.map(p => new Player(p.id, p.hand, p.bet, p.hasPlayed, p.hasBet, p.hasTaken, p.cardsWon, p.isSpeaker))
    }


    loadGame(){
        if (!this.round){
            this.round = 1
        } else {
            this.round += 1
        }
        this.players = this.playersId.map(p => new Player(p))
        this.currentPlayer = this.players[(this.round-1) % this.players.length]
        this.state = "bet"
        this.currentPlayer.isSpeaker = true
        this.stack = this.getHand()
        console.log("stack :", this.stack.length)
        
    }

    getHand() {
        this.deck = new Deck().shuffle();
        this.potentialAtout = this.deck.shift();
    
        this.players.forEach(player => {
            player.hand = this.deck.splice(0, 5);
            Deck.sort(player.hand);
        });
    
        return this.deck;
    }

    endDealCard(){
        while (this.stack.length > 0) {
            this.players.forEach(player => {
                player.hasTaken ? player.hand.push(...this.stack.splice(0, 2)) : player.hand.push(...this.stack.splice(0, 3));
                Deck.sort(player.hand);
            });
        }
    }


    startGame(){
        // ajouter carte atouts a main preneur 
        // finir distribution stack
        // définir couleur atout      
        // si bet = 1 && suit, définir couleur atout en fonction suit et non potentialAtout 


    }
}