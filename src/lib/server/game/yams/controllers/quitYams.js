import { ObjectId } from "mongodb";
import { tablesCollection, usersCollection } from "../../../db/db.js"
import { getTableById, getUserById } from "../../../db/utils.js";


export async function quitYams(io, tableId, userId){
    const table = await getTableById(tableId)

    await tablesCollection.updateOne(
        {_id : new ObjectId(tableId)},
        {$set : {state : "endGame"}}
    )
    await usersCollection.updateOne(
        {_id : new ObjectId(userId)},
        {$set : {state : "endGame"}}
    )
    





    const updatedUser = await getUserById(userId)
    const updatedTable = await getTableById(tableId)
    io.to(userId).emit("updateContext", updatedUser, updatedTable )

    }
    
   
   
    


}