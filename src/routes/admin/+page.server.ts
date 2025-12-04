import { redirect, fail, error } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import type { Actions, PageServerLoad } from "./$types.js";
import { usersCollection, tarotCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'
import { deleteCompletedTables } from "$lib/server/db/utils";

export const load: PageServerLoad = async ({ locals }) => {
  // Rediriger si pas de session
  console.log("user.role", locals.user.role)
  if (!locals.session) {
    throw redirect(302, "/");
  }
  if (locals.user.role != 'admin') {
    throw error(403, "Access denied");
  }

  const users = await usersCollection.find().toArray();
  const tables = await tarotCollection.find().toArray();
  
  return  {
      users : users.map(u => ({ ...u, _id: u._id.toString() })),
      tarotTables : tables.map(t => ({ ...t, _id: t._id.toString() }))
  }

}



export const actions = {
  deleteCompletedTables: async () => {
      const result = await deleteCompletedTables();
      return { success: true, deletedCount: result.deletedCount };
  },
  
  deleteTable: async ({ request }) => {
      const formData = await request.formData();
      const tableId = formData.get('tableId');
      
      const result = await tarotCollection.deleteOne({ 
          _id: new ObjectId(tableId) 
      });
      
      return { success: true, deletedCount: result.deletedCount };
  }
};