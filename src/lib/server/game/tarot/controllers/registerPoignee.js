import { ObjectId } from 'mongodb';
import { usersCollection, tablesCollection } from '../../../db/db.js';

export default async function registerPoignee(io, tableId, userId, poigneeSize) {
	console.log("register poignee")

    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {"tarot.poignee" : poigneeSize}}
    )

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    console.log("poignee size", poigneeSize)
    const hand = updatedUser?.tarot.hand
    const poignee = hand.filter(c => c.suit === "atout").slice(0, poigneeSize)
    console.log("poignée :", poignee)
    
    const poignees = new Map()
    poignees.set(updatedUser?.username, poignee)
    
    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "showPoignee", "gameState.poignees" : poignees}}
    )
    
    const updatedTable = await tablesCollection.findOne({_id : new ObjectId(tableId)})

    io.to(userId).emit("updateUser", updatedUser)
    io.to(tableId).emit("updateTable", updatedTable)

}
