import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../db/db.js';

export default async function leaveAllTable(io, tableId, game) {
    console.log("leave all table")
    const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    if (!table) return 
    const playersId = table?.playersId

    const ids = playersId.map(id => new ObjectId(id));
    
    await updatePlayers(ids, game)

	await tablesCollection.deleteOne({ _id: new ObjectId(tableId) });
		
	console.log(`table ${tableId} deleted and players ${playersId} left`);
	
    io.to(tableId).emit("leaveAllTable")

}

async function updatePlayers(ids, game){
    switch (game) {
        case "tarot":
            await usersCollection.updateMany(
                {_id: { $in: ids }}, 
                {$set : {inGame: false, tarot : {}, "score.tarot" : 0}
            })        
            break;
            
        case "belote":
            await usersCollection.updateMany(
                {_id: { $in: ids }}, 
                {$set : {inGame: false, belote : {}, "score.belote" : 0}
            })
            break
        
        default:
            break;
    }
}