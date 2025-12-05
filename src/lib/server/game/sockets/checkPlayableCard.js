import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../db/db.js';
import { Card } from '../core/cards.js';
import { RoundManager } from '../core/round.js';
import { isSameCard } from './handleChien.js';
import { areHandsEmpties } from './handlePlayableCard.js';
import { emitUpdate } from './setBet.js';
import { getUserHasTaken } from '../../db/tarot/utils.js'
import { getTableById } from '../../db/utils.js';
import { ScoreManager } from '../core/score.js';
import gameOver from './gameOver.js';
import checkStartBet from './startBet.js';


export default async function checkPlayableCard(io, tableId, userId, card) {
	
    const table = await tablesCollection.findOne({_id : new ObjectId(tableId)})
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    console.log(card, "played by :", user?.username)
    
    let pli = new Map(Object.entries(table?.gameState.pli)) 
    let colorPli = table?.gameState.colorPli
    let playedAtouts = table?.gameState.playedAtouts
    let hand = user?.tarot.hand
    const playersId = table?.playersId

    const roundManager = new RoundManager(pli, colorPli, playedAtouts )
    roundManager.setPlayableCards(hand)
    const isPlayableCard = roundManager.checkPlayableCard(card)

    // if (isPlayableCard) {
        // playCard(io, tableId, userId, hand, roundManager, card, playersId, isPlayableCard)
    //     console.log("playable card")
    //     playSelectedCard()
    // }
    // io.to(userId).emit("isPlayableCard", isPlayableCard, card)

    if (!isPlayableCard) {
        console.log("selected card not playable, return")
        return
    } 

    console.log("selected Card is playable")
    await playCard(io, tableId, userId, hand, roundManager, card, playersId)

}


export async function playCard(io, tableId, userId, hand, roundManager, card, playersId ){
    
    if (hand.some(c => isSameCard(c, card))) {
        roundManager.setColorPli(card)
        roundManager.pli.set(userId, card)
        hand = hand.filter(c => !isSameCard(c, card))
    }

    await tablesCollection.updateOne(
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

    const updatedTable = await tablesCollection.findOne({_id : new ObjectId(tableId)})
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });

    io.to(tableId).emit("updateTable", updatedTable)
    io.to(userId).emit("updateUser", updatedUser)
    
    console.log("selected card managed")
    await new Promise((r) => setTimeout(r, 1000));
    

    let pli = new Map(Object.entries(updatedTable?.gameState.pli)) 

    const isEndRound = await areHandsEmpties(playersId)
    const isEndPli = pli.size === playersId.length
    const turnState = isEndRound ? "endRound" 
                    : isEndPli ? "endPli" 
                    : "nextPlayer"
    
    console.log("is end round / is end turn", isEndRound, isEndPli)
    console.log("turnState", turnState)

    switch(turnState){
        case "endRound" : 
            await  handleEndRound(io, tableId)
            break
        case "endPli" : 
            await handleEndPli(tableId, roundManager)
            break
        case "nextPlayer" :
            await nextPlayer(tableId, userId, roundManager, playersId)
            break
        default : console.log("error in turn state")
    }

    await emitUpdate(io, tableId, playersId)
    
    // const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    
    // playersId.forEach(async (playerId) => {
    //     const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
    //     io.to(playerId).emit("updateTarotContext", updatedUser, updatedTable)
    // });   

    // io.to(userId).emit("isPlayableCard", isPlayableCard, new Card(card.value, card.suit))
    
}

async function handleEndPli(tableId, roundManager){
    console.log("handle end pli")
    const table = await tablesCollection.findOne({_id : new ObjectId(tableId)})
    const playersId = table?.playersId
    let pli = new Map(Object.entries(table?.gameState.pli))
    let plis = table?.gameState.plis

    let pliObject = Object.fromEntries(pli)
    
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$push : {"gameState.plis" : pliObject}}
    )
    
    for (const playerId of playersId) {
        await usersCollection.updateOne(
            {_id : new ObjectId(playerId)},
            {$set : {"tarot.hasPlayed" : false, "tarot.playedCard" : undefined, "tarot.isCurrentPlayer": false}}
        )
    }; 

    const preneur = await getUserHasTaken(tableId)
    const winnerId = roundManager.getRoundWinner(plis, preneur)
    const winner = await usersCollection.findOne({ _id: new ObjectId(winnerId)})
    let cardsWon = roundManager.updateCardsWon(winner?.tarot.cardsWon, preneur?._id.toString() )
    console.log("winner pli : ", winner?.username, cardsWon.length)
    await usersCollection.updateOne(
        {_id : new ObjectId(winnerId)},
        {$set : {"tarot.cardsWon" : cardsWon, "tarot.isCurrentPlayer" : true}}
    )
    
    roundManager.restartRound()
    console.log('restart round')
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.currentPlayerId" : winnerId,
                "gameState.pli" : roundManager.pli,
                "gameState.colorPli" : roundManager.colorPli,
                "gameState.playedAtouts" : roundManager.playedAtouts
        }}
    )
    


}

async function handleEndRound(io, tableId){
    console.log("end round")
    const preneur = await getUserHasTaken(tableId)
    const table = await getTableById(tableId)
    const playersId = table?.playersId
    const roundMax = table?.roundMax
    let round = table?.gameState.round

    const scoreManager = new ScoreManager(table, preneur)
    scoreManager.compute()
    console.log("point preneur", scoreManager.score)
    const {contrat, hasWin, preneurScore, defScore} = scoreManager.getMarque()
    console.log("preneurScore / hasWin", preneurScore, hasWin)
    for (const playerId of playersId) {
        const player = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        let score = player?.score.tarot
        if (player?.tarot.hasTaken){
            score += preneurScore
            await usersCollection.updateOne(
                {_id : new ObjectId(playerId)},
                {$set : {"score.tarot"  : score, "tarot.cardsWon" : new Array(), "tarot.hasWin" : hasWin, "tarot.contrat" : contrat}}
            )
        } else {
            score += defScore
            await usersCollection.updateOne(
                {_id : new ObjectId(playerId)},
                {$set : {"score.tarot" : score, "tarot.cardsWon" : new Array()}}
            )
        }
    
    };

    round++
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.round" : round}}
    )
    // faire un nouvel état de la table (scoreRound), la mettre a jour avec updtateContext, et après 10s renvoie event pour checkstartbet
    // montrer classement, nbBout, bonus poignees chelem contrat..
    
    if (round >= roundMax){
        await gameOver(io, tableId)
    } else {
        await checkStartBet(io, tableId)
    }

}

async function nextPlayer(tableId, userId, roundManager, playersId){
    console.log("next player to play ")
    const ind = playersId.indexOf(userId)
    const newPlayerId = playersId[((ind+1) % playersId.length)] 
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.currentPlayerId" : newPlayerId,
                "gameState.pli" : roundManager.pli,
                "gameState.colorPli" : roundManager.colorPli,
                "gameState.playedAtouts" : roundManager.playedAtouts
        }}
    )
    const user = await usersCollection.findOne({_id : new ObjectId(newPlayerId)})
    console.log("next user :", user?.username)
    // await usersCollection.updateOne(
    //     {_id : new ObjectId(newPlayerId)},
    //     {$set : {"tarot.isCurrentPlayer" : true}}
    // )
}

  