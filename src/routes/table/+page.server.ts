
import {tarotCollection, usersCollection} from '$lib/server/db/db.js'
import {ObjectId} from 'mongodb'
import { fail } from '@sveltejs/kit';

export const actions = {
  createTable : async({request}) => {
      const formData = await request.formData();
  
      try {

        const table = await tarotCollection.insertOne({
          created : Date.now(),
          size : Number(formData.get('nbPlayers')),
          ready : false,
          completed : false,
          playersId : [],
          state : "created",
          roundMax : 3,
          gameState : {},
        })
        
        const createdTable = await tarotCollection.findOne({_id : table.insertedId})
        // console.log("created table:", createdTable)

        return {
            success: true,
            message: 'Table created successfully',
            table : {...createdTable, _id : createdTable._id.toString()}
          };

      } catch (err) {
        console.log(err)
          return fail(400, { error : err.message });
      }
  }
}