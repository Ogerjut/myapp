import { ObjectId } from 'mongodb';
import { tablesCollection } from '../../../db/db.js';

export default async function endPoigneeChelem(io, tableId) {
	console.log("end poignée chelem")

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "game", "gameState.pli": new Map()}}
    )
    
    const updatedTable = await tablesCollection.findOne({_id : new ObjectId(tableId)})

    io.to(tableId).emit("updateTable", updatedTable)

}
