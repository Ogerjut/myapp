// src/routes/dashboard/+page.server.ts
import { auth } from "$lib/auth";
import type { Actions, PageServerLoad } from "./$types.js";
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  resetPassword : async ({request}) => {
    const formData = await request.formData();
    const newPassword = formData.get('newPassword');
    const newPassword2 = formData.get('newPassword2');

    try {
      if(newPassword !== newPassword2){
          throw new Error('Les mots de passe doivent être identiques !')
      }
  
    } catch (err) {
        return fail(400, { error : err.message });
    }

    const token = new URLSearchParams(window.location.search).get("token");

    try {

        if (!token) {
            throw new Error("invalid token to reset password")
        }

        const data = await auth.api.resetPassword({
            body: {
                newPassword: newPassword, // required
                token, // required
            },
        });
        if (data.status){
            return {success : true, message : 'Ton mot de passe a été changé'}
          } else {
            throw new Error(`Erreur( ${data.status}) lors de la réinitialisation du mot de passe`)
          }
      
    } catch (err) {
        return fail(400, { error : err.message });
    }
    
  }
};