import { ObjectId } from 'mongodb';
import { tarotCollection } from '../../db/db.js';

export default async function endShowPoignee(io, tableId) {
	console.log("end show poignée")

    await tarotCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "beforeGame"}}
    )
    
    const updatedTable = await tarotCollection.findOne({_id : new ObjectId(tableId)})

    io.to(tableId).emit("updateTable", updatedTable)

}