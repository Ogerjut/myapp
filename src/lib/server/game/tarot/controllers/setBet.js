import { ObjectId } from 'mongodb';
import { tablesCollection, usersCollection } from '../../../db/db.js';
import checkStartBetTarot from './startBet.js';

// a déplacer lors refactorisation
export async function emitUpdate(io, tableId, playersId){
    const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    for (const playerId of playersId) {
        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        io.to(playerId).emit("updateContext", updatedUser, updatedTable)
    };   
}

export default async function setBet(io, tableId, userId, bet) {
    const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    const betMap = new Map(Object.entries(table?.gameState.betMap))
    betMap.set(userId, bet)
    const playersId = table?.playersId
    
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.betMap" : betMap}}
    )

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"tarot.bet" : bet, "tarot.hasBet" : true, "tarot.isSpeaker" : false}}
    )
    
    if (bet > table?.gameState.actualBet){
        await tablesCollection.updateOne(
            {_id : new ObjectId(tableId)},
            {$set : {"gameState.actualBet" : bet}}
        )
    }

    const isBetOver = betMap.size === table?.size || bet === 4

    if (isBetOver){
        console.log("end bet tarot")
        let max = 0
        betMap.forEach((val, key)=> max = Math.max(max, val))
        if (max === 0){
            console.log("restart bet")
            checkStartBetTarot(io, tableId)

        } else {

            betMap.forEach(async (val, key)=> {
                if (max === val){
                    await usersCollection.updateOne(
                        {_id : new ObjectId(key)},
                        {$set : {"tarot.hasTaken" : true}}
                    )
                }
            })

            if (max < 3){
                await tablesCollection.updateOne(
                    {_id : new ObjectId(tableId)},
                    {$set : {state : 'setupChien'}}
                )
            } else {
                await tablesCollection.updateOne(
                    {_id : new ObjectId(tableId)},
                    {$set : {state : 'beforeGame'}}
                )
            }
            await emitUpdate(io, tableId, playersId)
        }
        return 
    }


    console.log("next player to bet tarot")
    const ind = playersId.indexOf(userId)
    const newSpeakerId = playersId[ind+1]
    await usersCollection.updateOne(
        {_id : new ObjectId(newSpeakerId)},
        {$set : {"tarot.isSpeaker" : true}}
    ) 
    await emitUpdate(io, tableId, playersId)
      



        

}
