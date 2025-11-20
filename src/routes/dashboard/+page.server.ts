// src/routes/dashboard/+page.server.ts
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import type { Actions, PageServerLoad } from "./$types.js";
import { usersCollection } from "$lib/server/db/db.js"
import {ObjectId} from 'mongodb'
import { fail } from '@sveltejs/kit';

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


  changePassword : async ({request}) => {
    const formData = await request.formData();
    const newPassword = formData.get('newPassword');
    const newPassword2 = formData.get('newPassword2');
    const password = formData.get('password');

    try {
      if(newPassword !== newPassword2){
          throw new Error('Les mots de passe doivent être identiques !')
      }
  
    } catch (err) {
        return fail(400, { error : err.message });
    }

    try {
      const data = await auth.api.changePassword({
        body: {
            newPassword: newPassword, // required
            currentPassword: password, // required
            revokeOtherSessions: true,
        },
        // This endpoint requires session cookies.
        headers: request.headers,
      });
      return {success : true, message : 'Ton mot de passe a été changé'}
      
    } catch (err) {
        return fail(400, { error : err.message });
    }
    
  }
};