import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../db/db.js';

export default async function leaveAllTable(io, socket, tableId) {
    console.log("leave all table")
    const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    if (!table) return 
    const playersId = table?.playersId

    const ids = playersId.map(id => new ObjectId(id));
    
    await usersCollection.updateMany(
        {_id: { $in: ids }}, 
        {$set : {inGame: false, tarot : {}, "score.tarot" : 0}
    })

	await tablesCollection.deleteOne({ _id: new ObjectId(tableId) });
		
	console.log(`table ${tableId} deleted and players ${playersId} left`);
	
    io.to(tableId).emit("leaveAllTable")

}
