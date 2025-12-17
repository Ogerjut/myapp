import { ObjectId } from "mongodb";
import { tablesCollection, usersCollection } from "../../../db/db.js"
import { getTableById, getUserById } from "../../../db/utils.js";
import { EndGameScore } from "../core/gameOver.js";


export async function endGame(io, tableId){
    const table = await getTableById(tableId)
    const playersId = table?.playersId
    
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "endGame"}}
    )
    for (const playerId of playersId){
        const player = await getUserById(playerId)
        const endGameScore = new EndGameScore(player)
        const hasBonus = endGameScore.hasBonus
        await usersCollection.updateOne(
            {_id : new ObjectId(playerId)},
            {$set : {"yams.endGameItems" : endGameScore.scoreToJSON(), "yams.hasBonus" : hasBonus,"score.yams" : endGameScore.total}}
        )
        const updatedUser = await getUserById(playerId)
        const updatedTable = await getTableById(tableId)
        io.to(playerId).emit("updateContext", updatedUser, updatedTable )

    }
    
   
   
    


}