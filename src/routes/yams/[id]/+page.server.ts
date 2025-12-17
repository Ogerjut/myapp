import { tablesCollection, usersCollection } from '$lib/server/db/db.js'
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb'

export async function load({params, locals}){
    const table = await tablesCollection.findOne({_id : new ObjectId(params.id)})
    
    if (!table) {
        throw redirect(302, '/yams'); 
    }
    
    const user = await usersCollection.findOne({_id : new ObjectId(locals.user.id)})
    
    // Convertir les IDs en ObjectId
    const playersObjectIds = table.playersId.map(id => new ObjectId(id))
    const users = await usersCollection.find({_id : {$in : playersObjectIds}}).toArray()
    
    return {
        table : {...table, _id : table._id.toString()},
        user :  {...user, _id : user?._id.toString()},
        users : users.map(u => ({...u, _id: u._id.toString()})) // Optionnel : convertir les _id des users aussi
    }
}