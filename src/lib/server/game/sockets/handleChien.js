import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';
import { Deck } from '../core/cards.js';

export default async function handleChien(io, tableId, userId, card) {
    const table = await tarotCollection.findOne({_id : new ObjectId(tableId)})
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    let chien = table?.gameState.chien
    let newChien = user?.tarot.cardsWon
    let hand = user?.tarot.hand

    const maxcard = table?.size === 4 ? 6 : 3

    if (hand.some(c => isSameCard(c, card))) {
        if (newChien.length === maxcard || isForbidenCard(card) ) return
        newChien.push(card)
        hand = hand.filter(c => !isSameCard(c, card))
    } 
    else if (chien.some(c => isSameCard(c, card))) {
        hand.push(card)
        chien = chien.filter(c => !isSameCard(c, card))
    } 
    else if (newChien.some(c => isSameCard(c, card))) {
        hand.push(card)
        newChien = newChien.filter(c => !isSameCard(c, card))
    }

    Deck.sort(hand)

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"tarot.hand" : hand, "tarot.cardsWon" : newChien}}
    )

    await tarotCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.chien" : chien}}
    )
    
    const updatedTable = await tarotCollection.findOne({_id : new ObjectId(tableId)})
    const updtatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });

    io.to(userId).emit("updateTarotContext", updtatedUser, updatedTable)

}

export function isSameCard(a, b) {
    return a.value === b.value && a.suit === b.suit;
  }
  

function isForbidenCard(card){
    if (card.suit === "atout"){
        if (card.value === 0 || card.value === 1 || card.value === 21){
            return true 
        }
    } else if (card.value === 14){
        return true 
    }
    return false
}