import { ObjectId } from 'mongodb';
import { usersCollection, tarotCollection} from '../../db/db.js';

export default async function registerChelem(io, tableId, userId) {
	console.log("register chelem")
    const table = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
    const firstPlayerId = table?.gameState.currentPlayerId

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"tarot.chelem" : true}}
    )

    if (userId !== firstPlayerId){
        await tarotCollection.updateOne(
            {_id : new ObjectId( firstPlayerId)},
            {$set : {"gameState.currentPlayerId" : userId }}
        )
        const updatedTable = await tarotCollection.findOne({ _id: new ObjectId(tableId) });
        io.to(tableId).emit("updateTable", updatedTable)
    }
    
    const updatedUser = await usersCollection.findOne({_id : new ObjectId(userId)})
    io.to(userId).emit("updateUser", updatedUser)

}