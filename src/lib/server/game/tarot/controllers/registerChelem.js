import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection} from '../../../db/db.js';

export default async function registerChelem(io, tableId, userId) {
	console.log("register chelem")
    const table = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
    const firstPlayerId = table?.gameState.currentPlayerId

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"tarot.chelem" : true}}
    )

    if (userId !== firstPlayerId){
        await tablesCollection.updateOne(
            {_id : new ObjectId( firstPlayerId)},
            {$set : {"gameState.currentPlayerId" : userId }}
        )
        const updatedTable = await tablesCollection.findOne({ _id: new ObjectId(tableId) });
        io.to(tableId).emit("updateTable", updatedTable)
    }
    
    const updatedUser = await usersCollection.findOne({_id : new ObjectId(userId)})
    io.to(userId).emit("updateUser", updatedUser)

}