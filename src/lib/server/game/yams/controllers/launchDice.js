import { ObjectId } from "mongodb";
import { usersCollection, tablesCollection } from "../../../db/db.js";
import { getTableById, getUserById } from "../../../db/utils.js";
import { DicesManager } from "../core/dices.js";
import { ScoreManager } from "../core/score.js";


export default async function launchDices(io, tableId, userId, dicesArray){
    const user = await getUserById(userId)
    // const table = await getTableById(tableId)
    const dicesManager = new DicesManager(dicesArray)
    dicesManager.launchDices()
    const dices = dicesManager.dices
   
    const scoreManager = new ScoreManager(dices, user?.yams.items)
    scoreManager.compute()
    const items = scoreManager.items

    let launches = user?.yams.launches
    if (launches <= 0) return 
    launches--

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"yams.launches" : launches, "yams.items" : items}}
    )

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.dices" : dices}}
    )

    const updatedUser = await getUserById(userId)
    const updatedTable = await getTableById(tableId)

    io.to(userId).emit("updateUser", updatedUser)
    io.to(tableId).emit("updateTable", updatedTable )
}