import { getUserHasTaken } from '../../db/tarot/utils.js'
import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';
import { RoundManager } from '../core/round.js';
import { ScoreManager } from '../core/score.js';
import gameOver from './gameOver.js';
import checkStartBet from './startBet.js';
import { getTableById } from '../../db/utils.js';

export default async function handlePlayableCard(io, tableId, userId, card) {
    const table = await tarotCollection.findOne({_id : new ObjectId(tableId)})
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    const playersId = table?.playersId
    let pli = new Map(Object.entries(table?.gameState.pli)) 
    let colorPli = table?.gameState.colorPli
    let playedAtouts = table?.gameState.playedAtouts
    const roundMax = table?.roundMax
    let round = table?.gameState.round
    let plis = table?.gameState.plis

    // console.log("pli, colorPli :", pli, "\n",colorPli)

    const roundManager = new RoundManager(pli, colorPli, playedAtouts )
  
    if (pli.size === table?.size){
        console.log("end round")

        let pliObject = Object.fromEntries(pli)
        await tarotCollection.updateOne(
            {_id : new ObjectId(tableId)},
            {$push : {"gameState.plis" : pliObject}}
        )
        const preneur = await getUserHasTaken(tableId)
        const winnerId = roundManager.getRoundWinner(plis, preneur)
        const winner = await usersCollection.findOne({ _id: new ObjectId(winnerId)})
        let cardsWon = roundManager.updateCardsWon(winner?.tarot.cardsWon, preneur?._id.toString() )
        console.log("winner pli : ", winner?.username, cardsWon.length)
        await usersCollection.updateOne(
            {_id : new ObjectId(winnerId)},
            {$set : {"tarot.cardsWon" : cardsWon}}
        )
        await tarotCollection.updateOne(
            {_id : new ObjectId(tableId)},
            {$set : {"gameState.currentPlayerId" : winnerId}}
        )
        roundManager.restartRound()
        for (const playerId of playersId) {
            await usersCollection.updateOne(
                {_id : new ObjectId(playerId)},
                {$set : {"tarot.hasPlayed" : false, "tarot.playedCard" : undefined}}
            )
        }; 

    
    } else {
        console.log("next player to play")
        const ind = playersId.indexOf(userId)
        const newPlayerId = playersId[((ind+1) % playersId.length)]
        await tarotCollection.updateOne(
            {_id : new ObjectId(tableId)},
            {$set : {"gameState.currentPlayerId" : newPlayerId}}
        ) 
    }

    await tarotCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.pli" : roundManager.pli,
                "gameState.colorPli" : roundManager.colorPli,
                "gameState.playedAtouts" : roundManager.playedAtouts
        }}
    )
    
    const handsEmpties = await areHandsEmpties(playersId)

    if (handsEmpties){
        console.log("end manche")
        const preneur = await getUserHasTaken(tableId)
        const table = await getTableById(tableId)
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
        await tarotCollection.updateOne(
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
        

    const updatedTable = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
    // console.log("updated gameState :", updatedTable?.gameState)

    for (const playerId of playersId){
        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        io.to(playerId).emit("updateTarotContext", updatedUser, updatedTable)
    }; 

    io.to(userId).emit("endPlayableCard")



}

async function areHandsEmpties(playersId){
    let handEmpty = true 
    for (const playerId of playersId){
        const player = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        if (player?.tarot.hand.length !== 0) {
            handEmpty = false 
        }
    }
    return handEmpty
}

  