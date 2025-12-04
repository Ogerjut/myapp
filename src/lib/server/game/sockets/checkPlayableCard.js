import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';
import { Card } from '../core/cards.js';
import { RoundManager } from '../core/round.js';
import { isSameCard } from './handleChien.js';
import { emitUpdate } from './setBet.js';


export default async function checkPlayableCard(io, tableId, userId, card) {
	console.log("card is playable ? ", card)
    
    const table = await tarotCollection.findOne({_id : new ObjectId(tableId)})
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    let pli = new Map(Object.entries(table?.gameState.pli)) 
    let colorPli = table?.gameState.colorPli
    let playedAtouts = table?.gameState.playedAtouts
    let hand = user?.tarot.hand
    const playersId = table?.playersId


    const roundManager = new RoundManager(pli, colorPli, playedAtouts )
    roundManager.setPlayableCards(hand)
    const isPlayableCard = roundManager.checkPlayableCard(card)

    if (isPlayableCard) {
        endCheckPlayableCard(io, tableId, userId, hand, roundManager, card, playersId)
        console.log("playable card")
    }

}


export async function endCheckPlayableCard(io, tableId, userId, hand, roundManager, card, playersId ){
    if (hand.some(c => isSameCard(c, card))) {
        roundManager.setColorPli(card)
        roundManager.pli.set(userId, card)
        hand = hand.filter(c => !isSameCard(c, card))
    }

    await tarotCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.pli" : roundManager.pli,
                "gameState.colorPli" : roundManager.colorPli,
                "gameState.playedAtouts" : roundManager.playedAtouts
        }}
    )

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"tarot.hand" : hand, "tarot.hasPlayed" : true, "tarot.playedCard" : card}}
    )

    emitUpdate(io, tableId, playersId)
    
    // const updatedTable = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
    
    // playersId.forEach(async (playerId) => {
    //     const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
    //     io.to(playerId).emit("updateTarotContext", updatedUser, updatedTable)
    // });   

    io.to(userId).emit("isPlayableCard", new Card(card.value, card.suit))
    
}

  