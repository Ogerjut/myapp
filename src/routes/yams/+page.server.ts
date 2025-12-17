
import {tablesCollection, usersCollection} from '$lib/server/db/db.js'
import {ObjectId} from 'mongodb'
import { fail } from '@sveltejs/kit';

export const actions = {
  createTable : async({request}) => {
      const formData = await request.formData();
  
      try {

        const table = await tablesCollection.insertOne({
          created : Date.now(),
          size : Number(formData.get('nbPlayers')),
          ready : false,
          completed : false,
          playersId : [],
          state : "created",
          gameState : {},
        })
        
        const createdTable = await tablesCollection.findOne({_id : table.insertedId})

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