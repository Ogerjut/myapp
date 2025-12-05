import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../db/db.js';


export default async function gameOver(io, tableId) {
    const table = await tablesCollection.findOne({_id : new ObjectId(tableId)})
    const playersId = table?.playersId

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {completed : true, state : "endGame"}}
    )
    const updatedTable = await tablesCollection.findOne({_id : new ObjectId(tableId)})

    for (const playerId of playersId){
        // mettre à jour les stats (games + 1) et vainqueur victory +1
        
        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(playerId)});
        io.to(playerId).emit("updateTarotContext", updatedUser, updatedTable)
    }; 

  

}

  