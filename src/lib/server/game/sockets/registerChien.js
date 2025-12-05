import { ObjectId } from 'mongodb';
import { tablesCollection } from '../../db/db.js';

export default async function registerChien(io, tableId) {
	console.log("register chien")

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "beforeGame"}}
    )
    
    const updatedTable = await tablesCollection.findOne({_id : new ObjectId(tableId)})

    io.to(tableId).emit("updateTable", updatedTable)

}
