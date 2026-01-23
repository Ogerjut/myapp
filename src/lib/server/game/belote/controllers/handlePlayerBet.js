import { tablesCollection, usersCollection } from "../../../db/db.js"
import { ObjectId } from "mongodb"
import { getTableById, getUserById } from "../../../db/utils.js"
import checkStartBetBelote from "./checkStartBet.js";
import { Belote } from "../core/belote.js";

export default async function handlePlayerBet(io, tableId, userId, bet, suit){
    const table = await getTableById(tableId)
    const betMap = new Map(Object.entries(table?.gameState.betMap))
    betMap.set(userId, bet)
    const playersId = table?.playersId
    
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.betMap" : betMap}}
    )

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"belote.bet" : bet, "belote.hasBet" : true, "belote.isSpeaker" : false}}
    )
    
    const isBetOver = betMap.size === table?.size || bet === 1

    if (isBetOver){
        console.log("end bet belote")
       const bets = betMap.values()
       const betsEqualZero = bets.every(b => b === 0)
        if (betsEqualZero && table?.gameState.betRound === 2){
            console.log("restart bet")
            checkStartBetBelote(io, tableId)
        }

        if (betsEqualZero && table?.gameState.betRound === 1){
            let betRound = table.gameState.betRound
            betRound++
            await tablesCollection.updateOne(
                {_id : new ObjectId(tableId)},
                {$set : {"gameState.betRound" : betRound}}
            )
            await emitUpdate(io, tableId, playersId)
            return 
        }
           
        betMap.forEach(async (val, id)=> {
            if (val === 1){
                await usersCollection.updateOne(
                    {_id : new ObjectId(id)},
                    {$set : {"belote.hasTaken" : true}}
                )
            }
        })
        await tablesCollection.updateOne(
            {_id : new ObjectId(tableId)},
            {$set : {state : 'game'}}
        )
        

        const belote = new Belote(table)
        // récupérer tous les users 
        belote.loadPlayers()
        belote.startGame()

        await emitUpdate(io, tableId, playersId)
        return 
    }


    console.log("next player to bet")
    const ind = playersId.indexOf(userId)
    const newSpeakerId = playersId[ind+1]
    await usersCollection.updateOne(
        {_id : new ObjectId(newSpeakerId)},
        {$set : {"belote.isSpeaker" : true}}
    ) 
    await emitUpdate(io, tableId, playersId)
      
}

export async function emitUpdate(io, tableId, playersId){
    const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    for (const playerId of playersId) {
        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        io.to(playerId).emit("updateContext", updatedUser, updatedTable)
    };   
}