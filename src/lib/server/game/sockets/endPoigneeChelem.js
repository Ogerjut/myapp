import { ObjectId } from 'mongodb';
import { tarotCollection } from '../../db/db.js';

export default async function endPoigneeChelem(io, tableId) {
	console.log("end poignée chelem")

    await tarotCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "game", "gameState.pli": new Map()}}
    )
    
    const updatedTable = await tarotCollection.findOne({_id : new ObjectId(tableId)})

    io.to(tableId).emit("updateTable", updatedTable)

}
