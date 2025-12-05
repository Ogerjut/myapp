import { tablesCollection, usersCollection } from '$lib/server/db/db.js'
import { redirect } from '@sveltejs/kit';
import {ObjectId} from 'mongodb'


export async function load({params, locals}){
    // console.log("params id", params.id)
    const table = await tablesCollection.findOne({_id : new ObjectId(params.id)})
    const user = await usersCollection.findOne({_id : new ObjectId(locals.user.id)})
    
    if (!table) {
      throw redirect(302, '/table'); 
    }
    return {
        table : {...table, _id : table._id.toString()},
        user :  {...user, _id : user._id.toString()},
    }
}

export const actions = {
  bet : async({params, locals, request}) => {
      const formData = await request.formData();
      const bet = Number(formData.get('bet'))
  
      try {
        return {
            success: true,
            bet : bet,
          };

      } catch (err) {
        console.log(err)
          return fail(400, { error : err.message });
      }
  }

}
