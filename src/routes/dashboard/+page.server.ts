// src/routes/dashboard/+page.server.ts
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import type { Actions, PageServerLoad } from "./$types.js";
import { usersCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'

export const load: PageServerLoad = async ({ locals }) => {
  // Rediriger si pas de session
  if (!locals.session) {
    throw redirect(302, "/signin");
  }
};

export const actions: Actions = {
  signout: async ({ request, locals }) => {
    console.log("locals :", locals)
    await usersCollection.updateOne(
        {_id : new ObjectId(locals.user.id) },
        {$set : {isActive : false}}
    )
    const user = await usersCollection.findOne({_id : new ObjectId(locals.user.id) })
    console.log("signout user : ", user)


    try {
      await auth.api.signOut({
        headers: request.headers,
      });

        
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }

    throw redirect(302, "/");
  },
};