import { usersCollection } from '../../../db/db.js';
import { ObjectId } from "mongodb"
import { isSameCard } from '../controllers/handleChien.js';

export class RoundManager{
    constructor(pli, colorPli, playedAtouts){
        this.pli = pli
        this.colorPli = colorPli
        this.playedAtouts = playedAtouts
        this.playableCards = new Array()
    }

    setColorPli(card){
        if (!this.colorPli){
            this.colorPli = card.suit
        }
    }

    setPlayableCards(hand){
        if (!this.colorPli) { 
            this.playableCards = hand.slice();
            return  
        } 
        
        if (this.colorPli === "atout") {
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

    getRoundWinner(plis, preneur){
        let winner = null
        let max = 0
        let color = this.colorPli
        let hasAtout = false
        
        if (plis.length === 17 && preneur.tarot.chelem) {
            console.log('check excuse jouée en dernier')
            const atouts = [];
            this.pli.forEach((card, id) => {
                if (card.suit === "atout") {
                    atouts.push({ id, card });
                }
            });

            if (atouts.length === 1 && atouts[0].card.value === 0) {
                console.log('excuse jouée en dernier gagne le pli')
                return atouts[0].id;
            }
        }
        
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

    updateCardsWon(cardsWon, preneurId){
        this.pli.forEach(async(card, id) => {
            if (card.value !== 0 ){
                cardsWon.push(card)
            } 
            else {
                if(id === preneurId){
                    cardsWon.push(card)
                    console.log("excuse ajoutée aux cartes du preneur")
                } else {
                    console.log(`excuse ajoutée aux cartes de ${id}`)
                    await usersCollection.updateOne(
                        {_id : new ObjectId(id)},
                        {$push : {"tarot.cardsWon" : card}}
                    )
                }
                
            }
        })
        return cardsWon
    }

    restartRound(){
        this.pli.clear()
        this.playedAtouts = new Array()
        this.colorPli = undefined
    }

}