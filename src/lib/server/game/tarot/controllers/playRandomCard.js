import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../../db/db.js';
import { RoundManager } from '../core/round.js';
import { playCard } from './checkPlayableCard.js';


export default async function playRandomCard(io, tableId, userId) {
    const user = await usersCollection.findOne({_id : new ObjectId(userId)})
    console.log("select random card", user?.username)
    const table = await tablesCollection.findOne({ _id: new ObjectId(tableId)})
    let pli = new Map(Object.entries(table?.gameState.pli)) 
    let colorPli = table?.gameState.colorPli
    let playedAtouts = table?.gameState.playedAtouts
    let hand = user?.tarot.hand
    const playersId = table?.playersId

    const roundManager = new RoundManager(pli, colorPli, playedAtouts)

    const handForRandomCard = pli.size === 0 ? hand.filter(card => card.value < 13 && card.suit != "atout") : hand.filter(card => card.suit === colorPli)
    
    roundManager.setPlayableCards(handForRandomCard.length != 0 ? handForRandomCard : hand)
    const playableCards = roundManager.playableCards

    let n = Math.floor(Math.random()*playableCards.length)
    const card = playableCards[n]
    console.log("random card chosen : ", card)
    playCard(io, tableId, userId, hand, roundManager, card, playersId)
    

}

  