import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';
import handleChien from './handleChien.js';
import registerChien from './registerChien.js';


export default async function selectRandomChien(io, tableId, userId) {
    console.log("select random chien")
    const user = await usersCollection.findOne({_id : new ObjectId(userId)})
    const table = await tarotCollection.findOne({ _id: new ObjectId(tableId)});

    let actualChien = table?.gameState.chien
    let sizeChien = table?.size === 4 ? 6 : 3
    let missingCardsChien =  sizeChien - actualChien.length
    user?.tarot.cardsWon.push(...actualChien)
    let hand = user?.tarot.hand
    console.log("hand", hand)

    while (missingCardsChien > 0){
        console.log("enter while loop", missingCardsChien)
        missingCardsChien--
        let validCards = hand.filter(c => c.value < 14 && c.suit != "atout")
        console.log(validCards)
        let n = Math.floor(Math.random()*validCards.length)
        let card = validCards[n]
        console.log("randoome choosen card:", card, n)
        hand = hand.filter(c => !(c.value === card.value && c.suit === card.suit))
        handleChien(io, tableId, userId, card)
    }
    registerChien(io, tableId)
    
}

  