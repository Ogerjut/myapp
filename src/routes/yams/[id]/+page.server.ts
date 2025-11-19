import { yamsCollection, usersCollection } from '$lib/server/db/db.js'
import { redirect } from '@sveltejs/kit';
import {ObjectId} from 'mongodb'


export async function load({params, locals}){
    const table = await yamsCollection.findOne({_id : new ObjectId(params.id)})
    const user = await usersCollection.findOne({_id : new ObjectId(locals.user.id)})
    
    if (!table) {
      throw redirect(302, '/yams'); 
    }
    return {
        table : {...table, _id : table._id.toString()},
        user :  {...user, _id : user?._id.toString()},
    }
}