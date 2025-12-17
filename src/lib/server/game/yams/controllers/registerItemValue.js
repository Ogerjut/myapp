import { ObjectId } from "mongodb";
import { tablesCollection, usersCollection } from "../../../db/db.js"
import { getTableById, getUserById } from "../../../db/utils.js";
import { DicesManager } from "../core/dices.js";
import { ItemsManager } from "../core/items.js";
import { endGame } from "./endGame.js";


export async function registerItemValue(io, tableId, userId, item){
    const user = await getUserById(userId)
    const items = user?.yams.items
    const itemsManager = new ItemsManager(items, item)
    itemsManager.updateItems()

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"yams.items" : itemsManager.items, "yams.launches" : 3}}
    )
    
    const table = await getTableById(tableId)
    const playersId = table?.playersId
    const isEndGame = await checkEndGame(playersId)
    if (isEndGame){
        await endGame(io, tableId)
        return 
    }

    const dicesManager = new DicesManager(table?.gameState.dices)
    dicesManager.resetDices()
    const ind = playersId.indexOf(userId);
	const newPlayerId = playersId[(ind + 1) % playersId.length];
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {"gameState.dices" : dicesManager.dices, "gameState.currentPlayerId" : newPlayerId}}
    )

    const updatedUser = await getUserById(userId)
    io.to(userId).emit("updateUser", updatedUser)
    const updatedTable = await getTableById(tableId)
    io.to(tableId).emit("updateTable", updatedTable )

}

async function checkEndGame(playersId){
    let endgame = true
    for (const playerId of playersId){
        const player = await getUserById(playerId)
        const items = player?.yams.items
        if (items.filter(item => item.done != true).length != 0){
            endgame = false 
        }
    }
    return endgame
}