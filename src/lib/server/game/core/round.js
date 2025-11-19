import { usersCollection } from '../../db/db.js';
import { ObjectId } from "mongodb"
import { isSameCard } from "../sockets/handleChien.js"

export class RoundManager{
    constructor(pli, colorPli, playedAtouts){
        this.pli = pli
        this.colorPli = colorPli
        this.playedAtouts = playedAtouts
        this.playableCards = new Array()
    }

    setPlayableCards(card, hand){
        if (!this.colorPli) {
            if (card.value !== 0){
                this.colorPli = card.suit
                this.playableCards = hand.slice();
            }
            return  
        } 
        
        if (this.colorPli === "atout" && card.value !== 0) {
            let maxAtout = Math.max(...this.playedAtouts, 0);
            this.playableCards = hand.filter(c => c.suit === this.colorPli && c.value > maxAtout);
            if (this.playableCards.length === 0) {
                this.playableCards = hand.filter(c => c.suit === this.colorPli);
            }
            if (this.playableCards.length === 0) {
                this.playableCards = hand.slice();
            }
            return 
        }

        this.playableCards = hand.filter(c => c.suit === this.colorPli);
        if (this.playableCards.length === 0 && this.playedAtouts.length === 0) {
            this.playableCards = hand.filter(c => c.suit === "atout");
        }
        if (this.playableCards.length === 0 && this.playedAtouts.length !== 0) {
            let maxAtout = Math.max(...this.playedAtouts, 0);
            this.playableCards = hand.filter(c => c.suit === "atout" && c.value > maxAtout);
        }
        if (this.playableCards.length === 0) {
            this.playableCards = hand.filter(c => c.suit === "atout");
        }
        if (this.playableCards.length === 0) {
            this.playableCards = hand.slice();
        }
    }


    checkPlayableCard(card){
        if (this.playableCards.some(c => isSameCard(c, card)) || card.value === 0) {
            if (card.suit === "atout" && card.value !== 0) {
                this.playedAtouts.push(card.value);
            }
            return true;
        } 
        return false
    }

    getRoundWinner(){
        let winner = null
        let max = 0
        let color = this.colorPli
        let hasAtout = false
        
        this.pli.forEach((card, id) => {
            if (card.suit === "atout" && card.value !==0){
                color = "atout"
                if (!hasAtout){
                    hasAtout = true
                    max = card.value
                    winner = id
                } else if (card.value > max){
                    max = card.value
                    winner = id
                }
            } else if (card.suit === color && card.value > max){
                max = card.value
                winner = id
            }
        })
        
        return winner
    }

    updateCardsWon(cardsWon){
        this.pli.forEach(async(card, id) => {
            if (card.value !== 0 ){
                cardsWon.push(card)
            } else {
                const user = await usersCollection.findOne({_id : new ObjectId(id)})
                let cardsWon = user?.tarot.updateCardsWon
                cardsWon.push(card)
                await usersCollection.updateOne(
                    {_id : new ObjectId(id)},
                    {$set : {"tarot.cardsWon" : cardsWon}}
                )
            }
        })
        return cardsWon
    }

    restartRound(){
        console.log('restart round')
        this.pli.clear()
        this.playedAtouts = new Array()
        this.colorPli = undefined
    }
}