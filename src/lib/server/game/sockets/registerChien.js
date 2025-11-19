import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection } from '../../db/db.js';

export default async function registerChien(io, tableId) {
	console.log("register chien / start 1st round")

    await tarotCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "game", "gameState.pli": new Map()}}
    )
    
    const updatedTable = await tarotCollection.findOne({_id : new ObjectId(tableId)})

    io.to(tableId).emit("updateTableGame", updatedTable)

}
