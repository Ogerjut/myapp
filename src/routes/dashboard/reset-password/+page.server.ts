// src/routes/dashboard/+page.server.ts
import { auth } from "$lib/auth";
import { fail } from '@sveltejs/kit';
import {isValid} from "$lib/server/auth-utils"

export const load = ({ url }) => {
    const token = url.searchParams.get("token");
    if (!token) {
      throw redirect(302, "/login");
    }
    return { token };
};
  

export const actions = {
  resetPassword : async ({url, request}) => {
    const formData = await request.formData();
    const newPassword = formData.get('newPassword');
    const newPassword2 = formData.get('newPassword2');
    const token = url.searchParams.get("token")

    try {
        if (!token) {
            throw new Error("invalid token to reset password")
        }

        isValid(newPassword)

        if(newPassword !== newPassword2){
            throw new Error('Les mots de passe doivent être identiques !')
        }
        
        await auth.api.resetPassword({
            body: {
              newPassword,
              token
            }
          });
    
          return {
            success: true,
            message: "Ton mot de passe a été réinitialisé"
          };
  
    } catch (err) {
        return fail(400, { error : err.message });
    }

  }

};