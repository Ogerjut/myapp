
import {tablesCollection, usersCollection} from '$lib/server/db/db.js'
import {ObjectId} from 'mongodb'
import { fail } from '@sveltejs/kit';

export const actions = {
  createTable : async({request}) => {
      const formData = await request.formData();
      const gameMode = Number(formData.get('gameMode'))
  
      try {

        const table = await tablesCollection.insertOne({
          created : Date.now(),
          size : 4,
          ready : false,
          completed : false,
          playersId : [],
          state : "created",
          gameMode : gameMode,
          gameState : {},
        })
        
        const createdTable = await tablesCollection.findOne({_id : table.insertedId})
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